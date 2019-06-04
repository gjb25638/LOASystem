const Employee = require("../../models/employee");
const c = require("../shared/collection");
const { transformHolidaysRaw } = require("../export/util/holiday");

module.exports = {
  get
};

function get(req, res) {
  Employee.findOne(
    c.conditions.validLoginuser(req.params.loginuser, req.params.token),
    (err, loginuser) => {
      if (err) {
        res.send({ success: false, message: err });
      } else if (loginuser) {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        let holidays = [];
        try {
          holidays = transformHolidaysRaw(
            require(`../export/holidays/${year}`)
          ).filter(x => x.date.getMonth() === month - 1);
        } catch (err) {}
        res.send({ holidays });
      } else {
        res.send({ success: false, message: "login user is not found" });
      }
    }
  );
}
