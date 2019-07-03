const headers = require("./headers/compensatory");
const { align, border } = require("./styles/const");
const {
  isEmployeeInfoArea,
  isMonthReportArea,
  isLTReportArea,
  isLastEmployee
} = require("./condition/general");
const { sumUpTotalsList } = require("./util/general");
const { setBorder, setTextAlign } = require("./util/style");
const { initSheet, init } = require("./util/xlsx-populate");

module.exports = {
  produce
};

function produce(workbook, employees, { year, sheetName }) {
  const sheet = initSheet(workbook, sheetName);
  const filteredEmployees = filterEmployees(employees, year).map(e => {
    e.leaveTypes = filterLeaveTypes(e.leaveTypes, year);
    return e;
  });
  // Head
  headers.forEach(({ area, styles, width, height, dataKey, title, name }) => {
    const rowNumber = 1;
    const { cell } = init(sheet, name, rowNumber, {
      area,
      styles,
      width,
      height
    });
    setBorder(cell, border.bottom.style, border.style.thick);
    if (isMonthReportArea(area, dataKey.month)) {
      setTextAlign(cell, align.direction.vertical, align.bottom);
    }
    const cellValue = title;
    cell.value(cellValue);
  });

  // Body
  filteredEmployees.forEach((e, index) => {
    const rowNumber = index + 1 + 1;
    headers.forEach(({ area, styles, width, height, dataKey, name }) => {
      const { cell, column } = init(sheet, name, rowNumber, {
        area,
        styles,
        width,
        height
      });
      if (isLastEmployee(filteredEmployees.length, index)) {
        setBorder(cell, border.bottom.style, border.style.double);
      }
      if (isEmployeeInfoArea(area)) {
        cell.value(e[dataKey]);
      } else if (isMonthReportArea(area, dataKey.month)) {
        column.width(20);
        const month = dataKey.month;
        const group = e.leaveTypes.filter(
          lt => new Date(lt.date).getMonth() === month
        );
        if (group && group.length > 0) {
          const text = group
            .map(x =>
              totalsToString(
                {
                  days: x.daysNHours.totalDays,
                  hours: x.daysNHours.totalHours
                },
                x.leaveType
              )
            )
            .join("\n");
          cell.value(text);
        }
      } else if (isLTReportArea(area, dataKey.leaveType)) {
        column.width(14);
        const leaveType = dataKey.leaveType;
        const compensatory = "compensatory";
        if (leaveType === compensatory) {
          const text = totalsToString(
            sumUpTotalsList(
              e.leaveTypes.map(x => {
                return {
                  days: x.daysNHours.totalDays,
                  hours: x.daysNHours.totalHours
                };
              })
            )
          );
          cell.value(text);
        }
      }
    });
  });

  return workbook;
}

function filterLeaveTypes(leaveTypes, year) {
  return leaveTypes.filter(lt => new Date(lt.date).getFullYear() === year);
}

function filterEmployees(employees, year) {
  return employees
    .filter(e => e.enabled)
    .filter(e =>
      e.leaveTypes.some(lt => new Date(lt.date).getFullYear() === year)
    );
}

function totalsToString({ days, hours }, leaveType = "") {
  return (
    leaveType.replace("補休-", "") +
    (days > 0 ? (leaveType ? "(1天)" : `${days}天`) : "") +
    (hours > 0 ? `(${hours}H)` : "")
  );
}
