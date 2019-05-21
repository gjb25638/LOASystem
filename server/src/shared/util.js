const fs = require("fs")
const path = require("path")

module.exports = {
    diffMonth,
    toDateInfo,
    formatDate,
    importJSON,
    calculateTotals,
    sumUp,
    renew
}

function diffMonth(from, to) {
    let fromMonths, toMonths;
    fromMonths = from.getFullYear() * 12 + from.getMonth()
    toMonths = to.getFullYear() * 12 + to.getMonth() + (to.getDate() < from.getDate() ? -1 : 0)
    return toMonths >= fromMonths ? toMonths - fromMonths : 0;
}

function toDateInfo(date) {
    return date
        ? {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            date
        }
        : undefined
}

function formatDate(dateString) {
    if (dateString) {
        const date = dateString === "now" ? new Date() : new Date(dateString)
        const year = date.getFullYear().toString()
        let month = (date.getMonth() + 1).toString()
        let day = date.getDate().toString()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return [year, month, day].join('-');
    } else {
        return ""
    }
}

function importJSON(relativeDirPath, filename) {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, relativeDirPath, filename), 'utf8'))
}

function calculateTotals(records) {
    return sumUp(records.map(record => record.totals))
}

function sumUp(daysNHalfHoursInfos) {
    const result = { days: 0, hours: 0 }
    daysNHalfHoursInfos.forEach(({ days, halfHours }) => {
        if (halfHours > 0) {
            result.hours += halfHours / 2
            if (result.hours >= 8) {
                result.days += Math.floor(result.hours / 8)
                result.hours = result.hours % 8
            }
        } else {
            result.days += days
        }
    })
    return result
}

function renew(obj, props) {
    return Object.assign({}, obj._doc ? obj._doc : obj, props)
}