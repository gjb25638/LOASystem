const nodemailer = require('nodemailer')
const sendingFrom = 'infostrum.com@gmail.com'
const template = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title></title>
</head>
<body style="background-color: #35374e;color: #fff;font-family: 微軟正黑體, sans-serif;">
  <div style="margin: 40px;">
    <img style="width: 500px" src="cid:logo">
    <h2 style="color: #fff;">LOASystem {{subject}}:</h2>
    <div style="text-align: center;">
      {{detail}}
      <a style="color:#c32b7f;" href="http://10.110.1.200:8080">LOASystem 登入</a>
    </div>
  </div>
</body>
</html>`

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: sendingFrom,
        pass: 'inf05trum@it'
    }
})

function sendLeaveSigningEmail({ taker, signer, record }) {
    const subject = "系統通知 - 簽核";
    const detailTemplate = `<p style="color: #fff;">您好, 不久前 <strong style="background-color:#c32b7f;">{{signer}}</strong> 已經完成簽核:</p>
    <table align="center">
      <tbody>
        {{leaveTRs}}
      </tbody>
    </table>
    <p style="color: #fff;">若還有簽核人員尚未完成, 再請 <strong style="background-color:#c32b7f;">{{taker}}</strong> 等候作業.</p>`
    const detail = detailTemplate
        .replace(/{{taker}}/g, formatEmployee(taker))
        .replace(/{{signer}}/g, formatEmployee(signer))
        .replace(/{{leaveTRs}}/g, formatRecordTR(record))
    const body = template.replace(/{{subject}}/g, subject)
        .replace(/{{detail}}/g, detail);
    sendEmail({ tos: [taker.email, signer.email], subject, body })
}

function sendLeaveTakingEmail({ taker, signers, records }) {
    const subject = "系統通知 - 請假";
    const detailTemplate = `<p style="color: #fff;">您好, 不久前 <strong style="background-color:#c32b7f;">{{taker}}</strong> 已經完成請假:</p>
    <table align="center">
      <tbody>
        {{leaveTRs}}
      </tbody>
    </table>
    <p style="color: #fff;">再請簽核人員 <strong style="background-color:#c32b7f;">{{signers}}</strong> 完成簽核.</p>`
    const detail = detailTemplate.replace(/{{taker}}/g, formatEmployee(taker))
        .replace(/{{signers}}/g, signers.map(formatEmployee).join(', '))
        .replace(/{{leaveTRs}}/g, records.map(formatRecordTR).join(''))
    const body = template.replace(/{{subject}}/g, subject)
        .replace(/{{detail}}/g, detail);
    sendEmail({ tos: [taker.email, ...signers.map(signer => signer.email)], subject, body })
}

function sendEmail({ tos, subject, body }) {
    const emails = tos.filter(to => !!to);
    if (emails.length > 0) {
        const options = {
            from: sendingFrom,
            to: emails[0],
            cc: emails.length > 1 ? emails.slice(1).join(',') : '',
            subject,
            html: body,
            attachments: [{
                filename: 'logo.png',
                path: __dirname + '/assets/logo.png',
                cid: 'logo'
            }],
        };

        transporter.sendMail(options, function (error, info) {
            console.log(`Sending email to ${emails.join(',')}: ${error ? error : info.response}`);
        });
    }
}

function formatEmployee(employee) {
    return `[${employee.dept}] ${employee.name}(${employee.username})`
}

function formatRecordTR(record) {
    const leaveTypes = {
        sick: {
            title: '普通傷病假',
            color: '#ffc107'
        },
        familyCare: {
            title: '家庭照顧假',
            color: '#ffc107'
        },
        personal: {
            title: '事假',
            color: '#ff5722'
        },
        annual: {
            title: '特別休假',
            color: '#03a9f4'
        },
        annualPreRequest: {
            title: '預請特別休假',
            color: '#b3e5fc'
        },
        menstrual: {
            title: '生理假',
            color: '#f48fb1'
        },
        preManternity: {
            title: '產檢假',
            color: '#f48fb1'
        },
        manternityMiscarriage: {
            title: '產假(含流產假)',
            color: '#f48fb1'
        },
        accompanyingManternity: {
            title: '陪產假',
            color: '#f48fb1'
        },
        marriage: {
            title: '婚假',
            color: '#ff1744'
        },
        funeral: {
            title: '喪假',
            color: '#607d8b'
        },
        businessTrip: {
            title: '出差假',
            color: '#c32b7f'
        }
    }
    const leaveType = leaveTypes[record.leaveType];
    return `<tr>
    <td><span style="color:${leaveType ? leaveType.color : '#6d4c41'}">[${leaveType ? leaveType.title : leaveType}]</span></td> 
    <td>${generateSummary(record.dates, record.startFrom, record.endTo)}</td>
    <td>(${generateConsumeSummary(record.dates, record.startFrom, record.endTo)})</td>`
        + (record.signings && record.signings.length > 0 ? `<td>${record.signings.map(signing => `${formatEmployee(signing)}${signing.pass ? ' <span style="color:lightgreen">已簽核</span>' : ' <span style="color:orangered">已退回</span>'}`).join(`<br/>`)}</td>` : '')
        + `</tr>`
}

function generateSummary(dates, startFrom, endTo) {
    dates = dates.map(d => formatDate(d))
    if (dates.length > 1) {
        return dates.join(', ')
    } else {
        if (startFrom && endTo) {
            return `${dates[0]} - ${startFrom} ~ ${endTo}`
        } else {
            return dates[0]
        }
    }
}

function generateConsumeSummary(dates, startFrom, endTo) {
    dates = dates.map(d => formatDate(d))
    if (startFrom && endTo) {
        return (
            calculateTotalHours(startFrom, endTo) + ' 時'
        )
    } else {
        return dates.length + ' 天'
    }
}

function formatDate(dateString) {
    return dateString
        ? dateString === 'now'
            ? new Date().toJSON().substr(0, 10)
            : new Date(dateString).toJSON().substr(0, 10)
        : ''
}

function calculateTotalHours(startFrom, endTo) {
    if (startFrom && endTo) {
        const fromHours =
            parseInt(startFrom.substr(0, 2)) +
            (startFrom.substr(3, 2) === '00' ? 0 : 0.5)
        const endHours =
            parseInt(endTo.substr(0, 2)) + (endTo.substr(3, 2) === '00' ? 0 : 0.5)
        if (endHours > fromHours) {
            return endHours - fromHours
        } else {
            return -1
        }
    }
    return 0
}
module.exports = {
    sendLeaveSigningEmail,
    sendLeaveTakingEmail,
    sendEmail
};