const XlsxPopulate = require('xlsx-populate');
const RichText = XlsxPopulate.RichText;
const headers = require('./header');

module.exports = {
    populate
}

function populate(year, data, cb) {
    const sheetName = `${year}總表`
    const fileName = `${year}年度請假報表.xlsx`
    XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            const sheet = initSheet(workbook, sheetName)
            const allLTsTotalsCounters = {}
            headers.forEach(header => {
                const column = sheet.column(header.name)
                const cell = initCell(sheet, header.name)
                initStyles(header, cell, column, sheet, header.merged)
                printUnderline(cell)
                const year1 = year + header.dataKey.index - 1
                const year2 = year + header.dataKey.index
                const title = isStringValue(header.title) ?
                    header.title :
                    stringFormat(header.title.format, [`${year1}-${year2}`])
                cell.value(title)
            })
            const enabledEmployees = data.report.filter(employee => employee.enabled)
            enabledEmployees.forEach((employee, index) => {
                const rowNumber = index + 1 + 1
                headers.forEach(header => {
                    const cell = initCell(sheet, header.name, rowNumber)
                    initStyles(header, cell)
                    if (isLastRow(enabledEmployees.length, index)) {
                        printUnderline(cell)
                    }
                    if (isEmployeeInfoArea(header.dataKey)) {
                        cell.value(employee[header.dataKey])
                    } else if (isNotEmployeeInfoArea(header.dataKey)) {
                        if (isMonthlyReportArea(header.dataKey.month)) {
                            const target = employee.recordGroups.find(group => group.month === header.dataKey.month)
                            cell.value(new RichText())
                            const richText = cell.value()
                            target.list.sort(comparer).forEach(item => {
                                const targetHeader = headers.find(header => header.dataKey.leaveType === item.key)
                                const targetStyle = targetHeader ? targetHeader.styles.find(style => style.name === 'fontColor') : undefined
                                const fontColor = targetStyle ? targetStyle.value : undefined
                                richText.add(`${totalsToString(item.totals, item.key)}\n`, { fontColor })
                            })
                        } else if (isLTReportArea(header.dataKey.leaveType)) {
                            const compensatoryLTName = "compensatory"
                            if (header.dataKey.leaveType === compensatoryLTName) {
                                const target = employee.leaveTypeGroups
                                    .find(group => header.dataKey.leaveType === compensatoryLTName && isCompensatoryLT(group.key))
                                if (target) {
                                    const totals = totalsListMapping(target.list, header.dataKey.unit);
                                    sumUpLTTotals(allLTsTotalsCounters, totals, compensatoryLTName, header.dataKey.unit)
                                    cell.value(totalsToString(totals))
                                }
                            } else {
                                const target = employee.leaveTypeGroups
                                    .find(group => group.key === header.dataKey.leaveType)
                                if (target) {
                                    if (header.dataKey.unit) {
                                        const totals = totalsListMapping(target.list, header.dataKey.unit);
                                        sumUpLTTotals(allLTsTotalsCounters, totals, target.key, header.dataKey.unit)
                                        cell.value(totalsToString(totals))
                                    } else {
                                        const totals = sumUpTotals(target.list.map(item => item.totals))
                                        sumUpLTTotals(allLTsTotalsCounters, totals, target.key)
                                        cell.value(totalsToString(totals))
                                    }
                                }
                            }
                        } else if (isAnnualInfoArea(header.dataKey.index)) {
                            const info = employee.annualInfo[header.dataKey.index]
                            if (header.dataKey.type === "remaining") {
                                const remainingTotals = { days: info.totalDays - info.totals.days }
                                const remainingStr = totalsToString(remainingTotals)
                                cell.value(remainingStr ? remainingStr : '0天')
                            } else if (header.dataKey.type === "deadline") {
                                const deadlinePlusXYear = (year + header.dataKey.index) + employee.arrivedDate.substr(4)
                                cell.value(deadlinePlusXYear)
                            }
                        }
                    }
                })
            })
            headers.filter(header => isNotEmployeeInfoArea(header.dataKey) && isLTReportArea(header.dataKey.leaveType))
                .forEach(header => {
                    const cell = sheet.cell(`${header.name}${data.report.length + 2}`)
                    header.styles.forEach(style => cell.style(style.name, style.value))
                    const key = header.dataKey.unit ? `${header.dataKey.leaveType}.${header.dataKey.unit}` : header.dataKey.leaveType
                    cell.value(totalsToString(sumUpTotals(allLTsTotalsCounters[key])))
                })
            return workbook.outputAsync();
        }).then((data) => cb(data, fileName));
}

