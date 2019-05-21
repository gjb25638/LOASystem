const Employee = require("../../models/employee")
const validate = require("../shared/validation")
const c = require("../shared/collection")
const e = require("../email")

module.exports = {
    get,
    post,
    put,
    delete: _delete,
    loa: {
        put: loa
    },
    email: {
        put: email
    },
    pwd: {
        put: pwd
    },
    sign: {
        put: sign
    }
}

function get(req, res) {
    Employee.findOne(c.conditions.validLoginuser(req.params.loginuser, req.params.token), (err, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (loginuser) {
            Employee.findById(req.params.id, null, (err, employee) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else if (employee) {
                    if (c.predicate.isEmployeeUnderLoginuserControl(loginuser, employee)) {
                        res.send({
                            _id: employee._id,
                            employeeID: employee.employeeID,
                            dept: employee.dept,
                            name: employee.name,
                            email: employee.email,
                            username: employee.username,
                            arrivedDate: employee.arrivedDate,
                            level: employee.level,
                            signers: employee.signers,
                            activatedLeaveTypes: employee.activatedLeaveTypes,
                            records: employee.records,
                            fullControl: loginuser.level === 'admin'
                        })
                    } else {
                        res.send({ success: false, message: "no access authority" })
                    }
                } else {
                    res.send({ success: false, message: "employee is not found" })
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}

function post(req, res) {
    validate.admin(req.params.loginuser, req.params.token, (err, pass) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (pass) {
            Employee.findOne(c.conditions.employee(req.body.username), (err, employee) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else if (!employee) {
                    createEmployee(req.body).save((err) => {
                        if (err) {
                            res.send({ success: false, message: err })
                        } else {
                            res.send({ success: true, message: 'employee created successfully' })
                        }
                    })
                } else {
                    res.send({ success: false, message: 'the user name exists' })
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
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
                    const lightweight = isLightweightUpdate(employee, req.body)
                    updateEmployee(employee, req.body).save((err) => {
                        if (err) {
                            res.send({ success: false, message: err })
                        } else {
                            if (lightweight) {
                                res.send({ success: true, message: "employee updated successfully" })
                            } else {
                                Employee.find(c.conditions.underControl(employee.username), (err, employees) => {
                                    if (err) {
                                        res.send({ success: false, message: err })
                                    } else if (employees && employees.length > 0) {
                                        updateSigner(employees, employee, res, (err, res) => res.send({ success: true, message: "employee updated successfully" }))
                                    } else {
                                        res.send({ success: true, message: "employee updated successfully" })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}

function _delete(req, res) {
    validate.admin(req.params.loginuser, req.params.token, (err, pass) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (pass) {
            Employee.findById(req.params.id, null, (err, employee) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    Employee.find(c.conditions.underControl(employee.username), (err, employees) => {
                        if (err) {
                            res.send({ success: false, message: err })
                        } else if (employees && employees.length > 0) {
                            deleteSigner(employees, employee.username, res, (err, res) => {
                                Employee.remove({
                                    _id: req.params.id
                                }, (err) => {
                                    if (err) {
                                        res.send({ success: false, message: err })
                                    } else {
                                        res.send({ success: true, message: "employee deleted successfully" })
                                    }
                                })
                            })
                        } else {
                            Employee.remove({
                                _id: req.params.id
                            }, (err) => {
                                if (err) {
                                    res.send({ success: false, message: err })
                                } else {
                                    res.send({ success: true, message: "employee deleted successfully" })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}

function loa(req, res) {
    validate.owner(req.params.id, req.params.loginuser, req.params.token, (err, pass, employee) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (pass || (employee && c.predicate.isAdministrator(employee))) {
            Employee.findById(req.params.id, null, (err, employee) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else if (employee) {
                    updateRecord(employee, req.body).save((err) => {
                        if (err) {
                            res.send({ success: false, message: err })
                        } else {
                            sendLeaveTakingEmail(employee, req.body.records)
                            res.send({ success: true, message: "records updated successfully" })
                        }
                    })
                } else {
                    res.send({ success: false, message: "employee is not found" })
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}

function email(req, res) {
    validate.owner(req.params.id, req.params.loginuser, req.params.token, (err, pass, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (pass || (loginuser && c.predicate.isAdministrator(loginuser))) {
            Employee.findById(req.params.id, null, (err, employee) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    employee.email = req.body.email
                    employee.save((err) => {
                        if (err) {
                            res.send({ success: false, message: err })
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

function pwd(req, res) {
    validate.owner(req.params.id, req.params.loginuser, req.params.token, (err, pass, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (pass || (loginuser && c.predicate.isAdministrator(loginuser))) {
            Employee.findById(req.params.id, null, (err, employee) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    if (req.body.password) {
                        employee.password = req.body.password
                        employee.save((err) => {
                            if (err) {
                                res.send({ success: false, message: err })
                            } else {
                                res.send({ success: true, message: "password updated successfully" })
                            }
                        })
                    } else {
                        res.send({ success: false, message: "password is empty" })
                    }
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}

function sign(req, res) {
    validate.signer(req.params.id, req.params.loginuser, req.params.token, (err, pass, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (pass) {
            Employee.findById(req.params.id, null, (err, employee) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    const signedRecord = employee.records.find(r => r._id.toString() === req.body.recordID)
                    if (signedRecord) {
                        if (req.body.forced || !c.predicate.hasSignerOfRecordSigned(signedRecord, loginuser)) {
                            if (!req.body.pass) {
                                const leaveType = employee.activatedLeaveTypes.find(lt => lt.name === signedRecord.leaveType)
                                leaveType.consumes = calculateLastConsumes(signedRecord.totals, leaveType.consumes)
                            }
                            signedRecord.signings.push(createSigning(loginuser, req.body.pass))
                            employee.save((err) => {
                                if (err) {
                                    res.send({ success: false, message: err })
                                } else {
                                    sendLeaveSigningEmail(employee, loginuser, signedRecord)
                                    res.send({ success: true, message: "record's signing updated successfully" })
                                }
                            })
                        } else {
                            res.send({ success: false, message: "already signed the record" })
                        }
                    } else {
                        res.send({ success: false, message: "record is not found" })
                    }
                }
            })
        } else {
            res.send({ success: false, message: "token validation failed" })
        }
    })
}

function createSigning({
    _id,
    name,
    username,
    dept,
    level
}, pass) {
    return {
        id: _id,
        name,
        username,
        dept,
        level,
        signedDate: new Date(),
        pass
    }
}

function calculateLastConsumes(recordTotals, leaveTypeConsumes) {
    const recordTotalsHalfHoursAmount = recordTotals.days * 16 + recordTotals.halfHours
    const consumesHalfHoursAmount = (leaveTypeConsumes.days * 16 + leaveTypeConsumes.halfHours) - recordTotalsHalfHoursAmount
    return {
        days: Math.floor(consumesHalfHoursAmount / 16),
        halfHours: consumesHalfHoursAmount % 16
    }
}

function sendLeaveSigningEmail(taker, signer, record) {
    e.sendLeaveSigningEmail({ taker, signer, record })
}

function sendLeaveTakingEmail(taker, records) {
    collectSignersInfos(taker.signers,
        [],
        (err, signers) => e.sendLeaveTakingEmail({ taker, signers, records })
    )
}

function updateRecord(employee, { activatedLeaveTypes, records }) {
    employee.activatedLeaveTypes = activatedLeaveTypes
    employee.records = employee.records.concat(records.map(record => {
        return {
            appliedDate: record.appliedDate,
            leaveType: record.leaveType,
            dates: record.dates,
            startFrom: record.startFrom,
            endTo: record.endTo,
            agent: record.agent,
            totals: record.totals,
            signers: employee.signers
        }
    }))
    return employee
}

function collectSignersInfos(signers, signersInfos, cb) {
    const signer = signers.pop()
    if (signer) {
        Employee.findOne(c.conditions.employee(signer.username), (err, employee) => {
            if (err) {
                cb(err)
            } else if (employee.email) {
                signersInfos.push({
                    username: employee.username,
                    employeeID: employee.employeeID,
                    name: employee.name,
                    email: employee.email,
                    dept: employee.dept,
                    level: employee.level,
                })
            } else {
                collectSignersInfos(signers, signersInfos, cb)
            }
        })
    } else {
        cb(undefined, signersInfos)
    }
}

function updateSigner(employees, { username, employeeID, name, dept, level }, res, cb) {
    const employee = employees.pop()
    if (employee) {
        employee.signers.forEach((signer) => {
            if (signer.username === username) {
                signer.employeeID = employeeID
                signer.name = name
                signer.dept = dept
                signer.level = level
            }
        })
        employee.save((err) => {
            if (err) {
                res.send({ success: false, message: err })
            } else {
                updateSigner(employees, { username, employeeID, name, dept, level }, res, cb)
            }
        })
    } else {
        cb(undefined, res)
    }
}

function deleteSigner(employees, username, res, cb) {
    const employee = employees.pop()
    if (employee) {
        employee.signers = employee.signers.filter((signer) => signer.username !== username)
        employee.save((err) => {
            if (err) {
                res.send({ success: false, message: err })
            } else {
                deleteSigner(employees, username, res, cb)
            }
        })
    } else {
        cb(undefined, res)
    }
}

function isLightweightUpdate(employee, {
    employeeID,
    name,
    level,
    dept
}) {
    return employee.employeeID == employeeID &&
        employee.name == name &&
        employee.level == level &&
        employee.dept == dept
}

function updateEmployee(employee, {
    employeeID,
    dept,
    name,
    email,
    arrivedDate,
    level,
    signers,
    activatedLeaveTypes
}) {
    employee.employeeID = employeeID
    employee.name = name
    employee.email = email
    employee.level = level
    employee.dept = dept
    employee.arrivedDate = arrivedDate
    employee.signers = signers
    employee.activatedLeaveTypes = activatedLeaveTypes
    return employee
}

function createEmployee({
    employeeID,
    dept,
    name,
    email,
    username,
    arrivedDate,
    level,
    signers,
    activatedLeaveTypes
}) {
    return new Employee({
        employeeID,
        dept,
        name,
        email,
        username,
        arrivedDate,
        level,
        signers,
        activatedLeaveTypes,
        password: username.toLocaleLowerCase(),
        records: []
    })
}