const Employee = require("../../models/employee")
const c = require("../shared/collection")
const util = require("../shared/util")

module.exports = {
    get: (req, res) => get({ req, res }),
    lightweight: {
        get: (req, res) => get({ req, res, lightweight: true })
    },
    compensatory: {
        get: compensatory
    }
}

function get({ req, res, lightweight = false }) {
    Employee.findOne(c.conditions.validLoginuser(req.params.loginuser, req.params.token), (err, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (loginuser) {
            Employee.find(c.conditions.all(), null, (err, employees) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    res.send(produce(loginuser, employees, lightweight))
                }
            })
        } else {
            res.send({ success: false, message: "login user is not found" })
        }
    })
};

function compensatory(req, res) {
    Employee.findOne(c.conditions.validLoginuser(req.params.loginuser, req.params.token), (err, loginuser) => {
        if (err) {
            res.send({ success: false, message: err })
        } else if (loginuser) {
            Employee.find(c.conditions.all(), null, (err, employees) => {
                if (err) {
                    res.send({ success: false, message: err })
                } else {
                    res.send(produceCompensatoryInfosOfEmployees(loginuser, employees))
                }
            })
        } else {
            res.send({ success: false, message: "login user is not found" })
        }
    })
}

function produce(loginuser, employees, lightweight) {
    return {
        fullControl: c.predicate.isAdministrator(loginuser),
        employees: employees.filter(employee => c.predicate.isEmployeeUnderLoginuserControl(loginuser, employee))
            .map(employee => {
                const lightweightInfo = {
                    _id: employee._id,
                    enabled: employee.enabled,
                    username: employee.username,
                    name: employee.name,
                    level: employee.level,
                    dept: employee.dept
                };
                return lightweight ? lightweightInfo : {
                    ...lightweightInfo,
                    password: employee.password,
                    employeeID: employee.employeeID,
                    signers: employee.signers,
                    arrivedDate: employee.arrivedDate,
                    unSigningRecords: employee.records.filter(record => !c.predicate.haveSignersOfRecordAllSigned(record) &&
                        !c.predicate.isRecordSignedReject(record))
                }
            })
    }
}

function produceCompensatoryInfosOfEmployees(loginuser, employees) {
    return {
        fullControl: c.predicate.isAdministrator(loginuser),
        employees: employees.filter(employee => c.predicate.isEmployeeUnderLoginuserControl(loginuser, employee))
            .map(employee => {
                const compensatoryRecords = employee.records
                    .filter(c.predicate.isCompensatoryRecord)
                    .filter(record => !c.predicate.isRecordSignedReject(record))
                const compensatoryLTs = employee.activatedLeaveTypes.filter(c.predicate.isCompensatoryLeaveType)
                return compensatoryLTs.length > 0 ?
                    produceCompensatoryInfo(employee, compensatoryRecords, compensatoryLTs) :
                    undefined
            })
            .filter(e => !!e)
    }
}

function produceCompensatoryInfo({
    _id,
    employeeID,
    dept,
    name,
    username,
    enabled,
    arrivedDate
}, compensatoryRecords, compensatoryLTs) {
    const consumes = util.calculateTotals(compensatoryRecords)
    const totals = util.sumUp(compensatoryLTs.map(leaveType => leaveType.totals))
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
        records: compensatoryLTs
            .filter(leaveType => !c.predicate.isLeaveTypeNoMoreLeaves(leaveType))
            .map(leaveType => {
                return {
                    leaveType: leaveType.name,
                    daysNHours: {
                        days: leaveType.consumes.days,
                        hours: leaveType.consumes.halfHours / 2,
                        totalDays: leaveType.totals.days,
                        totalHours: leaveType.totals.halfHours / 2
                    }
                }
            })
    }
}
