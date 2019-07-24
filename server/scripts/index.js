const mongoose = require("mongoose");
const Employee = require("../models/employee");
const c = require("../src/shared/collection");
const data = require("./data.json");

const DATABASE_URL = process.env.DATABASE_URL || "localhost:27017";
mongoose.set("useCreateIndex", true);
mongoose.connect(`mongodb://${DATABASE_URL}/employee`, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connection Succeeded");
  Employee.find(c.conditions.all(), null, (err, employees) => {
    update(employees, () => console.log("Update is All Done"));
  });
});

function update(employees, cb) {
  const employee = employees.pop();
  if (employee) {
    const target = data[employee.username];
    if (target) {
      const leaveTypeTargets = ["sick", "personal"];
      leaveTypeTargets.forEach(ltt => {
        const lt = employee.activatedLeaveTypes.find(
          lt => lt.name === ltt && lt.enabled
        );
        if (lt) {
          lt.consumes = {
            days: target[ltt].days,
            halfHours: target[ltt].hours * 2
          };
        } else {
          console.log(employee.username + ": " + ltt + "is not Found");
        }
      });
      employee.save(err => {
        if (err) {
          throw err;
        } else {
          console.log("Update " + employee.username + " is Done");
          update(employees, cb);
        }
      });
    } else {
      console.log(employee.username + " is not Found");
      update(employees, cb);
    }
  } else {
    cb();
  }
}
