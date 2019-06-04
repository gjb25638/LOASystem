const generalCondition = require("../condition/general");
const generalUtil = require("./general");

module.exports = {
  comparer,
  getLTScore,
  rewriteIfEmployeeWorkUnderHalfYear,
  findLTHeader,
  totalsToString
};

function comparer(a, b) {
  const aScore = getLTScore(a.key);
  const bScore = getLTScore(b.key);
  return aScore < bScore;
}

function getLTScore(leaveType) {
  const scores = {
    personal: 0,
    sick: 1,
    menstrual: 2,
    funeral: 3,
    marriage: 4,
    compensatory: 5,
    annual: 6
  };
  return scores[leaveType]
    ? scores[leaveType]
    : generalCondition.isCompensatoryLT(leaveType)
    ? scores["compensatory"]
    : -1;
}

function rewriteIfEmployeeWorkUnderHalfYear(cell, arrivedDate) {
  const yearStr = arrivedDate.substr(0, 4);
  const monthStr = arrivedDate.substr(5, 2);
  const dayStr = arrivedDate.substr(8, 2);
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const day = parseInt(dayStr);
  const rightNow = new Date();
  const today = new Date(
    rightNow.getFullYear(),
    rightNow.getMonth(),
    rightNow.getDate()
  );
  const arrivedDatePlusHalfYear = new Date(year, month + 6 - 1, day);
  if (today.getTime() < arrivedDatePlusHalfYear.getTime()) {
    cell.value(
      `${arrivedDatePlusHalfYear.getFullYear()}/${generalUtil.padZero(
        arrivedDatePlusHalfYear.getMonth() + 1
      )}/${generalUtil.padZero(arrivedDatePlusHalfYear.getDate())}起時休10天`
    );
    cell.style("fontColor", "3F51B5");
  }
}

function findLTHeader(headers, leaveType) {
  return headers.find(({ dataKey }) => dataKey.leaveType === leaveType);
}

function totalsToString({ days, hours }, leaveType = "") {
  const map = {
    annual: "特休",
    compensatory: "補休",
    marriage: "婚假",
    funeral: "喪假",
    menstrual: "生理",
    sick: "病假",
    personal: "事假",
    familyCare: "家照"
  };
  return (
    (map[leaveType] ? map[leaveType] : leaveType ? map.compensatory : "") +
    (leaveType ? " " : "") +
    (days > 0 ? (leaveType ? "1天" : `${days}天`) : "") +
    (hours > 0 ? `${hours}H` : "")
  );
}
