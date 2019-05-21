const Employee = require("../../models/employee")
const validate = require("../shared/validation")

module.exports = {
    put
}

function put(req, res) {
    validate.admin(req.params.loginuser, req.params.token, (err, pass) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (pass) {
            Employee.findById(req.params.id, null, (err, employee) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    employee.enabled = !employee.enabled
                    employee.save((err) => {
                        if (err) {
                            res.send({ success: false, message: err, })
                        } else {
                            res.send({ success: true, message: "employee updated successfully" })
                        }
                    })
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}