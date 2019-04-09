const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require("path")

const emailUtil = require("./email.js")
const Employee = require("../models/employee")
// const data = require("../models/data")
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../models/all.json'), 'utf8'))

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongoose = require('mongoose')

const DATABASE_URL = process.env.DATABASE_URL || 'localhost:27017'
mongoose.connect(`mongodb://${DATABASE_URL}/employee`)

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", (callback) => {
  console.log("Connection Succeeded")
  //importEmails(JSON.parse(JSON.stringify(data)))
  Employee.findOne({ username: "admin" }, (err, user) => {
    if (!user) {
      new Employee({
        employeeID: "_admin",
        username: "admin",
        password: "admin",
        name: "admin",
        level: "admin"
      }).save((err) => {
        if (err) {
          console.log(err)
        } else {
          if (data && data.length > 0) {
            // importData(JSON.parse(JSON.stringify(data)))
            importDataAll(data)
          }
        }
      })
    }
  })

})

app.get('/all', (req, res) => {
  Employee.find({}, null, (err, employees) => {
    res.send(employees)
  })
})

app.get('/employees/:loginuser/:token', (req, res) => {
  Employee.findOne({ username: new RegExp(`^${req.params.loginuser}$`, "i"), password: req.params.token }, (err, user) => {
    if (user) {
      Employee.find({ username: { $ne: "admin" } }, null, (err, employees) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          res.send({
            employees: employees.filter(e => {
              return user.level === 'admin' ||
                user._id.toString() === e._id.toString() ||
                e.signers.some(signer => signer.id === user._id.toString())
            })
              .map(e => {
                return {
                  _id: e._id,
                  enabled: e.enabled,
                  password: e.password,
                  employeeID: e.employeeID,
                  username: e.username,
                  name: e.name,
                  email: e.email,
                  level: e.level,
                  dept: e.dept,
                  signers: e.signers,
                  arrivedDate: e.arrivedDate,
                  unSigningRecords: e.records
                    .filter(r => {
                      const allSignersSigned = r.signers.every(signer => r.signings.some(signing => signing.id === signer.id))
                      return r.signings.length > 0 ? r.signings.every(signing => signing.pass) && !allSignersSigned : !allSignersSigned
                    })
                }
              }),
            fullControl: user.level === 'admin'
          })
        }
      }).sort({ _id: -1 })
    } else {
      res.send({ success: false, message: "login user is not found" })
    }
  })
})

app.get('/employees/lightweight/:loginuser/:token', (req, res) => {
  Employee.findOne({ username: new RegExp(`^${req.params.loginuser}$`, "i"), password: req.params.token }, (err, user) => {
    if (user) {
      Employee.find({ username: { $ne: "admin" } }, null, (err, employees) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          res.send({
            employees: employees.filter(e => {
              return user.level === 'admin' ||
                user._id.toString() === e._id.toString() ||
                e.signers.some(signer => signer.id === user._id.toString())
            })
              .map(e => {
                return {
                  _id: e._id,
                  enabled: e.enabled,
                  username: e.username,
                  name: e.name,
                  level: e.level,
                  dept: e.dept
                }
              }),
            fullControl: user.level === 'admin'
          })
        }
      }).sort({ _id: -1 })
    } else {
      res.send({ success: false, message: "login user is not found" })
    }
  })
})

