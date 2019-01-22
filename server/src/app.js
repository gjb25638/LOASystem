const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const emailUtil = require("./email.js")
const Employee = require("../models/employee")
const data = require("../models/data")

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
            importData(JSON.parse(JSON.stringify(data)))
          }
        }
      })
    }
  })

})

app.get('/employees/:loginuser/:token', (req, res) => {
  Employee.findOne({ username: new RegExp(`^${req.params.loginuser}$`, "i"), password: req.params.token }, (err, user) => {
    if (user) {
      Employee.find({}, null, (err, employees) => {
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
      Employee.findById(req.params.id, null, (err, Employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          Employee.username = req.body.username
          Employee.employeeID = req.body.employeeID
          Employee.name = req.body.name
          Employee.email = req.body.email
          Employee.level = req.body.level
          Employee.dept = req.body.dept
          Employee.arrivedDate = req.body.arrivedDate
          Employee.signers = req.body.signers
          Employee.activatedDateTypes = req.body.activatedDateTypes

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
      }, (err, Employee) => {
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
      Employee.findById(req.params.id, null, (err, Employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          Employee.activatedDateTypes = req.body.activatedDateTypes
          Employee.records = Employee.records.concat(req.body.records.map(r => {
            return {
              appliedDate: r.appliedDate,
              dateType: r.dateType,
              dates: r.dates,
              startFrom: r.startFrom,
              endTo: r.endTo,
              agent: r.agent,
              totals: r.totals,
              signers: Employee.signers
            }
          }))
          Employee.save((err) => {
            if (err) {
              res.send({ success: false, message: err, })
            } else {
              emailUtil.sendLeaveTakingEmail({ taker: Employee, signers: Employee.signers, records: req.body.records })
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
      Employee.findById(req.params.id, null, (err, Employee) => {
        if (err) {
          res.send({ success: false, message: err })
        } else {
          Employee.email = req.body.email
          Employee.save((err) => {
            if (err) {
              res.send({ success: false, message: err })

            } else {
              res.send({ success: true, message: "email updated successfully" })
            }
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
            if (!alreadySigned || signer.level === 'admin') {
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
    // const map = [10, 11, 12, 14, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20];// 20, 21, 22...
    // Labor Standards Act
    const map = [3,  7,  10, 14, 14, 15, 15, 15, 15, 15, 16, 17, 18, 19];// 20, 21, 22...
    
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
      activatedDateTypes: item.activatedDateTypes
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
          level: signer.level
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