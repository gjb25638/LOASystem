const Employee = require("../../models/employee")
const c = require("../shared/collection")
const r = require("../shared/report")
const ea = require("../export/annual/index")

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
        }
    }
}

function annual({ req, res, groupby }) {
    Employee.findOne(c.conditions.validLoginuser(req.params.loginuser, req.params.token), (err, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (loginuser) {
            Employee.find(c.conditions.all(), null, (err, employees) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    const year = parseInt(req.params.year)
                    res.send(r.produce({ loginuser, employees, year, groupby }))
                }
            }).sort({ arrivedDate: 1 })
        }
    })
}

function monthly({ req, res, groupby, sdehsra }) {
    Employee.findOne(c.conditions.validLoginuser(req.params.loginuser, req.params.token), (err, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (loginuser) {
            Employee.find(c.conditions.all(), null, (err, employees) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    const year = parseInt(req.params.year)
                    const month = parseInt(req.params.month)
                    res.send(r.produce({ loginuser, employees, year, month, groupby, sdehsra }))
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}

function annualExport(req, res) {
    Employee.findOne(c.conditions.validLoginuser(req.params.loginuser, req.params.token), (err, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (loginuser) {
            Employee.find(c.conditions.all(), null, (err, employees) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    const year = parseInt(req.params.year)
                    ea.populate(year, r.produce({ loginuser, employees, year, groupby: true }).report, (data, fileName) => {
                        res.attachment(fileName);
                        res.send(data);
                    })
                }
            }).sort({ arrivedDate: 1 })
        }
    })
}