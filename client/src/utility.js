import localeConf from './locale.js'
import utility from './utility.js'
export default {
  checkingLoginStatus: (cookie, router) => {
    const loginuser = cookie.get('loginuser')
    const token = cookie.get('token')
    if (!loginuser || !token) {
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
        localeConf.recordlist.td.hours
      )
    } else {
      return dates.length + ' ' + localeConf.recordlist.td.days
    }
  }
}
