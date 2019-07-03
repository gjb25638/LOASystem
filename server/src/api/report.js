const Employee = require("../../models/employee");
const c = require("../shared/collection");
const r = require("../shared/report");
const e = require("../export/index");
const es = require("../api/employees");

module.exports = {
  annual: {
    get: (req, res) => annual({ req, res }),
    groupby: {
      get: (req, res) => annual({ req, res, groupby: true })
    }
  },
  monthly: {
    get: (req, res) => monthly({ req, res }),
    groupby: {
      get: (req, res) => monthly({ req, res, groupby: true })
    },
    /**
     * sdehsra === same dept employees have same read access
     */
    sdehsra: {
      get: (req, res) => monthly({ req, res, sdehsra: true })
    }
  },
  export: {
    annual: {
      get: annualExport
    },
    monthly: {
      get: monthlyExport
    },
    employee: {
      get: employee
    },
    compensatory: {
      get: compensatory
    }
  }
};

function annual({ req, res, groupby }) {
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
            res.send(r.produce({ loginuser, employees, year, groupby }));
          }
        }).sort({ arrivedDate: 1 });
      }
    }
  );
}

function monthly({ req, res, groupby, sdehsra }) {
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
            res.send(
              r.produce({ loginuser, employees, year, month, groupby, sdehsra })
            );
          }
        }).sort({ arrivedDate: 1 });
      } else {
        res.send({ success: false, message: "token validation failed" });
      }
    }
  );
}

function annualExport(req, res) {
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
            e.populate(
              { year },
              r.produce({ loginuser, employees, year, groupby: true }).report,
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

function monthlyExport(req, res) {
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
            e.populate(
              { year, month },
              r.produce({ loginuser, employees, year, month, groupby: true })
                .report,
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

function employee(req, res) {
  Employee.findOne(
    c.conditions.validLoginuser(req.params.loginuser, req.params.token),
    (err, loginuser) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (loginuser) {
        Employee.find(
          c.conditions.employee(req.params.username),
          null,
          (err, employee) => {
            if (err) {
              res.send({ success: false, message: err });
            } else {
              const year = parseInt(req.params.year);
              e.populateEmployee({ year }, employee[0], (data, fileName) => {
                res.attachment(fileName);
                res.send(data);
              });
            }
          }
        ).sort({ arrivedDate: 1 });
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
            e.populateCompensatory(
              { year },
              es.produceCompensatoryInfosOfEmployees(loginuser, employees, year)
                .employees,
              (data, fileName) => {
                res.attachment(fileName);
                res.send(data);
              }
            );
          }
        });
      } else {
        res.send({ success: false, message: "login user is not found" });
      }
    }
  );
}
