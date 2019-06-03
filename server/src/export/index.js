const XlsxPopulate = require("xlsx-populate");
const annual = require("./annual");
const monthly = require("./monthly");

module.exports = {
  populate
};

function populate({ year, month }, employees, cb) {
  const { fileName, sheetName, produce } = getNames({ year, month });
  XlsxPopulate.fromBlankAsync()
    .then(workbook =>
      produce(workbook, employees, {
        year,
        month,
        sheetName
      }).outputAsync()
    )
    .then(data => cb(data, fileName));
}

function getNames({ year, month }) {
  if (month) {
    return {
      fileName: `${year}年${month}月考勤表.xlsx`,
      sheetName: `${year}-${month}考勤總表`,
      produce: monthly.produce
    };
  } else {
    return {
      fileName: `${year}年度考勤表.xlsx`,
      sheetName: `${year}總表`,
      produce: annual.produce
    };
  }
}
