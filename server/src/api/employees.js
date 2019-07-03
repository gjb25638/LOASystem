const Employee = require("../../models/employee");
const c = require("../shared/collection");
const util = require("../shared/util");

module.exports = {
  get: (req, res) => get({ req, res }),
  lightweight: {
    get: (req, res) => get({ req, res, lightweight: true })
  },
  compensatory: {
    get: compensatory
  },
  produceCompensatoryInfosOfEmployees
};

function get({ req, res, lightweight = false }) {
  Employee.findOne(
    c.conditions.validLoginuser(req.params.loginuser, req.params.token),
    (err, loginuser) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (loginuser) {
        Employee.find(c.conditions.all(), null, (err, employees) => {
          if (err) {
            res.send({ success: false, message: err });
          } else {
            res.send(produce(loginuser, employees, lightweight));
          }
        });
      } else {
        res.send({ success: false, message: "login user is not found" });
      }
    }
  );
}

function compensatory(req, res) {
  Employee.findOne(
    c.conditions.validLoginuser(req.params.loginuser, req.params.token),
    (err, loginuser) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (loginuser) {
        Employee.find(c.conditions.all(), null, (err, employees) => {
          if (err) {
            res.send({ success: false, message: err });
          } else {
            const year = parseInt(req.params.year);
            res.send(
              produceCompensatoryInfosOfEmployees(loginuser, employees, year)
            );
          }
        });
      } else {
        res.send({ success: false, message: "login user is not found" });
      }
    }
  );
}

function produce(loginuser, employees, lightweight) {
  return {
    fullControl: c.predicate.isAdministrator(loginuser),
    employees: employees
      .filter(employee =>
        c.predicate.isEmployeeUnderLoginuserControl(loginuser, employee)
      )
      .map(employee => {
        const lightweightInfo = {
          _id: employee._id,
          enabled: employee.enabled,
          username: employee.username,
          name: employee.name,
          level: employee.level,
          dept: employee.dept
        };
        return lightweight
          ? lightweightInfo
          : {
              ...lightweightInfo,
              password: employee.password,
              employeeID: employee.employeeID,
              signers: employee.signers,
              arrivedDate: employee.arrivedDate,
              unSigningRecords: employee.records.filter(
                record =>
                  !c.predicate.haveSignersOfRecordAllSigned(record) &&
                  !c.predicate.isRecordSignedReject(record)
              )
            };
      })
  };
}

function produceCompensatoryInfosOfEmployees(loginuser, employees, year) {
  return {
    fullControl: c.predicate.isAdministrator(loginuser),
    employees: employees
      .filter(employee =>
        c.predicate.isEmployeeUnderLoginuserControl(loginuser, employee)
      )
      .map(employee => {
        const compensatoryRecords = employee.records
          .filter(c.predicate.isCompensatoryRecord)
          .filter(record => !c.predicate.isRecordSignedReject(record))
          .map(record => {
            if (record && isFutureRecord(record, year)) {
              record.totals.days = 0;
              record.totals.halfHours = 0;
            }
            return record;
          });
        const compensatoryLTs = employee.activatedLeaveTypes.filter(
          c.predicate.isCompensatoryLeaveType
        );
        return compensatoryRecords.length > 0
          ? produceCompensatoryInfo(
              employee,
              compensatoryRecords,
              compensatoryLTs,
              year
            )
          : undefined;
      })
      .filter(e => !!e)
  };
}

function produceCompensatoryInfo(
  { _id, employeeID, dept, name, username, enabled, arrivedDate },
  compensatoryRecords,
  compensatoryLTs,
  year
) {
  const consumes = util.calculateTotals(compensatoryRecords);
  const totals = util.sumUp(compensatoryLTs.map(leaveType => leaveType.totals));
  return {
    _id,
    employeeID,
    dept,
    name,
    username,
    enabled,
    arrivedDate,
    totals: {
      days: consumes.days,
      halfHours: consumes.halfHours,
      totalDays: totals.days,
      totalHalfHours: totals.halfHours
    },
    leaveTypes: compensatoryLTs
      .filter(
        leaveType =>
          !c.predicate.isLeaveTypeNoMoreLeaves(leaveType) ||
          checkIsFutureRecord(compensatoryRecords, leaveType.name, year)
      )
      .map(leaveType => {
        return {
          leaveType: leaveType.name,
          daysNHours: {
            days: checkIsFutureRecord(compensatoryRecords, leaveType.name, year)
              ? 0
              : leaveType.consumes.days,
            hours: checkIsFutureRecord(
              compensatoryRecords,
              leaveType.name,
              year
            )
              ? 0
              : leaveType.consumes.halfHours / 2,
            totalDays: leaveType.totals.days,
            totalHours: leaveType.totals.halfHours / 2
          },
          deadline: leaveType.deadline,
          date: toDate(leaveType.name)
        };
      })
  };
}

function toDate(leaveTypeName) {
  const res = /補休-(\d{4})?\/?(\d{1,2})\/(\d{1,2})/.exec(leaveTypeName);
  if (res) {
    let year = res[1];
    const month = res[2];
    const day = res[3];
    if (!year) {
      year = "2019";
    }
    return new Date(`${year}/${month}/${day}`);
  }
}

function checkIsFutureRecord(compensatoryRecords, leaveTypeName, year) {
  const record = compensatoryRecords.find(r => r.leaveType === leaveTypeName);
  return record && isFutureRecord(record, year);
}

function isFutureRecord(record, year) {
  return new Date(record.dates[0]).getFullYear() > year;
}
