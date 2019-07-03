import locale from "@/localization/index";
import defaultConf from "@/default";
import reportUtility from "@/reportUtility";
export default {
  basicHeaders: [
    {
      text: locale.List.employeeID,
      value: "employeeID",
      sortable: false
    },
    { text: locale.List.name, value: "name", sortable: false },
    { text: locale.List.username, value: "username", sortable: false }
  ],
  leaveTypeHeaders: [
    { text: locale.Report.th.annual, value: "annual", sortable: false },
    {
      text: locale.Report.th.compensatory,
      value: "compensatory",
      sortable: false
    },
    {
      text: locale.Report.th.statutory,
      value: "statutory",
      sortable: false
    },
    { text: locale.Report.th.marriage, value: "marriage", sortable: false },
    { text: locale.Report.th.funeral, value: "funeral", sortable: false },
    {
      text: locale.Report.th.menstrual,
      value: "menstrual",
      sortable: false
    },
    { text: locale.Report.th.sick, value: "sick", sortable: false },
    { text: locale.Report.th.personal, value: "personal", sortable: false },
    {
      text: locale.Report.th.derelictionOfDuty,
      value: "derelictionOfDuty",
      sortable: false
    },
    { text: locale.Report.th.late, value: "late", sortable: false },
    {
      text: locale.Report.th.familyCare,
      value: "familyCare",
      sortable: false
    },
    {
      text: locale.Report.th.preManternity,
      value: "preManternity",
      sortable: false
    },
    {
      text: locale.Report.th.manternityMiscarriage,
      value: "manternityMiscarriage",
      sortable: false
    },
    {
      text: locale.Report.th.accompanyingManternity,
      value: "accompanyingManternity",
      sortable: false
    },
    {
      text: locale.Report.th.businessTrip,
      value: "businessTrip",
      sortable: false
    },
    { text: locale.Report.th.others, value: "others", sortable: false }
  ],
  annualInfoHeaders: [
    {
      text: locale.Report.th.annualRemainings,
      value: "annualInfo",
      sortable: false
    },
    {
      text: locale.Report.th.annualDeadline,
      value: "annualInfo",
      sortable: false
    }
  ],
  generateColumns: (type, target) => {
    if (type === "day") {
      const month = target;
      const maxDayInMonth = new Date(
        new Date().getFullYear(),
        month,
        0
      ).getDate();
      return Array.apply(null, { length: maxDayInMonth })
        .map((v, i) => i + 1)
        .map(day => {
          return {
            text: `${month} ${locale.Report.th.months} ${day} ${
              locale.Report.th.days
            }`,
            value: "day" + day,
            sortable: false
          };
        });
    } else if (type === "month") {
      const year = target;
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      return months.map(month => {
        return {
          text: `${year} ${locale.Report.th.years} ${month} ${
            locale.Report.th.months
          }`,
          value: "month" + month,
          sortable: false
        };
      });
    } else {
      return [];
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
      : undefined;
  },
  leaveTypes: [
    "annual",
    "compensatory",
    "marriage",
    "funeral",
    "menstrual",
    "sick",
    "personal",
    "familyCare",
    "preManternity",
    "manternityMiscarriage",
    "accompanyingManternity",
    "businessTrip",
    "others"
  ],
  createObjectByKeys: (keys, value) => {
    const obj = {};
    keys.forEach(key => {
      obj[key] = value;
    });
    return obj;
  },
  sumUpDaysNHours: (currentDays, currentHours, halfHours, days = 1) => {
    const counter = { days: currentDays, hours: currentHours };
    if (halfHours > 0) {
      counter.hours += halfHours / 2;
      if (counter.hours >= 8) {
        counter.days = Math.floor(counter.hours / 8);
        counter.hours = counter.hours % 8;
      }
    } else {
      counter.days += days;
    }
    return counter;
  },
  sumTotalDaysNHours: (currentDays, currentHours, days, hours) => {
    const counter = { days: currentDays, hours: currentHours };
    counter.days += days;
    counter.hours += hours;
    if (counter.hours >= 8) {
      counter.days = Math.floor(counter.hours / 8);
      counter.hours = counter.hours % 8;
    }
    return counter;
  },
  checkingSigned: record => {
    const allSignersSigned = record.signers.every(signer =>
      record.signings.some(signing => signing.id === signer.id)
    );
    return record.signings.length > 0
      ? record.signings.every(signing => signing.pass) && allSignersSigned
      : allSignersSigned;
  },
  generateleaveTypeSummary: ({ days, hours, totalDays, totalHours }) => {
    if (totalDays || totalHours) {
      return (
        days +
        locale.shared.common.dayUnit +
        (hours && hours > 0
          ? ` ${hours}${locale.shared.common.hourUnit}`
          : "") +
        "/" +
        totalDays +
        locale.shared.common.dayUnit +
        (totalHours ? ` ${totalHours}${locale.shared.common.hourUnit}` : "")
      );
    } else {
      return (
        (days ? days + locale.shared.common.days : "") +
        (hours && hours > 0 ? hours + locale.shared.common.hourUnit : "")
      );
    }
  },
  generateSummary: ({ leaveType, days, hours }) => {
    return (
      (locale.Report.th[leaveType] ? locale.Report.th[leaveType] : leaveType) +
      " " +
      (days > 0 ? `${days} ${locale.Report.th.days}` : "") +
      (hours > 0 ? `${hours} ${locale.Report.th.hours}` : "")
    );
  },
  generateleaveTypeClass: leaveType => {
    const dt = defaultConf.leaveTypes.find(dt => dt.name === leaveType);
    return dt ? dt.class : defaultConf.customLeaveType.class;
  },
  getRecordsWithinThisYear: (records, year) => {
    const res = [];
    records.forEach(record => {
      const anyDatesOfRecordWithinThisYear = record.dates
        .map(reportUtility.parseDateString)
        .some(dateObj => dateObj && dateObj.year === year);
      if (anyDatesOfRecordWithinThisYear) {
        res.push(record);
      }
    });
    return res;
  },
  groupRecordsByMonth: records => {
    const res = Array.apply(null, { length: 12 }).map((v, i) => []);
    records.forEach(record => {
      record.dates.map(reportUtility.parseDateString).forEach(dateObj => {
        const recordExists = res[dateObj.month - 1].find(
          x => x._id === record._id
        );
        if (!recordExists) {
          res[dateObj.month - 1].push(record);
        }
      });
    });
    return res;
  },
  groupRecordsByLeaveType: records => {
    const res = [];
    records.forEach(record => {
      let temp = res.find(x => x.key === record.leaveType);
      if (temp) {
        temp.list.push(record);
      } else {
        res.push({
          key: record.leaveType,
          list: [record]
        });
      }
    });
    return res;
  },
  calculateTotals: records => {
    return reportUtility.sumUpTotals(records.map(record => record.totals));
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
  }
};
