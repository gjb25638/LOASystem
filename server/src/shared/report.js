const c = require("../shared/collection")
const lt = require("../shared/leavetype")
const u = require("../shared/util")

module.exports = {
    produce,
    filterBetweenDates,
    groupByLeaveType,
    filterMatchedDates,
    groupBy,
    filterWithin,
    getAnnualLTTotalDays,
    transformToAnnualInfo
}

function produce({ loginuser, employees, year, month, groupby }) {
    return {
        fullControl: c.predicate.isAdministrator(loginuser),
        report: month ? produceMonthly({ loginuser, employees, year, month, groupby }) : produceAnnual({ loginuser, employees, year, groupby })
    }
}

function produceAnnual({ loginuser, employees, year, groupby }) {
    return employees
        .filter(employee => c.predicate.isEmployeeUnderLoginuserControl(loginuser, employee))
        .map(employee => {
            const basic = getBasicInfo(employee)
            const records = shrink(employee.records, year)
            if (groupby) {
                const recordGroups = group(records)
                const leaveTypeGroups = groupByLeaveType(records)
                    .map(leaveTypeGroup => {
                        leaveTypeGroup.totals = u.calculateTotals(leaveTypeGroup.list)
                        return leaveTypeGroup
                    });
                const annualLeaves = employee.records
                    .filter(record =>
                        c.predicate.isRecordAllSignedPass(record) &&
                        record.leaveType === 'annual')
                const annualInfo = transformToAnnualInfo(annualLeaves, getAnnualLTTotalDays(employee.arrivedDate, year))
                basic.recordGroups = recordGroups
                basic.leaveTypeGroups = leaveTypeGroups
                basic.annualInfo = annualInfo
                return basic
            } else {
                basic.records = records
                return basic
            }
        })
}

function produceMonthly({ loginuser, employees, year, month, groupby }) {
    return employees
        .filter(employee => c.predicate.isEmployeeUnderLoginuserControl(loginuser, employee))
        .map(employee => {
            const bascInfo = getBasicInfo(employee)
            if (groupby) {
                const records = shrink(employee.records, year, month)
                const recordGroups = group(records, month)
                const leaveTypeGroups = groupByLeaveType(records)
                    .map(leaveTypeGroup => {
                        leaveTypeGroup.totals = u.calculateTotals(leaveTypeGroup.list)
                        return leaveTypeGroup
                    })
                bascInfo.recordGroups = recordGroups
                bascInfo.leaveTypeGroups = leaveTypeGroups
                return bascInfo
            } else {
                const records = shrink(employee.records, year, month, false)
                bascInfo.records = records.map(record => Object.assign({}, record, { dates: filterMatchedDates(record.dates, { month: month }) }))
                return bascInfo
            }
        })
}

function getBasicInfo({
    _id,
    employeeID,
    dept,
    name,
    username,
    enabled,
    level,
    email,
    arrivedDate }) {
    return {
        _id,
        employeeID,
        dept,
        name,
        username,
        enabled,
        level,
        email,
        arrivedDate: u.formatDate(arrivedDate)
    }
}

function shrink(records, year, month, onlySignedPass = true) {
    return filterWithin(records
        .filter(record =>
            (onlySignedPass ?
                c.predicate.isRecordAllSignedPass(record) :
                !c.predicate.isRecordSignedReject(record)))
        .map(record => {
            const a = u.renew(record, {
                pass: c.predicate.isRecordAllSignedPass(record)
            })
            return (onlySignedPass ? record : a)
        }),
        year,
        month)
}

function group(records, month) {
    return groupBy(records, month)
        .map(groupByLeaveType)
        .map((dateGroup, index) => {
            const result = {
                list: dateGroup.map(leaveTypeGroup =>
                    u.renew(leaveTypeGroup, { totals: u.calculateTotals(leaveTypeGroup.list) }))
            }
            return u.renew(result, month ? { day: index } : { month: index })
        })
}

function getAnnualLTTotalDays(arrivedDate, year) {
    const arrivedDateInfo = u.toDateInfo(arrivedDate)
    const { totalsDaysThisYear, totalsDaysNextYear } = lt.getAnnualLTTotalDays(
        arrivedDateInfo.date,
        new Date(year - 1, arrivedDateInfo.month - 1 + 6, arrivedDateInfo.day))
    return [
        {
            start: new Date(year - 1, arrivedDateInfo.month - 1, arrivedDateInfo.day),
            end: new Date(year, arrivedDateInfo.month - 1, arrivedDateInfo.day),
            days: totalsDaysThisYear
        }, {
            start: new Date(year, arrivedDateInfo.month - 1, arrivedDateInfo.day),
            end: new Date(year + 1, arrivedDateInfo.month - 1, arrivedDateInfo.day),
            days: totalsDaysNextYear
        }]
}

/**
 * 
 * @param {*} annualLTRecords : [ { dates: [], totals: { days: 0, halfHours: 0 } } ]
 * @param {*} dateRanges 
 */
function transformToAnnualInfo(annualLTRecords, dateRanges) {
    return dateRanges.map(x => ({
        deadline: `${x.start.getFullYear()}~${x.end.getFullYear()}`,
        totalDays: x.days,
        totals: u.calculateTotals(filterBetweenDates(annualLTRecords, x.start, x.end))
    }))
}

function filterWithin(records, year, month) {
    const result = [];
    records.forEach(record => {
        const anyDateOfRecordWithin = record.dates
            .map(u.toDateInfo)
            .some(dateInfo =>
                dateInfo && dateInfo.year === year &&
                (!month || dateInfo.month === month))
        if (anyDateOfRecordWithin) {
            result.push(record)
        }
    })
    return result;
}

function groupBy(records, month) {
    // month                       1   2   3   4   5   6   7   8   9  10  11  12
    const maxDayAmountOfMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const result = month ?
        Array.apply(null, { length: maxDayAmountOfMonths[month - 1] }).map(() => []) :
        Array.apply(null, { length: 12 }).map(() => []);
    records.forEach(record => {
        record.dates.map(u.toDateInfo)
            .forEach(dateInfo => {
                const index = month ? dateInfo.day - 1 : dateInfo.month - 1;
                const exists = result[index].some(x => x._id === record._id)
                if (!exists) {
                    const dates = filterMatchedDates(record.dates,
                        (month ? { day: index + 1 } : { month: index + 1 }))
                    result[index].push(u.renew(record, { dates }))
                }
            })
    })
    return result
}

function filterMatchedDates(dates, info) {
    return dates.filter(dateInfo =>
        (info.month && u.toDateInfo(dateInfo).month === info.month) ||
        (info.day && u.toDateInfo(dateInfo).day === info.day))
}

function groupByLeaveType(records) {
    const result = []
    records.forEach(record => {
        let recordTemp = result.find(x => x.key === record.leaveType)
        if (recordTemp) {
            recordTemp.list.push(record)
        } else {
            result.push({
                key: record.leaveType,
                list: [record]
            })
        }
    })
    return result
}

/**
 * 
 * @param {*} records: [ { dates:[] } ]
 * @param {*} start 
 * @param {*} end 
 */
function filterBetweenDates(records, start, end) {
    const result = [];
    records.forEach(record => {
        const anyDatesOfRecordBetweenDates = record.dates
            .map(u.toDateInfo)
            .some(dateInfo => dateInfo && dateInfo.date < end && dateInfo.date >= start)
        if (anyDatesOfRecordBetweenDates) {
            result.push(record)
        }
    })
    return result;
}