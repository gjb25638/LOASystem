var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

var EmployeeSchema = new Schema({
  enabled: { type: Boolean, default: true },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  employeeID: String,
  name: String,
  dept: String,
  arrivedDate: Date,
  level: String,
  signers: [{ id: String, dept: String, name: String, username: String, level: String }],
  activatedDateTypes: [{
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
    deadline: Date
  }],
  records: [{
    appliedDate: Date,
    dateType: String,
    dates: [Date],
    startFrom: String,
    endTo: String,
    agent: String,
    totals: {
      days: Number,
      halfHours: Number
    },
    signings: [{
      id: String,
      dept: String,
      name: String,
      username: String,
      level: String,
      signedDate: Date,
      pass: Boolean
    }], 
    signers: [{
      id: String,
      dept: String,
      name: String,
      username: String,
      level: String,
      signedDate: Date,
      pass: Boolean
    }]
  }]
});



EmployeeSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

EmployeeSchema.methods.comparePassword = function (candidatePassword, cb) {
  let password = this.password;
  let level = this.level;
  bcrypt.compare(candidatePassword, password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, { token: password, isMatch: isMatch });
  });
};

var Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;