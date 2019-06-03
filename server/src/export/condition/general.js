const generalUtil = require("../util/general");

module.exports = {
  isDeadlineExpired,
  isStringFormat,
  isEmployeeInfoArea,
  isDayReportArea,
  isMonthReportArea,
  isLTReportArea,
  isAnnualInfoArea,
  isLastEmployee,
  isOverMaxDayOfMonth,
  isHoliday,
  isMakeUpWorkday,
  isEmployeeWorkingShifts,
  isCompensatoryLT
};

function isStringValue(value) {
  return typeof value === typeof "";
}

function isStringFormat(value) {
  return isStringValue(value.format);
}

function isNumberValue(value) {
  return typeof value === typeof 0;
}
function isEmployeeInfoArea(area) {
  return isStringValue(area) && area === "EmployeeInfo";
}

function isDayReportArea(area, day) {
  return isStringValue(area) && area === "DayReport" && isNumberValue(day);
}

function isMonthReportArea(area, month) {
  return isStringValue(area) && area === "MonthReport" && isNumberValue(month);
}

function isLTReportArea(area, leaveType) {
  return isStringValue(area) && area === "LTReport" && isStringValue(leaveType);
}

function isAnnualInfoArea(area, index) {
  return isStringValue(area) && area === "AnnualInfo" && isNumberValue(index);
}

function isLastEmployee(length, index) {
  return index === length - 1;
}

function isDeadlineExpired(date) {
  const today = generalUtil.getToday();
  return today.getTime() >= date.getTime();
}

function isOverMaxDayOfMonth(year, month, day) {
  const maxDate = new Date(year, month - 1 + 1, 0);
  const maxDateDay = maxDate.getDate();
  return maxDateDay < day;
}

function isHoliday(date, holidays) {
  return holidays.some(holiday => holiday.date.getTime() === date.getTime());
}

function isMakeUpWorkday(date, holidays) {
  const holiday = holidays.find(hd => hd.date.getTime() === date.getTime());
  return holiday && holiday.title === "調整上班";
}

function isEmployeeWorkingShifts({ username, dept }) {
  return (
    ["客服部(C)", "技術支援(S)"].includes(dept) || ["Kenny"].includes(username)
  );
}

function isCompensatoryLT(leaveType) {
  return leaveType.startsWith("補休");
}
