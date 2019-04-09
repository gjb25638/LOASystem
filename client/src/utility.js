import localeConf from '@/localization/index'
import utility from '@/utility'
import defaultConf from '@/default'
export default {
  checkingLoginStatus: (cookie, router) => {
    const loginuser = cookie.get('loginuser')
    const token = cookie.get('token')
    if (router.history.current.name !== 'Login'
      && (!loginuser || !token)) {
      cookie.delete('loginuser')
      cookie.delete('token')
      router.push({ name: 'Login' })
    }
  },
  logout: (cookie, router) => {
    cookie.delete('loginuser')
    cookie.delete('token')
    router.push({ name: 'Login' })
  },
  formatDate: dateString => {
    return dateString
      ? dateString === 'now'
        ? new Date().toJSON().substr(0, 10)
        : new Date(dateString).toJSON().substr(0, 10)
      : ''
  },
  exportExcel: html => {
    window.open(
      'data:application/vnd.ms-excel,' +
      encodeURIComponent(
        '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8" /><title>Excel</title>' +
        html
      )
    )
  },
  calculateTotalHours: (startFrom, endTo) => {
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
  },
  generateSummary: (dates, startFrom, endTo) => {
    dates = dates.map(d => utility.formatDate(d))
    if (dates.length > 1) {
      return dates.join(', ')
    } else {
      if (startFrom && endTo) {
        return `${dates[0]} - ${startFrom} ~ ${endTo}`
      } else {
        return dates[0]
      }
    }
  },
  generateConsumeSummary: (dates, startFrom, endTo) => {
    dates = dates.map(d => utility.formatDate(d))
    if (startFrom && endTo) {
      return (
        utility.calculateTotalHours(startFrom, endTo) +
        ' ' +
        localeConf.RecordList.td.hours
      )
    } else {
      return dates.length + ' ' + localeConf.RecordList.td.days
    }
  },
  lookUpCustomMessage: (msg) => {
    const customMessage = localeConf.shared.message[msg.replace(/\s+/g, "_")];
    return customMessage ? customMessage : msg;
  },
  lookUpLeaveTypeIconNClass: (leaveType) => {
    const target = defaultConf.leaveTypes.find(type => type.name === leaveType)
    return {
      icon: target ? target.icon : defaultConf.customLeaveType.icon,
      class: target ? target.class : defaultConf.customLeaveType.class
    }
  },
  stringFormat: (template, ...values) => {
    values.forEach((v, i) => {
      const reg = new RegExp(`\\\$\\\{${i}\\\}`)
      template = template.replace(reg, v)
    })
    return template
  },
  isLeaveTypeInfoGeneral: (leaveTypeName) => {
    return defaultConf.leaveTypes.filter(type => type.countdown).some(type => type.name === leaveTypeName)
  },
  getLocaleDateTypeNames: (name) => {
    return localeConf.shared.dateTypes[name] ? localeConf.shared.dateTypes[name] : name
  },
  getCompensatoryLeaveTypes: (leaveTypes) => {
    return leaveTypes.filter(type => type.enabled && type.name.startsWith(defaultConf.compensatory.keyword))
  },
  getCompensatoryRecords: (records) => {
    return records.filter(r => r.signings.every(s => !!s.pass) && r.dateType.startsWith(defaultConf.compensatory.keyword))
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
  getUnusedOutLeaveTypes: (leaveTypes, records) => {
    return leaveTypes.filter(type =>
      (type.totals.days !== type.consumes.days || type.totals.halfHours !== type.consumes.halfHours)
      && (type.totals.days > 0 || type.totals.halfHours > 0)
    ).map(type => {
      return {
        dateType: type.name,
        daysNHours: {
          days: type.consumes.days,
          hours: type.consumes.halfHours / 2,
          totalDays: type.totals.days,
          totalHours: type.totals.halfHours / 2
        }
      }
    })
  }
}
