const u = require("./util");

module.exports = {
  refresh,
  seniorityMap: getSeniorityMap(),
  getAnnualLTTotalDays,
  getAnnualLTTotalDaysBySeniority,
  refreshAnnualPreRequestRecords,
  isAnnualLTRefreshable,
  getAnnualLTDeadline,
  isRefreshable,
  getLTDeadLine,
  refreshBasicLeaveTypes,
  leaveTypesGroups: getLeaveTypesGroups(),
  refreshAnnualLT,
  refreshAnnualPreRequestLT,
  refreshAnnualPreRequestRecords
};

function refresh(employee, cb = undefined) {
  const leaveTypesGroups = getLeaveTypesGroups();
  const enabledLeaveTypes = employee.activatedLeaveTypes.filter(
    lt => lt.enabled
  );
  const refreshedLeaveTypes = refreshBasicLeaveTypes(
    leaveTypesGroups,
    enabledLeaveTypes
  );

  const annualLT = findLeaveType(enabledLeaveTypes, "annual");
  const annualPreRequestLT = findLeaveType(
    enabledLeaveTypes,
    "annualPreRequest"
  );
  const arrivedDate = new Date(employee.arrivedDate);
  if (
    annualLT &&
    annualPreRequestLT &&
    isAnnualLTRefreshable(annualLT.deadline, arrivedDate)
  ) {
    refreshAnnualLT(
      arrivedDate,
      annualLT,
      annualPreRequestLT,
      employee.records
    );
    refreshedLeaveTypes.push(annualLT);
  }

  if (cb) {
    employee.save(err => {
      cb(err, refreshedLeaveTypes);
    });
  } else {
    return employee;
  }
}

function findLeaveType(leaveTypes, name) {
  return leaveTypes.find(lt => lt.name === name);
}

function getLeaveTypesGroups() {
  return {
    year: ["sick", "familyCare", "personal"],
    month: ["menstrual", "businessTrip"]
  };
}

function refreshBasicLeaveTypes(leaveTypesGroups, leaveTypes, specificDate) {
  const refreshedLeaveTypes = [];
  Object.keys(leaveTypesGroups).forEach(period => {
    leaveTypesGroups[period].forEach(name => {
      const target = findLeaveType(leaveTypes, name);
      if (target && isRefreshable(target.deadline, period, specificDate)) {
        target.deadline = getLTDeadLine(period, specificDate);
        target.consumes.days = 0;
        target.consumes.halfHours = 0;
        refreshedLeaveTypes.push(target);
      }
    });
  });
  return refreshedLeaveTypes;
}

function refreshAnnualLT(
  arrivedDate,
  annualLT,
  annualPreRequestLT,
  records,
  specificDate
) {
  const deadline = getAnnualLTDeadline(arrivedDate, specificDate);
  const { totalsDaysThisYear, totalsDaysNextYear } = getAnnualLTTotalDays(
    arrivedDate,
    specificDate
  );
  annualLT.consumes.days = 0;
  annualLT.deadline = deadline;
  annualLT.totals.days = totalsDaysThisYear;

  refreshAnnualPreRequestLT(deadline, annualPreRequestLT, totalsDaysNextYear);
  if (annualPreRequestLT.consumes.days > 0) {
    refreshAnnualPreRequestRecords(records, annualLT, annualPreRequestLT);
  }
}

function refreshAnnualPreRequestLT(deadline, annualPreRequestLT, totalsDays) {
  annualPreRequestLT.deadline = new Date(
    deadline.getFullYear() + 1,
    deadline.getMonth(),
    deadline.getDate()
  );
  annualPreRequestLT.totals.days = totalsDays;
}

function getLTDeadLine(period, specificToday = undefined) {
  const today = specificToday ? specificToday : new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  if (period === "year") {
    return new Date(currentYear + 1, 0, 0);
  } else if (period === "month") {
    return currentMonth < 11
      ? new Date(currentYear, currentMonth + 1, 0)
      : new Date(currentYear + 1, 0, 0);
  }
}

function isRefreshable(deadline, period, specificToday = undefined) {
  return !deadline || deadline < getLTDeadLine(period, specificToday);
}

function getAnnualLTDeadline(arrivedDate, specificToday = undefined) {
  const today = specificToday ? specificToday : new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const arrivedMonth = arrivedDate.getMonth();
  const arrivedDay = arrivedDate.getDate();
  const monthAmount = u.diffMonth(arrivedDate, today);

  if (monthAmount >= 6) {
    const deadlineCandidates = [
      new Date(currentYear, arrivedMonth, arrivedDay - 1), // this year
      new Date(currentYear + 1, arrivedMonth, arrivedDay - 1) // next year
    ];
    return deadlineCandidates[0] >= today
      ? deadlineCandidates[0]
      : deadlineCandidates[1];
  }
}

function isAnnualLTRefreshable(
  deadline,
  arrivedDate,
  specificToday = undefined
) {
  return (
    !deadline || deadline < getAnnualLTDeadline(arrivedDate, specificToday)
  );
}

function getAnnualLTTotalDays(arrivedDate, specificToday = undefined) {
  const today = specificToday ? specificToday : new Date();
  today.setHours(0, 0, 0, 0);
  const monthAmount = u.diffMonth(arrivedDate, today);
  const seniority = Math.floor(monthAmount / 12);
  return {
    totalsDaysThisYear:
      monthAmount >= 6 ? getAnnualLTTotalDaysBySeniority(seniority) : 0,
    totalsDaysNextYear:
      monthAmount >= 6
        ? getAnnualLTTotalDaysBySeniority(seniority + 1)
        : getAnnualLTTotalDaysBySeniority(seniority)
  };
}

function getSeniorityMap() {
  return {
    custom: [10, 11, 12, 14, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20],
    basic: [3, 7, 10, 14, 14, 15, 15, 15, 15, 15, 16, 17, 18, 19]
  };
}

function getAnnualLTTotalDaysBySeniority(seniority) {
  return seniority <= 13 ? getSeniorityMap().custom[seniority] : seniority + 6;
}

function refreshAnnualPreRequestRecords(records, annualLT, annualPreRequestLT) {
  annualLT.consumes.days = annualPreRequestLT.consumes.days;
  annualPreRequestLT.consumes.days = 0;
  records.forEach(record => {
    if (record.leaveType === "annualPreRequest") {
      record.leaveType = "annual";
    }
  });
}
