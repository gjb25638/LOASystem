const Employee = require("../../models/employee")
const c = require("../shared/collection")
const r = require("../shared/report")

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

function monthly({ req, res, groupby }) {
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
                    res.send(r.produce({ loginuser, employees, year, month, groupby }))
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}
