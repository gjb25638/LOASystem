const fs = require("fs");
const path = require("path");
const Employee = require("../../models/employee");
const c = require("../shared/collection");
const validate = require("../shared/validation");
const u = require("../shared/util");
const configDir = path.join(__dirname, "../../models/config");
const periodConfig = path.join(configDir, "period.json");
const e = require("../export/index");

module.exports = {
  get,
  post,
  delete: _delete,
  config: {
    period: {
      get: getPeriod,
      put: updatePeriod
    }
  },
  export: {
    get: shiftExport
  }
};

function get(req, res) {
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
            res.send(
              produce(
                loginuser,
                employees,
                parseInt(req.params.year),
                parseInt(req.params.month)
              )
            );
          }
        });
      } else {
        res.send({ success: false, message: "login user is not found" });
      }
    }
  );
}

function post(req, res) {
  validate.signer(
    req.params.id,
    req.params.loginuser,
    req.params.token,
    (err, pass, loginuser) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (pass) {
        Employee.findById(req.params.id, null, (err, employee) => {
          if (err) {
            res.send({ success: false, message: err });
          } else {
            const shiftDateInfo = u.toDateInfo(new Date(req.body.shift.date));
            const currentDateInfo = u.toDateInfo(new Date());
            if (
              shiftDateInfo.month >= currentDateInfo.month &&
              shiftDateInfo.year >= currentDateInfo.year
            ) {
              employee.shifts.push({
                date: req.body.shift.date,
                daypart: req.body.shift.daypart,
                primary: req.body.shift.primary
              });
              employee.save(err => {
                if (err) {
                  res.send({ success: false, message: err });
                } else {
                  res.send({
                    success: true,
                    message: "shift updated successfully"
                  });
                }
              });
            } else {
              res.send({
                success: false,
                message: "unable to update expired shift"
              });
            }
          }
        });
      } else {
        res.send({ success: false, message: "token validation failed" });
      }
    },
    true
  );
}

function _delete(req, res) {
  validate.signer(
    req.params.id,
    req.params.loginuser,
    req.params.token,
    (err, pass, loginuser) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (pass) {
        Employee.findById(req.params.id, null, (err, employee) => {
          if (err) {
            res.send({ success: false, message: err });
          } else {
            try {
              const shift = employee.shifts.find(
                shift => shift._id.toString() === req.body.shiftId
              );
              const shiftDateInfo = u.toDateInfo(shift.date);
              const currentDateInfo = u.toDateInfo(new Date());
              if (
                shiftDateInfo.month >= currentDateInfo.month &&
                shiftDateInfo.year >= currentDateInfo.year
              ) {
                employee.shifts = employee.shifts.filter(
                  shift => shift._id.toString() !== req.body.shiftId
                );
                employee.save(err => {
                  if (err) {
                    res.send({ success: false, message: err });
                  } else {
                    res.send({
                      success: true,
                      message: "shift deleted successfully"
                    });
                  }
                });
              } else {
                res.send({
                  success: false,
                  message: "unable to update expired shift"
                });
              }
            } catch (e) {}
          }
        });
      } else {
        res.send({ success: false, message: "token validation failed" });
      }
    },
    true
  );
}

function getPeriod(req, res) {
  Employee.findOne(
    c.conditions.validLoginuser(req.params.loginuser, req.params.token),
    (err, loginuser) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (loginuser) {
        const content = fs.readFileSync(periodConfig, { encoding: "utf8" });
        res.send(content);
      } else {
        res.send({ success: false, message: "login user is not found" });
      }
    }
  );
}

function updatePeriod(req, res) {
  validate.manager(
    req.params.loginuser,
    req.params.token,
    (err, pass) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (pass) {
        fs.writeFileSync(periodConfig, JSON.stringify(req.body.config), {
          encoding: "utf8"
        });
        res.send({
          success: true,
          message: "shift config updated successfully"
        });
      } else {
        res.send({ success: false, message: "token validation failed" });
      }
    },
    true
  );
}

function produce(loginuser, employees, year, month) {
  return {
    fullControl: c.predicate.isAdministrator(loginuser),
    employees: employees
      .filter(employee =>
        c.predicate.isEmployeeUnderLoginuserControl(
          loginuser,
          employee,
          true,
          true
        )
      )
      .map(employee => {
        return {
          _id: employee._id,
          username: employee.username,
          employeeID: employee.employeeID,
          name: employee.name,
          dept: employee.dept,
          email: employee.email,
          arrivedDate: employee.arrivedDate,
          level: employee.level,
          shifts: shrink(employee.shifts, year, month)
        };
      })
  };
}

function shrink(shifts, year, month) {
  return shifts.filter(shift => {
    const dateInfo = u.toDateInfo(shift.date);
    return dateInfo.year === year && dateInfo.month === month;
  });
}

function shiftExport(req, res) {
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
            const month = parseInt(req.params.month);
            e.populateShift(
              { year, month },
              produce(loginuser, employees, year, month).employees,
              (data, fileName) => {
                res.attachment(fileName);
                res.send(data);
              }
            );
          }
        }).sort({ arrivedDate: 1 });
      }
    }
  );
}
