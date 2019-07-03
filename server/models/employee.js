const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

var EmployeeSchema = new Schema({
  enabled: { type: Boolean, default: true },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  employeeID: String,
  name: String,
  dept: String,
  email: String,
  arrivedDate: Date,
  level: String,
  signers: [
    { id: String, dept: String, name: String, username: String, level: String }
  ],
  activatedLeaveTypes: [
    {
      halfHoursEnabled: Boolean,
      enabled: Boolean,
      name: String,
      totals: {
        days: Number,
        halfHours: Number
      },
      consumes: {
        days: Number,
        halfHours: Number
      },
      deadline: Date,
      stashed: Boolean
    }
  ],
  records: [
    {
      appliedDate: Date,
      leaveType: String,
      dates: [Date],
      startFrom: String,
      endTo: String,
      remarks: String,
      totals: {
        days: Number,
        halfHours: Number
      },
      signings: [
        {
          id: String,
          dept: String,
          name: String,
          username: String,
          level: String,
          signedDate: Date,
          pass: Boolean
        }
      ],
      signers: [
        {
          id: String,
          dept: String,
          name: String,
          username: String,
          level: String
        }
      ]
    }
  ],
  shifts: [
    {
      date: Date,
      daypart: String,
      primary: Boolean
    }
  ]
});

EmployeeSchema.pre("save", function(next) {
  const employee = this;

  // only hash the password if it has been modified (or is new)
  if (!employee.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(employee.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      employee.password = hash;
      next();
    });
  });
});

EmployeeSchema.methods.comparePassword = function(passwordCandidate, cb) {
  const password = this.password;
  bcrypt.compare(passwordCandidate, password, (err, match) => {
    if (err) return cb(err);
    cb(null, { token: password, match: match });
  });
};

module.exports = mongoose.model("Employee", EmployeeSchema);