function totalsToString({ days, hours }, leaveType = "") {
    const map = {
        "annual": "特休",
        "compensatory": "補休",
        "marriage": "婚假",
        "funeral": "喪假",
        "menstrual": "生理假",
        "sick": "病假",
        "personal": "事假",
        "familyCare": "家庭照顧假"
    }
    return (map[leaveType] ? map[leaveType] : leaveType) +
        (leaveType ? " " : '') +
        (days > 0 ? `${days}天` : '') +
        (hours > 0 ? `${hours}H` : '')
}

function isCompensatoryLT(leaveType) {
    return leaveType.startsWith("補休")
}

function sumUpTotals(totalsList) {
    const result = { days: 0, hours: 0 }
    if (totalsList) {
        totalsList.forEach(({ days: days = 0, halfHours: halfHours = 0, hours: hours = 0 }) => {
            if (halfHours && halfHours > 0) {
                result.hours += halfHours / 2
            } else if (hours && hours > 0) {
                result.hours += hours
            }
            else {
                result.days += days
            }
        })
    }
    return result
}

function initSheet(workbook, name) {
    const sheet = workbook.addSheet(name)
    workbook.deleteSheet("Sheet1")
    return sheet
}

function initStyles(header, cell, column, sheet, mergedToCellName) {
    header.styles.forEach(style => cell.style(style.name, style.value))
    if (column) {
        column.width(header.width)
    }
    if (mergedToCellName && header.merged) {
        const mergedToCell = sheet.cell(`${mergedToCellName}1`)
        const range = cell.rangeTo(mergedToCell)
        range.merged(mergedToCell)
    }
}

function initCell(sheet, columnName, rowNumber = 1) {
    return sheet.cell(`${columnName}${rowNumber}`)
}

function isStringValue(value) {
    return typeof value === typeof ""
}

function isNumberValue(value) {
    return typeof value === typeof 0
}

function stringFormat(str, ...args) {
    args.forEach((arg, index) => str = str.replace(`{${index}}`, arg))
    return str
}

function totalsListMapping(totalsList, unit) {
    let newTotalsList = [];
    if (unit === "day") {
        newTotalsList = totalsList.map(item => ({ days: item.totals.days }))
    } else if (unit === "hour") {
        newTotalsList = totalsList.map(item => ({ halfHours: item.totals.halfHours }))
    }
    return sumUpTotals(newTotalsList)
}

function sumUpLTTotals(allLTsTotalsCounters, totals, ltName, unit) {
    const key = ltName + (unit ? `.${unit}` : '')
    if (allLTsTotalsCounters[key]) {
        allLTsTotalsCounters[key].push(totals)
    } else {
        allLTsTotalsCounters[key] = [totals]
    }
}

function isEmployeeInfoArea(headerDataKey) {
    return isStringValue(headerDataKey)
}

function isNotEmployeeInfoArea(headerDataKey) {
    return !!headerDataKey
}

function isMonthlyReportArea(headerDataKeyMonth) {
    return isNumberValue(headerDataKeyMonth)
}

function isLTReportArea(leaveType) {
    return !!(leaveType !== undefined)
}

function isAnnualInfoArea(headerDataKeyIndex) {
    return isNumberValue(headerDataKeyIndex)
}

function isLastRow(length, index) {
    return index === length - 1
}

function printUnderline(cell) {
    cell.style("bottomBorderStyle", "medium")
}

function comparer(a, b) {
    const aScore = getLTScore(a.key)
    const bScore = getLTScore(b.key)
    return aScore < bScore
}

function getLTScore(leaveType) {
    const scores = {
        "personal": 0,
        "sick": 1,
        "menstrual": 2,
        "funeral": 3,
        "marriage": 4,
        "compensatory": 5,
        "annual": 6
    }
    return scores[leaveType] ? scores[leaveType] : (isCompensatoryLT(leaveType) ? scores["compensatory"] : -1)
}