app.post('/employee/:loginuser/:token', (req, res) => {
  validate_admin(req.params.loginuser, req.params.token, (pass) => {
    if (pass) {
      Employee.findOne({ username: new RegExp(`^${req.body.username}$`, "i") }, (err, user) => {
        if (!user) {
          const new_employee = new Employee({
            employeeID: req.body.employeeID,
            dept: req.body.dept,
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            arrivedDate: req.body.arrivedDate,
            level: req.body.level,
            signers: req.body.signers,
            activatedDateTypes: req.body.activatedDateTypes,
            password: req.body.username.toLocaleLowerCase(),
            records: []
          })

          new_employee.save((err) => {
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
})

app.get('/monthlyreport/:year/:month/:loginuser/:token', (req, res) => {
  Employee.findOne({ username: new RegExp(`^${req.params.loginuser}$`, "i"), password: req.params.token }, (err, user) => {
    if (user) {
      Employee.find({ username: { $ne: "admin" } }, null, (err, employees) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          res.send({
            fullControl: user.level === 'admin',
            report: employees.map(e => {
              const year = parseInt(req.params.year)
              const month = parseInt(req.params.month)
              const signedRecords = e.records.filter(checkingSigned)
              const recordsWithinThisYearNMonth = getRecordsWithinThisYearNMonth(
                signedRecords,
                year,
                month
              )
              const recordGroupsWithinDate = groupRecordsByDate(
                recordsWithinThisYearNMonth,
                month
              )
              const recordGroupsWithinDateNLeaveType = recordGroupsWithinDate.map(
                groupRecordsByLeaveType
              )
              const totalsGroupsWithinDateNLeaveType = recordGroupsWithinDateNLeaveType.map(
                (dateGroup, index) => {
                  return {
                    day: index,
                    list: dateGroup.map(leaveTypeGroup => {
                      return {
                        ...leaveTypeGroup,
                        totals: calculateTotals(leaveTypeGroup.list)
                      }
                    })
                  }
                }
              )

              return {
                _id: e._id,
                employeeID: e.employeeID,
                dept: e.dept,
                name: e.name,
                username: e.username,
                enabled: e.enabled,
                arrivedDate: formatDate(e.arrivedDate),
                recordGroups: totalsGroupsWithinDateNLeaveType,
                leaveTypeGroups: groupRecordsByLeaveType(recordsWithinThisYearNMonth)
                  .map(leaveTypeGroup => {
                    return {
                      ...leaveTypeGroup,
                      totals: calculateTotals(leaveTypeGroup.list)
                    }
                  })
              }
            })
          })
        }
      }).sort({ arrivedDate: 1 })
    }
  })
})

app.get('/annualreport/:year/:loginuser/:token', (req, res) => {
  Employee.findOne({ username: new RegExp(`^${req.params.loginuser}$`, "i"), password: req.params.token }, (err, user) => {
    if (user) {
      Employee.find({ username: { $ne: "admin" } }, null, (err, employees) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          res.send({
            fullControl: user.level === 'admin',
            report: employees.filter(e => {
              return user.level === 'admin' ||
                user._id.toString() === e._id.toString() ||
                e.signers.some(signer => signer.id === user._id.toString())
            })
              .map(e => {
                const year = parseInt(req.params.year)
                const signedRecords = e.records.filter(checkingSigned)
                const recordsWithinThisYear = getRecordsWithinThisYearNMonth(
                  signedRecords,
                  year
                )
                const recordGroupsWithinMonth = groupRecordsByMonth(
                  recordsWithinThisYear
                )
                const recordGroupsWithinMonthNLeaveType = recordGroupsWithinMonth.map(
                  groupRecordsByLeaveType
                )
                const totalsGroupsWithinMonthNLeaveType = recordGroupsWithinMonthNLeaveType.map(
                  (monthGroup, index) => {
                    return {
                      month: index,
                      list: monthGroup.map(leaveTypeGroup => {
                        return {
                          ...leaveTypeGroup,
                          totals: calculateTotals(leaveTypeGroup.list)
                        }
                      })
                    }
                  }
                )

                const arrivedDateObj = parseDate(e.arrivedDate)
                let annualInfo = [];
                if (arrivedDateObj) {
                  const months = diffMonth(arrivedDateObj.date, new Date(year, arrivedDateObj.month - 1, arrivedDateObj.day))
                  const seniority = Math.floor(months / 12)
                  //          0.5, 1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13,    14, 15, 16...
                  const map = [10, 11, 12, 14, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20];// 20, 21, 22...
                  /* Labor Standards Act
                  const map = [3,  7,  10, 14, 14, 15, 15, 15, 15, 15, 16, 17, 18, 19];// 20, 21, 22...
                  */
                  const dateRanges = [
                    {
                      start: new Date(year - 1, arrivedDateObj.month - 1, arrivedDateObj.day),
                      end: new Date(year, arrivedDateObj.month - 1, arrivedDateObj.day),
                      days: seniority > 13 ? seniority + 6 - 1 : seniority > 0 ? map[seniority - 1] : 0
                    }, {
                      start: new Date(year, arrivedDateObj.month - 1, arrivedDateObj.day),
                      end: new Date(year + 1, arrivedDateObj.month - 1, arrivedDateObj.day),
                      days: seniority > 13 ? seniority + 6 : map[seniority]
                    }]
                  annualInfo = dateRanges.map(x => {
                    const annualRecords = getRecordsBetweenDates(signedRecords, x.start, x.end)
                      .filter(y => y.dateType === 'annual')
                    return {
                      deadline: `${x.start.getFullYear()}~${x.end.getFullYear()}`,
                      totalDays: x.days,
                      totals: calculateTotals(annualRecords)
                    }
                  })
                }

                return {
                  _id: e._id,
                  employeeID: e.employeeID,
                  dept: e.dept,
                  name: e.name,
                  username: e.username,
                  enabled: e.enabled,
                  arrivedDate: formatDate(e.arrivedDate),
                  recordGroups: totalsGroupsWithinMonthNLeaveType,
                  leaveTypeGroups: groupRecordsByLeaveType(recordsWithinThisYear)
                    .map(leaveTypeGroup => {
                      return {
                        ...leaveTypeGroup,
                        totals: calculateTotals(leaveTypeGroup.list)
                      }
                    }),
                  annualInfo
                }
              })
          })
        }
      }).sort({ arrivedDate: 1 })
    }
  })
})

app.get('/employee/:id/:loginuser/:token', (req, res) => {
  validate_owner(req.params.id, req.params.loginuser, req.params.token, (pass, user) => {
    if (user) {
      Employee.findById(req.params.id, null, (err, Employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          res.send({
            _id: Employee._id,
            employeeID: Employee.employeeID,
            dept: Employee.dept,
            name: Employee.name,
            email: Employee.email,
            username: Employee.username,
            arrivedDate: Employee.arrivedDate,
            level: Employee.level,
            signers: Employee.signers,
            activatedDateTypes: Employee.activatedDateTypes,
            records: Employee.records,
            fullControl: user.level === 'admin'
          })
        }
      })
    } else {
      res.send({ success: false, message: "token validation failed[1]" })
    }
  })
})

app.put('/employee/:id/:loginuser/:token', (req, res) => {
  validate_admin(req.params.loginuser, req.params.token, (pass) => {
    if (pass) {
      Employee.findById(req.params.id, null, (err, employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          // employee.username = req.body.username
          employee.employeeID = req.body.employeeID
          employee.name = req.body.name
          employee.email = req.body.email
          employee.level = req.body.level
          employee.dept = req.body.dept
          employee.arrivedDate = req.body.arrivedDate
          employee.signers = req.body.signers
          employee.activatedDateTypes = req.body.activatedDateTypes

          Employee.find({ 'signers': { $elemMatch: { username: employee.username } } }, (err, employees) => {
            employee.save((err) => {
              if (err) {
                res.send({ success: false, message: err })
              } else {
                updateOthersSignerInfo(employees,
                  {
                    employeeID: employee.employeeID,
                    username: employee.username,
                    name: employee.name,
                    level: employee.level,
                    dept: employee.dept
                  },
                  res,
                  (res) => res.send({ success: true, message: "employee updated successfully" }))
              }
            })
          })
        }
      })
    } else {
      res.send({ success: false, message: "token validation failed" })
    }
  })
})

app.put('/switch/:id/:loginuser/:token', (req, res) => {
  validate_admin(req.params.loginuser, req.params.token, (pass) => {
    if (pass) {
      Employee.findById(req.params.id, null, (err, Employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          Employee.enabled = !Employee.enabled

          Employee.save((err) => {
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
})

app.delete('/employee/:id/:loginuser/:token', (req, res) => {
  validate_admin(req.params.loginuser, req.params.token, (pass) => {
    if (pass) {
      Employee.remove({
        _id: req.params.id
      }, (err) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          res.send({ success: true, message: "employee deleted successfully" })
        }
      })
    } else {
      res.send({ success: false, message: "token validation failed" })
    }
  })
})

app.post('/auth', (req, res) => {
  Employee.findOne({ username: new RegExp(`^${req.body.username}$`, "i") }, (err, user) => {
    if (err) {
      res.send({ success: false, message: err })
    } else {
      if (user) {
        user.comparePassword(req.body.password, (err, { isMatch, token }) => {
          if (err) {
            res.send({ success: false, message: err })
          } else {
            if (isMatch) {
              updateUserData(user, (logs) => res.send({ success: true, message: "login successfully", token: token, logs: logs }))
            } else {
              res.send({ success: false, message: "wrong password" })
            }
          }
        })
      } else {
        res.send({ success: false, message: "wrong user name" })
      }
    }
  })
})

app.put('/employee/loa/:id/:loginuser/:token', (req, res) => {
  validate_owner(req.params.id, req.params.loginuser, req.params.token, (pass, user) => {
    if (pass || (user && user.level === 'admin')) {
      Employee.findById(req.params.id, null, (err, employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          employee.activatedDateTypes = req.body.activatedDateTypes
          employee.records = employee.records.concat(req.body.records.map(r => {
            return {
              appliedDate: r.appliedDate,
              dateType: r.dateType,
              dates: r.dates,
              startFrom: r.startFrom,
              endTo: r.endTo,
              agent: r.agent,
              totals: r.totals,
              signers: employee.signers
            }
          }))
          employee.save((err) => {
            if (err) {
              res.send({ success: false, message: err, })
            } else {
              collectSignersEmails(employee.signers,
                [],
                (signers) => emailUtil.sendLeaveTakingEmail(
                  {
                    taker: employee,
                    signers,
                    records: req.body.records
                  },
                ))
              res.send({ success: true, message: "records updated successfully" })
            }
          })
        }
      })
    } else {
      res.send({ success: false, message: "token validation failed" })
    }
  })
})

app.put('/employee/email/:id/:loginuser/:token', (req, res) => {
  validate_owner(req.params.id, req.params.loginuser, req.params.token, (pass, user) => {
    if (pass || (user && user.level === 'admin')) {
      Employee.findById(req.params.id, null, (err, employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          employee.email = req.body.email
          Employee.find({ 'signers': { $elemMatch: { username: employee.username } } }, (err, employees) => {
            employee.save((err) => {
              if (err) {
                res.send({ success: false, message: err })
              } else {
                updateOthersSignerInfo(employees,
                  {
                    employeeID: employee.employeeID,
                    username: employee.username,
                    name: employee.name,
                    level: employee.level,
                    dept: employee.dept
                  },
                  res,
                  (res) => res.send({ success: true, message: "employee updated successfully" }))
              }
            })
          })
        }
      })
    } else {
      res.send({ success: false, message: "token validation failed" })
    }
  })
})

app.put('/employee/pwd/:id/:loginuser/:token', (req, res) => {
  validate_owner(req.params.id, req.params.loginuser, req.params.token, (pass, user) => {
    if (pass || (user && user.level === 'admin')) {
      Employee.findById(req.params.id, null, (err, Employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          if (req.body.password) {
            Employee.password = req.body.password
            Employee.save((err) => {
              if (err) {
                res.send({ success: false, message: err })

              } else {
                res.send({ success: true, message: "password updated successfully" })
              }
            })
          }
        }
      })
    } else {
      res.send({ success: false, message: "token validation failed" })
    }
  })
})

app.put('/employee/sign/:id/:loginuser/:token', (req, res) => {
  validate_signer(req.params.id, req.params.loginuser, req.params.token, (pass, signer) => {
    if (pass) {
      Employee.findById(req.params.id, null, (err, Employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          const signedRecord = Employee.records.find(r => r._id.toString() === req.body.recordID)
          const alreadySigned = signedRecord.signings.some(signing => signing.id === signer.id)
          if (signedRecord) {
            if (!alreadySigned) {
              if (!req.body.pass) {
                const dateType = Employee.activatedDateTypes.find(dt => dt.name === signedRecord.dateType)
                const totalHalfHours = signedRecord.totals.days * 16 + signedRecord.totals.halfHours
                let consumeHalfHours = dateType.consumes.days * 16 + dateType.consumes.halfHours
                consumeHalfHours -= totalHalfHours
                dateType.consumes.days = Math.floor(consumeHalfHours / 16)
                dateType.consumes.halfHours = consumeHalfHours % 16
              }

              signedRecord.signings.push({
                id: signer._id,
                name: signer.name,
                username: signer.username,
                dept: signer.dept,
                level: signer.level,
                signedDate: new Date(),
                pass: req.body.pass
              })

              Employee.save((err) => {
                if (err) {
                  res.send({ success: false, message: err })
                } else {
                  emailUtil.sendLeaveSigningEmail({ taker: Employee, signer: signer, record: signedRecord })
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
})

app.listen(process.env.PORT || 8081)

function collectSignersEmails(signers, signersWithEmails, cb) {
  const signer = signers.pop()
  if (signer) {
    Employee.findOne({ username: new RegExp(`^${signer.username}$`, "i") }, (err, employee) => {
      if (employee.email) {
        signersWithEmails.push({
          username: employee.username,
          employeeID: employee.employeeID,
          name: employee.name,
          email: employee.email,
          dept: employee.dept,
          level: employee.level,
        })
      }
      collectSignersEmails(signers, signersWithEmails, cb)
    })
  } else {
    cb(signersWithEmails)
  }
}

function updateOthersSignerInfo(employees, signerInfo, res, cb) {
  const employee = employees.pop()
  if (employee) {
    employee.signers.forEach((signer) => {
      if (signer.username === signerInfo.username) {
        signer.employeeID = signerInfo.employeeID
        signer.name = signerInfo.name
        signer.dept = signerInfo.dept
        signer.level = signerInfo.level
      }
    })
    employee.save((err) => {
      if (err) {
        res.send({ success: false, message: err })
      } else {
        updateOthersSignerInfo(employees, signerInfo, res, cb)
      }
    })
  } else {
    cb(res)
  }
}

function validate_admin(username, token, cb) {
  console.log({ username, token })
  Employee.findOne({ username: new RegExp(`^${username}$`, "i"), password: token, level: 'admin' }, (err, user) => {
    cb(!!user)
  })
}

function validate_owner(id, loginuser, token, cb) {
  console.log({ id, loginuser, token })
  Employee.findOne({ username: new RegExp(`^${loginuser}$`, "i"), password: token }, (err, user) => {
    const pass = user && id === user._id.toString()
    cb(pass, user)
  })
}

function validate_signer(id, loginuser, token, cb) {
  console.log({ id, loginuser, token })
  Employee.findOne({ username: new RegExp(`^${loginuser}$`, "i"), password: token }, (err, signer) => {
    if (signer) {
      Employee.findById(id, null, (err, signed) => {
        if (signed) {
          cb(signer.level === 'admin' || signed.signers.some(s => s.id === signer.id), signer)
        } else {
          cb(false)
        }
      })
    } else {
      cb(false)
    }
  })
}

function checkingSigned(record) {
  const allSignersSigned = record.signers.every(signer =>
    record.signings.some(signing => signing.id === signer.id)
  )
  return record.signings.length > 0
    ? record.signings.every(signing => signing.pass) && allSignersSigned
    : allSignersSigned
}

function parseDate(date) {
  return date
    ? {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      date
    }
    : undefined
}

function getRecordsWithinThisYearNMonth(records, year, month) {
  const res = [];
  records.forEach(record => {
    const anyDatesOfRecordWithinThisYearNMonth = record.dates
      .map(parseDate)
      .some(dateObj =>
        dateObj && dateObj.year === year &&
        (!month || dateObj.month === month))
    if (anyDatesOfRecordWithinThisYearNMonth) {
      res.push(record)
    }
  })
  return res;
}

function getRecordsBetweenDates(records, start, end) {
  const res = [];
  records.forEach(record => {
    const anyDatesOfRecordBetweenDates = record.dates
      .map(parseDate)
      .some(dateObj => dateObj && dateObj.date < end && dateObj.date >= start)
    if (anyDatesOfRecordBetweenDates) {
      res.push(record)
    }
  })
  return res;
}

function groupRecordsByDate(records, month) {
  const dayMaxLengthOfMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const res = Array.apply(null, { length: dayMaxLengthOfMonth[month - 1] }).map((v, i) => []);
  records.forEach(record => {
    record.dates.map(parseDate)
      .forEach(dateObj => {
        const recordExists = res[dateObj.day - 1].find(x => x._id === record._id)
        if (!recordExists) {
          res[dateObj.day - 1].push(record)
        }
      })
  })
  return res
}

function groupRecordsByMonth(records) {
  const res = Array.apply(null, { length: 12 }).map((v, i) => []);
  records.forEach(record => {
    record.dates.map(parseDate)
      .forEach(dateObj => {
        const recordExists = res[dateObj.month - 1].find(x => x._id === record._id)
        if (!recordExists) {
          res[dateObj.month - 1].push(record)
        }
      })
  })
  return res
}

function groupRecordsByLeaveType(records) {
  const res = []
  records.forEach(record => {
    let temp = res.find(x => x.key === record.dateType)
    if (temp) {
      temp.list.push(record)
    } else {
      res.push({
        key: record.dateType,
        list: [record]
      })
    }
  })
  return res
}

function calculateTotals(records) {
  return sumUpTotals(records.map(record => record.totals))
}

function sumUpTotals(totalsList) {
  const counter = { days: 0, hours: 0 }
  totalsList.forEach(({ days, halfHours }) => {
    if (halfHours > 0) {
      counter.hours += halfHours / 2
      if (counter.hours >= 8) {
        counter.days += Math.floor(counter.hours / 8)
        counter.hours = counter.hours % 8
      }
    } else {
      counter.days += days
    }
  })
  return counter
}

function formatDate(dateString) {
  return dateString
    ? dateString === 'now'
      ? new Date().toJSON().substr(0, 10)
      : new Date(dateString).toJSON().substr(0, 10)
    : ''
}

function createObjectByKeys(keys, value) {
  const obj = {}
  keys.forEach(key => {
    obj[key] = value
  })
  return obj
}

function updateUserData(user, cb) {
  const enableDateTypes = user.activatedDateTypes.filter((dt) => dt.enabled)
  const logs = [];
  let today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentDay = today.getDate()
  today = new Date(currentYear, currentMonth, currentDay)

  const annualDateType = enableDateTypes.find((dt) => dt.name === 'annual')
  if (user.arrivedDate && annualDateType) {

    const arrivedDate = new Date(user.arrivedDate)
    const arrivedYear = arrivedDate.getFullYear()
    const arrivedMonth = arrivedDate.getMonth()
    const arrivedDay = arrivedDate.getDate()

    const months = diffMonth(new Date(arrivedDate), today)
    const seniority = Math.floor(months / 12)
    //          0.5, 1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13,    14, 15, 16...
    const map = [10, 11, 12, 14, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20];// 20, 21, 22...
    /* Labor Standards Act
    const map = [3,  7,  10, 14, 14, 15, 15, 15, 15, 15, 16, 17, 18, 19];// 20, 21, 22...
    */
    const days = seniority > 13 ? seniority + 6 : map[seniority]

    if (months >= 6) {
      let deadline = new Date(currentYear, arrivedMonth, arrivedDay - 1)
      deadline = deadline >= today ? deadline : new Date(currentYear + 1, arrivedMonth, arrivedDay - 1)
      if (deadline > annualDateType.deadline) {

        const annualPreRequestDateType = enableDateTypes.find((dt) => dt.name === 'annualPreRequest')
        if (user.arrivedDate && annualPreRequestDateType) {
          const days_next = seniority > 12 ? seniority + 7 : map[seniority + 1]
          let deadline_next = new Date(deadline.getFullYear() + 1, deadline.getMonth(), deadline.getDate())
          annualPreRequestDateType.deadline = deadline_next
          annualPreRequestDateType.totals.days = days_next

          if (annualPreRequestDateType.consumes.days > 0) {
            annualDateType.consumes.days = annualPreRequestDateType.consumes.days
            annualPreRequestDateType.consumes.days = 0
            user.records.forEach(r => {
              if (r.dateType === 'annualPreRequest') {
                r.dateType = 'annual'
              }
            });
          } else {
            annualDateType.consumes.days = 0
          }
        } else {
          annualDateType.consumes.days = 0
        }

        annualDateType.deadline = deadline
        annualDateType.totals.days = days
        logs.push(annualDateType)
      }
    }
  }


  const sickDateType = enableDateTypes.find((dt) => dt.name === 'sick')
  if (sickDateType) {
    const deadline = new Date(currentYear + 1, 0, 0)
    if (deadline > sickDateType.deadline) {
      sickDateType.deadline = deadline
      sickDateType.totals.days = 30
      sickDateType.consumes.days = 0
      logs.push(sickDateType)
    }
  }

  const familyCareDateType = enableDateTypes.find((dt) => dt.name === 'familyCare')
  if (familyCareDateType) {
    const deadline = new Date(currentYear + 1, 0, 0)
    if (deadline > familyCareDateType.deadline) {
      familyCareDateType.deadline = deadline
      familyCareDateType.totals.days = 7
      familyCareDateType.consumes.days = 0
      logs.push(familyCareDateType)
    }
  }

  const personalDateType = enableDateTypes.find((dt) => dt.name === 'personal')
  if (personalDateType) {
    const deadline = new Date(currentYear + 1, 0, 0)
    if (deadline > personalDateType.deadline) {
      personalDateType.deadline = deadline
      personalDateType.totals.days = 14
      personalDateType.consumes.days = 0
      logs.push(personalDateType)
    }
  }

  const menstrualDateType = enableDateTypes.find((dt) => dt.name === 'menstrual')
  if (menstrualDateType) {
    const deadline = currentMonth < 11 ? new Date(currentYear, currentMonth + 1, 0) : new Date(currentYear + 1, 0, 0)
    if (deadline > menstrualDateType.deadline) {
      menstrualDateType.deadline = deadline
      menstrualDateType.totals.days = 1
      menstrualDateType.consumes.days = 0
      logs.push(menstrualDateType)
    }
  }

  const businessTripDateType = enableDateTypes.find((dt) => dt.name === 'businessTrip')
  if (businessTripDateType) {
    const deadline = currentMonth < 11 ? new Date(currentYear, currentMonth + 1, 0) : new Date(currentYear + 1, 0, 0)
    if (deadline > businessTripDateType.deadline) {
      businessTripDateType.deadline = deadline
      businessTripDateType.totals.days = 20
      businessTripDateType.consumes.days = 0
      logs.push(businessTripDateType)
    }
  }

  if (cb) {
    user.save((err) => {
      if (err) {
        console.log(err)
      }
      cb(logs)
    })
  } else {
    return user;
  }
}

function diffMonth(from, to) {
  let fromMonths, toMonths;
  fromMonths = from.getFullYear() * 12 + from.getMonth()
  toMonths = to.getFullYear() * 12 + to.getMonth() + (to.getDate() < from.getDate() ? -1 : 0)
  return toMonths >= fromMonths ? toMonths - fromMonths : 0;
}

function importEmails(array) {
  var item = array.pop()
  if (item) {
    console.log("import email " + item.username + ", " + array.length + " left")
    Employee.findOne({ username: new RegExp(`^${item.username}$`, "i") }, (err, user) => {
      user.email = item.email
      user.save((err) => {
        if (err) {
          console.log(err)
        } else {
          importEmails(array)
        }
      })
    })
  }
}

function importDataAll(array) {
  var item = array.pop()
  if (item) {
    console.log("import " + item.username + ", " + array.length + " left")
    new Employee(
      Object.assign({}, item,
        {
          password: item.username.toLocaleLowerCase()
        })
    ).save((err) => {
      if (err) {
        console.log(err)
      } else {
        importDataAll(array)
      }
    })
  }
}

function importData(array) {
  var item = array.pop()
  if (item) {
    console.log("import " + item.username + ", " + array.length + " left")
    new Employee({
      employeeID: item.employeeID,
      username: item.username,
      password: item.username.toLocaleLowerCase(),
      name: item.name,
      level: item.level,
      dept: item.dept,
      arrivedDate: item.arrivedDate,
      activatedDateTypes: item.activatedDateTypes,
      email: item.email
    }).save((err) => {
      if (err) {
        console.log(err)
      } else {
        importData(array)
      }
    })
  } else {
    addSigners(JSON.parse(JSON.stringify(data)))
  }
}

function addSigners(array) {
  var item = array.pop()
  if (item) {
    console.log("add signers to " + item.username + ", " + array.length + " left")
    Employee.findOne({ username: new RegExp(`^${item.username}$`, "i") }, (err, user) => {
      user = updateUserData(user)
      if (err) {
        console.log(err)
      } else {
        addSigner(array, user, item.signers)
      }
    })
  }
}

function addSigner(array, user, signernames) {
  var signername = signernames.pop()
  if (signername) {
    console.log("add signer: " + signername + ", " + signernames.length + " left")
    Employee.findOne({ username: new RegExp(`^${signername}$`, "i") }, (err, signer) => {
      if (err) {
        console.log(err)
      } else {
        user.signers.push({
          id: signer._id,
          dept: signer.dept,
          name: signer.name,
          username: signer.username,
          level: signer.level,
          email: signer.email
        })
        user.save((err) => {
          if (err) {
            console.log(err)
          } else {
            addSigner(array, user, signernames)
          }
        })
      }
    })
  } else {
    addSigners(array)
  }
}