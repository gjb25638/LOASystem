import localeConf from '@/localization/index'
import defaultConf from '@/default'
import reportUtility from '@/reportUtility'
export default {
  basicHeaders: [
    {
      text: localeConf.List.th.employeeID,
      value: 'employeeID',
      sortable: false
    },
    { text: localeConf.List.th.name, value: 'name', sortable: false },
    { text: localeConf.List.th.username, value: 'username', sortable: false },
    // {
    //   text: localeConf.List.th.arrivedDate,
    //   value: 'arrivedDate',
    //   sortable: false
    // },
    // {
    //   text: "月份",
    //   value: '',
    //   sortable: false
    // }
  ],
  dateTypeHeaders: [
    { text: localeConf.Report.th.annual, value: 'annual', sortable: false },
    {
      text: localeConf.Report.th.compensatory,
      value: 'compensatory',
      sortable: false
    },
    {
      text: localeConf.Report.th.statutory,
      value: 'statutory',
      sortable: false
    },
    { text: localeConf.Report.th.marriage, value: 'marriage', sortable: false },
    { text: localeConf.Report.th.funeral, value: 'funeral', sortable: false },
    {
      text: localeConf.Report.th.menstrual,
      value: 'menstrual',
      sortable: false
    },
    { text: localeConf.Report.th.sick, value: 'sick', sortable: false },
    { text: localeConf.Report.th.personal, value: 'personal', sortable: false },
    {
      text: localeConf.Report.th.derelictionOfDuty,
      value: 'derelictionOfDuty',
      sortable: false
    },
    { text: localeConf.Report.th.late, value: 'late', sortable: false },
    {
      text: localeConf.Report.th.familyCare,
      value: 'familyCare',
      sortable: false
    },
    {
      text: localeConf.Report.th.preManternity,
      value: 'preManternity',
      sortable: false
    },
    {
      text: localeConf.Report.th.manternityMiscarriage,
      value: 'manternityMiscarriage',
      sortable: false
    },
    {
      text: localeConf.Report.th.accompanyingManternity,
      value: 'accompanyingManternity',
      sortable: false
    },
    {
      text: localeConf.Report.th.businessTrip,
      value: 'businessTrip',
      sortable: false
    },
    { text: localeConf.Report.th.others, value: 'others', sortable: false }
  ],
  annualInfoHeaders: [
    {
      text: localeConf.Report.th.annualRemainings,
      value: 'annualInfo',
      sortable: false
    },
    {
      text: localeConf.Report.th.annualDeadline,
      value: 'annualInfo',
      sortable: false
    }
  ],
  generateColumns: (type, target) => {
    if (type === 'day') {
      const month = target
      const maxDayInMonth = new Date(
        new Date().getFullYear(),
        month,
        0
      ).getDate()
      return Array.apply(null, { length: maxDayInMonth })
        .map((v, i) => i + 1)
        .map(day => {
          return {
            text: `${month} ${localeConf.Report.th.months} ${day} ${
              localeConf.Report.th.days
              }`,
            value: 'day' + day,
            sortable: false
          }
        })
    } else if (type === 'month') {
      const year = target
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      return months.map(month => {
        return {
          text: `${year} ${localeConf.Report.th.years} ${month} ${
            localeConf.Report.th.months
            }`,
          value: 'month' + month,
          sortable: false
        }
      })
    } else {
      return []
    }
  },
  parseDateString: dateString => {
    return dateString
      ? {
        year: parseInt(dateString.substr(0, 4)),
        month: parseInt(dateString.substr(5, 2)),
        day: parseInt(dateString.substr(8, 2)),
        date: new Date(dateString)
      }
      : undefined
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
    'businessTrip',
    'others'
  ],
  createObjectByKeys: (keys, value) => {
    const obj = {}
    keys.forEach(key => {
      obj[key] = value
    })
    return obj
  },
  sumUpDaysNHours: (currentDays, currentHours, halfHours, days = 1) => {
    const counter = { days: currentDays, hours: currentHours }
    if (halfHours > 0) {
      counter.hours += halfHours / 2
      if (counter.hours >= 8) {
        counter.days = Math.floor(counter.hours / 8)
        counter.hours = counter.hours % 8
      }
    } else {
      counter.days += days
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
  checkingSigned: record => {
    const allSignersSigned = record.signers.every(signer =>
      record.signings.some(signing => signing.id === signer.id)
    )
    return record.signings.length > 0
      ? record.signings.every(signing => signing.pass) && allSignersSigned
      : allSignersSigned
  },
  generateDateTypeSummary: ({ days, hours, totalDays, totalHours }) => {
    if (totalDays || totalHours) {
      return (
        days +
        localeConf.shared.common.dayUnit +
        (hours && hours > 0 ? ` ${hours}${localeConf.shared.common.hourUnit}` : '') +
        '/' +
        totalDays +
        localeConf.shared.common.dayUnit +
        (totalHours ? ` ${totalHours}${localeConf.shared.common.hourUnit}` : '')
      )
    } else {
      return (
        (days ? days + localeConf.shared.common.days : '') +
        (hours && hours > 0 ? hours + localeConf.shared.common.hourUnit : '')
      )
    }
  },
  generateSummary: ({ dateType, counter: { days, hours } }) => {
    return (
      (localeConf.Report.th[dateType]
        ? localeConf.Report.th[dateType]
        : dateType) +
      ' ' +
      (days > 0 ? days + localeConf.Report.th.days : '') +
      (hours > 0 ? hours + localeConf.Report.th.hours : '')
    )
  },
  generateDateTypeClass: dateType => {
    const dt = defaultConf.leaveTypes.find(dt => dt.name === dateType)
    return dt ? dt.class : defaultConf.customLeaveType.class
  },
  getRecordsWithinThisYear: (records, year) => {
    const res = [];
    records.forEach(record => {
      const anyDatesOfRecordWithinThisYear = record.dates
        .map(reportUtility.parseDateString)
        .some(dateObj => dateObj && dateObj.year === year)
      if (anyDatesOfRecordWithinThisYear) {
        res.push(record)
      }
    })
    return res;
  },
  groupRecordsByMonth: (records) => {
    const res = Array.apply(null, { length: 12 }).map((v, i) => []);
    records.forEach(record => {
      record.dates.map(reportUtility.parseDateString)
        .forEach(dateObj => {
          const recordExists = res[dateObj.month - 1].find(x => x._id === record._id)
          if (!recordExists) {
            res[dateObj.month - 1].push(record)
          }
        })
    })
    return res
  },
  groupRecordsByLeaveType: (records) => {
    const res = []
    records.forEach(record => {
      let temp = res.find(x => x.key === record.dateType)
      if (temp) {
        temp.list.push(record)
      } else {
        res.push({
          key: record.dateType,
          list: [record]
        })
      }
    })
    return res
  },
  calculateTotals: (records) => {
    return reportUtility.sumUpTotals(records.map(record => record.totals))
  },
  sumUpTotals: (totalsList) => {
    const counter = { days: 0, hours: 0 }
    totalsList.forEach(({ days, halfHours }) => {
      if (halfHours > 0) {
        counter.hours += halfHours / 2
        if (counter.hours >= 8) {
          counter.days += Math.floor(counter.hours / 8)
          counter.hours = counter.hours % 8
        }
      } else {
        counter.days += days
      }
    })
    return counter
  },
}
