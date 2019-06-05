const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const employees = require("./api/employees");
const employee = require("./api/employee");
const toggle = require("./api/toggle");
const auth = require("./api/auth");
const report = require("./api/report");
const dbOp = require("./api/db");
const shift = require("./api/shift");
const holiday = require("./api/holiday");
const util = require("./shared/util");

const Employee = require("../models/employee");
const defaultUser = util.importJSON("../../models/", "defaultUser.json");

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

const mongoose = require("mongoose");

const DATABASE_URL = process.env.DATABASE_URL || "localhost:27017";
mongoose.set("useCreateIndex", true);
mongoose.connect(`mongodb://${DATABASE_URL}/employee`, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connection Succeeded");
  Employee.findOne({ username: "admin" }, (err, user) => {
    if (!user) {
      new Employee(defaultUser).save(err => {
        if (err) {
          throw err;
        }
      });
    }
  });
});

app.get("/employees/:loginuser/:token", employees.get);
app.get("/employees/lightweight/:loginuser/:token", employees.lightweight.get);
app.get(
  "/employees/compensatory/:loginuser/:token",
  employees.compensatory.get
);
app.post("/employee/:loginuser/:token", employee.post);
app.get("/employee/:id/:loginuser/:token", employee.get);
app.put("/employee/:id/:loginuser/:token", employee.put);
app.delete("/employee/:id/:loginuser/:token", employee.delete);
app.put("/employee/loa/:id/:loginuser/:token", employee.loa.put);
app.put("/employee/email/:id/:loginuser/:token", employee.email.put);
app.put("/employee/pwd/:id/:loginuser/:token", employee.pwd.put);
app.put("/employee/sign/:id/:loginuser/:token", employee.sign.put);
app.put("/toggle/:id/:loginuser/:token", toggle.put);
app.post("/auth", auth.post);
app.get("/annual/:year/:loginuser/:token", report.annual.get);
app.get("/monthly/:year/:month/:loginuser/:token", report.monthly.get);
app.get(
  "/monthly/report/:year/:month/:loginuser/:token",
  report.monthly.groupby.get
);
app.get(
  "/monthly/sdehsra/:year/:month/:loginuser/:token",
  report.monthly.sdehsra.get
);
app.get("/annual/report/:year/:loginuser/:token", report.annual.groupby.get);
app.get(
  "/annual/export/report/:year/:loginuser/:token",
  report.export.annual.get
);
app.get(
  "/monthly/export/report/:year/:month/:loginuser/:token",
  report.export.monthly.get
);
app.get("/shift/export/:year/:month/:loginuser/:token", shift.export.get);
app.get("/db/backup/:loginuser/:token", dbOp.backup.get);
app.get("/db/restore/:loginuser/:token", dbOp.restore.get);
app.get("/db/check/:loginuser/:token", dbOp.check.get);
app.post("/shift/new/:id/:loginuser/:token", shift.post);
app.post("/shift/delete/:id/:loginuser/:token", shift.delete);
app.get("/shift/config/period/:loginuser/:token", shift.config.period.get);
app.put("/shift/config/period/:loginuser/:token", shift.config.period.put);
app.get("/holiday/:year/:month/:loginuser/:token", holiday.get);
app.get("/shift/:year/:month/:loginuser/:token", shift.get);

app.get("/avatar/:username", (req, res) => {
  const defaultFilepath = path.join(__dirname, `avatar/unknown.jpg`);
  const filepath = path.join(
    __dirname,
    `avatar/${req.params.username.toLowerCase()}.jpg`
  );
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.sendFile(defaultFilepath);
  }
});

app.listen(process.env.PORT || 8081);
