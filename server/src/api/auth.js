const Employee = require("../../models/employee");
const c = require("../shared/collection");
const lt = require("../shared/leavetype");

module.exports = {
  post
};

function post(req, res) {
  Employee.findOne(
    c.conditions.employee(req.body.username),
    (err, employee) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (employee) {
        employee.comparePassword(req.body.password, (err, { match, token }) => {
          if (err) {
            res.send({ success: false, message: err });
          } else {
            if (match) {
              lt.refresh(employee, (err, leavetypeRefreshed) => {
                if (err) {
                  res.send({ success: false, message: err });
                } else {
                  res.send({
                    success: true,
                    message: "login successfully",
                    loginuser: getLogininuser(employee),
                    token: token,
                    logs: leavetypeRefreshed
                  });
                }
              });
            } else {
              res.send({ success: false, message: "wrong password" });
            }
          }
        });
      } else {
        res.send({ success: false, message: "wrong user name" });
      }
    }
  );
}

function getLogininuser({
  _id,
  employeeID,
  level,
  dept,
  name,
  username,
  arrivedDate,
  email,
  password
}) {
  return {
    _id,
    employeeID,
    level,
    dept,
    name,
    username,
    arrivedDate,
    email,
    token: password
  };
}
