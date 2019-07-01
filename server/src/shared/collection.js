function hasSignerOfRecordSigned(record, employee) {
  return record.signings.some(signing => signing.id === employee.id);
}
function haveSignersOfRecordAllSigned(record) {
  return record.signers.every(signer =>
    record.signings.some(signing => signing.id === signer.id)
  );
}
function isRecordSignedReject(record) {
  return record.signings.some(signing => !signing.pass);
}

module.exports = {
  conditions: {
    validLoginuser: (loginusername, token) => {
      return {
        username: new RegExp(`^${loginusername}$`, "i"),
        password: token
      };
    },
    employee: employee => {
      return {
        username: new RegExp(`^${employee}$`, "i")
      };
    },
    all: () => {
      return {
        username: { $ne: "admin" }
      };
    },
    administrator: (loginusername, token) => {
      return {
        username: new RegExp(`^${loginusername}$`, "i"),
        password: token,
        level: "admin"
      };
    },
    manager: (loginusername, token) => {
      return {
        username: new RegExp(`^${loginusername}$`, "i"),
        password: token,
        level: "manager"
      };
    },
    underControl: employeeUsername => {
      return { signers: { $elemMatch: { username: employeeUsername } } };
    }
  },
  predicate: {
    /**
     * if `loginuser` is
     * 1. `administrator` => control all employees
     * 2. `employee` => control self
     * 3. `included in the signers of employee` => control the employees who needs `loginuser` to sign
     */
    isEmployeeUnderLoginuserControl: (
      loginuser,
      employee,
      self = true,
      sdehsra = false
    ) => {
      return (
        loginuser.level === "admin" ||
        (sdehsra && loginuser.dept === employee.dept) ||
        (self && loginuser._id.toString() === employee._id.toString()) ||
        employee.signers.some(signer => signer.id === loginuser._id.toString())
      );
    },
    isAdministrator: employee => employee.level === "admin",
    isRecordSignedReject,
    haveSignersOfRecordAllSigned,
    hasSignerOfRecordSigned,
    /**
     * - check
     *   1. all signers of the record have signed
     *   2. all signings are `pass`
     * - notice
     *   - `no signings` equals to `signing pass`, e.g. administrator
     */
    isRecordAllSignedPass: record => {
      // every signer in [signers] is inside [signings]
      const allSignersOfTheRecordHaveSigned = haveSignersOfRecordAllSigned(
        record
      );
      return record.signers.length > 0
        ? allSignersOfTheRecordHaveSigned &&
            record.signings.every(signing => signing.pass)
        : true;
    },
    isCompensatoryLeaveType: leaveType => {
      return leaveType.enabled && leaveType.name.startsWith("補休");
    },
    isCompensatoryRecord: record => {
      return record.leaveType.startsWith("補休");
    },
    isLeaveTypeNoMoreLeaves: leaveType => {
      return (
        leaveType.totals.days === leaveType.consumes.days &&
        (!leaveType.totals.halfHours ||
          leaveType.totals.halfHours === leaveType.consumes.halfHours)
      );
    }
  }
};
