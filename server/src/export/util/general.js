module.exports = {
  stringFormat,
  getToday,
  padZero,
  getChineseWeekday,
  filterEmployees,
  totalsRemap,
  sumUpTotalsList
};

function stringFormat(str, ...args) {
  args.forEach((arg, index) => (str = str.replace(`{${index}}`, arg)));
  return str;
}

function getToday() {
  const rightNow = new Date();
  return new Date(
    rightNow.getFullYear(),
    rightNow.getMonth(),
    rightNow.getDate()
  );
}

function padZero(number) {
  return number >= 10 ? `${number}` : `0${number}`;
}

function getChineseWeekday(year, month, day) {
  const map = ["日", "一", "二", "三", "四", "五", "六"];
  const date = new Date(year, month - 1, day);
  return map[date.getDay()];
}

function totalsRemap(totals, unit) {
  if (unit === "day") {
    return { days: totals.days };
  } else if (unit === "hour") {
    return { hours: totals.hours };
  } else {
    return totals;
  }
}

function filterEmployees(employees) {
  return employees.filter(employee => employee.enabled);
}

function sumUpTotalsList(totalsList) {
  const result = { days: 0, hours: 0 };
  if (totalsList) {
    totalsList.forEach(
      ({ days: days = 0, halfHours: halfHours = 0, hours: hours = 0 }) => {
        if (halfHours && halfHours > 0) {
          result.hours += halfHours / 2;
        } else if (hours && hours > 0) {
          result.hours += hours;
        } else {
          result.days += days;
        }
      }
    );
  }
  return result;
}
