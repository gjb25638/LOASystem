import localeConf from './locale.js'
import defaultConf from './default.js'
export default {
    basicHeaders: [
        { text: localeConf.list.th.employeeID, value: 'employeeID', sortable: false },
        { text: localeConf.list.th.name, value: 'name', sortable: false },
        { text: localeConf.list.th.username, value: 'username', sortable: false },
        { text: localeConf.list.th.dept, value: 'dept', sortable: false },
        { text: localeConf.list.th.arrivedDate, value: 'arrivedDate', sortable: false }
    ],
    dateTypeHeaders: [
        { text: localeConf.report.th.annual, value: 'annual', sortable: false },
        { text: localeConf.report.th.compensatory, value: 'compensatory', sortable: false },
        { text: localeConf.report.th.statutory, value: 'statutory', sortable: false },
        { text: localeConf.report.th.marriage, value: 'marriage', sortable: false },
        { text: localeConf.report.th.funeral, value: 'funeral', sortable: false },
        { text: localeConf.report.th.menstrual, value: 'menstrual', sortable: false },
        { text: localeConf.report.th.sick, value: 'sick', sortable: false },
        { text: localeConf.report.th.personal, value: 'personal', sortable: false },
        { text: localeConf.report.th.derelictionOfDuty, value: 'derelictionOfDuty', sortable: false },
        { text: localeConf.report.th.late, value: 'late', sortable: false },
        { text: localeConf.report.th.familyCare, value: 'familyCare', sortable: false },
        { text: localeConf.report.th.preManternity, value: 'preManternity', sortable: false },
        { text: localeConf.report.th.manternityMiscarriage, value: 'manternityMiscarriage', sortable: false },
        { text: localeConf.report.th.accompanyingManternity, value: 'accompanyingManternity', sortable: false },
        { text: localeConf.report.th.others, value: 'others', sortable: false }
    ],
    annualInfoHeaders: [
        {
            text: localeConf.report.th.annualRemainings,
            value: 'annualInfo',
            sortable: false
        },
        {
            text: localeConf.report.th.annualDeadline,
            value: 'annualInfo',
            sortable: false
        }
    ],
    generateColumns: (type, target) => {
        if (type === 'day') {
            const month = target
            const maxDayInMonth = new Date(new Date().getFullYear(), month, 0).getDate()
            return Array.apply(null, { length: maxDayInMonth }).map((v, i) => i + 1)
                .map(day => {
                    return {
                        text: `${month} ${localeConf.report.th.months} ${day} ${localeConf.report.th.days}`,
                        value: 'day' + day,
                        sortable: false
                    }
                })
        } else if (type === 'month') {
            const year = target
            const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            return months.map(month => {
                return {
                    text: `${year} ${localeConf.report.th.years} ${month} ${localeConf.report.th.months}`,
                    value: 'month' + month,
                    sortable: false
                }
            })
        } else {
            return []
        }
    },
    parseDateString: (dateString) => {
        return dateString ? {
            year: parseInt(dateString.substr(0, 4)),
            month: parseInt(dateString.substr(5, 2)),
            day: parseInt(dateString.substr(8, 2)),
            date: new Date(dateString)
        } : undefined
    },
    dateTypes: [
        'annual',
        'compensatory',
        'marriage',
        'funeral',
        'menstrual',
        'sick',
        'personal',
        'familyCare',
        'preManternity',
        'manternityMiscarriage',
        'accompanyingManternity',
        'others'
    ],
    createObjectByKeys: (keys, value) => {
        const obj = {}
        keys.forEach(key => {
            obj[key] = value
        });
        return obj;
    },
    sumUpDaysNHours: (currentDays, currentHours, halfHours) => {
        const counter = { days: currentDays, hours: currentHours }
        if (halfHours > 0) {
            counter.hours += halfHours / 2
            if (counter.hours >= 8) {
                counter.days = Math.floor(counter.hours / 8)
                counter.hours = counter.hours % 8
            }
        } else {
            counter.days++
        }
        return counter
    },
    sumTotalDaysNHours: (currentDays, currentHours, days, hours) => {
        const counter = { days: currentDays, hours: currentHours }
        counter.days += days
        counter.hours += hours
        if (counter.hours >= 8) {
            counter.days = Math.floor(counter.hours / 8)
            counter.hours = counter.hours % 8
        }
        return counter
    },
    checkingSigned: (record) => {
        const allSignersSigned = record.signers.every(signer => record.signings.some(signing => signing.id === signer.id))
        return record.signings.length > 0 ? record.signings.every(signing => signing.pass) && allSignersSigned : allSignersSigned
    },
    generateDateTypeSummary: ({ days, hours, totalDays }) => {
        if (totalDays) {
            return (
                (days + localeConf.report.th.days) +
                '('+ totalDays + localeConf.report.th.days + ')' + 
                (hours && hours > 0 ? hours + localeConf.report.th.hours : '')
            )
        } else {
            return (
                (days ? days + localeConf.report.th.days : '') +
                (hours && hours > 0 ? hours + localeConf.report.th.hours : '')
            )
        }
    },
    generateSummary: ({ dateType, counter: { days, hours } }) => {
        return (
            (localeConf.report.th[dateType]
                ? localeConf.report.th[dateType]
                : dateType) +
            ' ' +
            (days > 0 ? days + localeConf.report.th.days : '') +
            (hours > 0 ? hours + localeConf.report.th.hours : '')
        )
    },
    generateDateTypeClass: (dateType) => {
        const dt = defaultConf.dateTypes.find(dt => dt.name === dateType)
        return dt ? dt.class : defaultConf.customDateType.class
    }
}