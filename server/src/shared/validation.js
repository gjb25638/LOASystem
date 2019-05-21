const c = require("../shared/collection")
const Employee = require("../../models/employee")

module.exports = {
    /**
     * cb(err, pass)
     */
    admin,
    /**
     * cb(err, pass, loginuser)
     */
    owner,
    /**
     * cb(err, pass, loginuser)
     */
    signer
}

function admin(loginusername, token, cb) {
    Employee.findOne(c.conditions.administrator(loginusername, token), (err, loginuser) => cb(err, !!loginuser))
}

function owner(id, loginusername, token, cb) {
    Employee.findOne(c.conditions.validLoginuser(loginusername, token), (err, loginuser) => {
        const pass = loginuser && id === loginuser._id.toString()
        cb(err, pass, loginuser)
    })
}

function signer(id, loginuser, token, cb) {
    Employee.findOne(c.conditions.validLoginuser(loginuser, token), (err, loginuser) => {
        if (err) {
            cb(err, false)
        } else if (loginuser) {
            Employee.findById(id, null, (err, employee) => {
                if (err) {
                    cb(err, false)
                } else if (employee) {
                    cb(err, c.predicate.isEmployeeUnderLoginuserControl(loginuser, employee, false), loginuser)
                } else {
                    cb(err, false)
                }
            })
        } else {
            cb(err, false)
        }
    })
}