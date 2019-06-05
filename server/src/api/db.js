const fs = require("fs");
const path = require("path");
const Cryptr = require("cryptr");
const Employee = require("../../models/employee");
const c = require("../shared/collection");
const validate = require("../shared/validation");
const util = require("../shared/util");

const dir = path.join(__dirname, "../../backup");

module.exports = {
  backup: {
    get: backup
  },
  restore: {
    get: restore
  },
  check: {
    get: check
  },
  clear: {
    get: clear
  }
};

function backup(req, res) {
  validate.admin(req.params.loginuser, req.params.token, (err, pass) => {
    if (err) {
      res.send({ success: false, message: err });
    } else if (pass) {
      Employee.find(c.conditions.all(), null, (err, employees) => {
        if (err) {
          res.send({ success: false, message: err });
        } else {
          const rightnow = new Date().toLocaleString();
          const cryptr = new Cryptr("infostrum");
          const encrypted = cryptr.encrypt(JSON.stringify(employees));
          const bkpath = path.join(dir, "bk");
          const infopath = path.join(dir, "info.txt");
          fs.writeFileSync(bkpath, encrypted);
          fs.writeFileSync(infopath, rightnow);
          res.attachment(`${rightnow}.bk`);
          res.send(encrypted);
        }
      });
    } else {
      res.send({ success: false, message: "token validation failed" });
    }
  });
}

function restore(req, res) {
  validate.admin(req.params.loginuser, req.params.token, (err, pass) => {
    if (err) {
      res.send({ success: false, message: err });
    } else if (pass) {
      Employee.find(c.conditions.all(), null, (err, employees) => {
        if (err) {
          res.send({ success: false, message: err });
        } else {
          const cryptr = new Cryptr("infostrum");
          const filepath = path.join(dir, "bk");
          const decrypted = cryptr.decrypt(fs.readFileSync(filepath));
          Employee.remove(c.conditions.all(), err => {
            if (err) {
              res.send({ success: false, message: err });
            } else {
              // restoreData(util.importJSON("../../backup", "all.json"), res);
              restoreData(JSON.parse(decrypted), res);
            }
          });
        }
      });
    } else {
      res.send({ success: false, message: "token validation failed" });
    }
  });
}

function check(req, res) {
  validate.admin(req.params.loginuser, req.params.token, (err, pass) => {
    if (err) {
      res.send({ success: false, message: err });
    } else if (pass) {
      const infoPath = path.join(dir, "info.txt");
      const content = fs.readFileSync(infoPath, "utf8");
      res.send({ success: true, content });
    } else {
      res.send({ success: false, message: "token validation failed" });
    }
  });
}

function clear(req, res) {
  Employee.remove(c.conditions.all(), err => {
    if (err) {
      res.send({ success: false, message: err });
    } else {
      res.send({
        success: true,
        message: "all employees deleted successfully"
      });
    }
  });
}

function restoreData(employees, res) {
  const item = employees.pop();
  if (item) {
    new Employee(
      Object.assign({}, item, {
        password: item.username.toLocaleLowerCase()
      })
    ).save(err => {
      if (err) {
        res.send({ success: false, message: err });
      } else {
        restoreData(employees, res);
      }
    });
  } else {
    res.send({ success: true, message: "restored successfully" });
  }
}
