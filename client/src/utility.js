import locale from "@/localization/index";
import utility from "@/utility";
import defaultConf from "@/default";

export default {
  logout: (cookie, router) => {
    cookie.delete("loginuser");
    cookie.delete("token");
    router.push({ name: "Login" });
  },
  formatDate: dateString => {
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
  },
  exportExcel: html => {
    window.open(
      "data:application/vnd.ms-excel," +
      encodeURIComponent(
        '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8" /><title>Excel</title>' +
        html
      )
    );
  },
  calculateTotalHours: (startFrom, endTo) => {
    if (startFrom && endTo) {
      const startfromMinutes =
        parseInt(startFrom.substr(0, 2)) * 60 +
        parseInt(startFrom.substr(3, 2));
      const endToMinutes =
        parseInt(endTo.substr(0, 2)) * 60 + parseInt(endTo.substr(3, 2));
      if (endToMinutes > startfromMinutes) {
        const hours = (endToMinutes - startfromMinutes) / 60;
        const lessThan1hourPart = (hours * 10) % 10;
        if (lessThan1hourPart > 5) {
          return Math.ceil(hours);
        } else if (lessThan1hourPart === 0) {
          return Math.floor(hours);
        } else {
          return Math.floor(hours) + 0.5;
        }
      } else {
        return -1;
      }
    }
    return 0;
  },
  generateSummary: (dates, startFrom, endTo) => {
    dates = dates.map(d => utility.formatDate(d));
    if (dates.length > 1) {
      return dates.join(", ");
    } else {
      if (startFrom && endTo) {
        return `${dates[0]} - ${startFrom} ~ ${endTo}`;
      } else {
        return dates[0];
      }
    }
  },
  generateConsumeSummary: (dates, startFrom, endTo) => {
    dates = dates.map(d => utility.formatDate(d));
    if (startFrom && endTo) {
      return (
        utility.calculateTotalHours(startFrom, endTo) +
        " " +
        locale.RecordList.hours
      );
    } else {
      return dates.length + " " + locale.RecordList.days;
    }
  },
  lookUpCustomMessage: msg => {
    const customMessage = msg.replace ? locale.shared.message[msg.replace(/\s+/g, "_")] : "";
    return customMessage ? customMessage : msg;
  },
  lookUpLeaveTypeIconNClass: (leaveType, outline = false) => {
    const target = defaultConf.leaveTypes.find(type => type.name === leaveType);
    return {
      icon: target ? target.icon : defaultConf.customLeaveType.icon,
      class: target ? target.class : defaultConf.customLeaveType.class,
    };
  },
  lookUpLeaveType: (leaveType) => {
    const target = defaultConf.leaveTypes.find(type => type.name === leaveType);
    return target ? target : defaultConf.customLeaveType
  },
  stringFormat: (template, ...values) => {
    values.forEach((v, i) => {
      const reg = new RegExp(`\\\$\\\{${i}\\\}`);
      template = template.replace(reg, v);
    });
    return template;
  },
  isLeaveTypeInfoGeneral: leaveTypeName => {
    return defaultConf.leaveTypes
      .filter(type => type.countdown)
      .some(type => type.name === leaveTypeName);
  },
  getLocaleleaveTypeNames: name => {
    return locale.shared.leaveTypes[name]
      ? locale.shared.leaveTypes[name]
      : name;
  },
  getCompensatoryLeaveTypes: leaveTypes => {
    return leaveTypes.filter(
      type =>
        type.enabled && type.name.startsWith(defaultConf.compensatory.keyword)
    );
  },
  getCompensatoryRecords: records => {
    return records.filter(
      r =>
        r.signings.every(s => !!s.pass) &&
        r.leaveType.startsWith(defaultConf.compensatory.keyword)
    );
  },
  sumUpTotals: totalsList => {
    const counter = { days: 0, hours: 0 };
    totalsList.forEach(({ days, halfHours }) => {
      if (halfHours > 0) {
        counter.hours += halfHours / 2;
        if (counter.hours >= 8) {
          counter.days += Math.floor(counter.hours / 8);
          counter.hours = counter.hours % 8;
        }
      } else {
        counter.days += days;
      }
    });
    return counter;
  },
  getUnusedOutLeaveTypes: (leaveTypes, records) => {
    return leaveTypes
      .filter(
        type =>
          (type.totals.days !== type.consumes.days ||
            type.totals.halfHours !== type.consumes.halfHours) &&
          (type.totals.days > 0 || type.totals.halfHours > 0)
      )
      .map(type => {
        return {
          leaveType: type.name,
          daysNHours: {
            days: type.consumes.days,
            hours: type.consumes.halfHours / 2,
            totalDays: type.totals.days,
            totalHours: type.totals.halfHours / 2
          }
        };
      });
  }
};
