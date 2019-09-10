const {
  workday,
  holiday,
  winterMonday,
  summerMonday
} = require("../../models/config/period");
const { align, border, fontColor } = require("./styles/const");
const { isStringValue } = require("./condition/general");
const { transformHolidaysRaw, getHolidayTitle } = require("./util/holiday");
const {
  setBorder,
  setTextAlign,
  setFontColor,
  setWrapText
} = require("./util/style");
const {
  initSheet,
  initCell,
  initColumn,
  setColumnWidth,
  initRow,
  setRowHeight,
  mergeCells
} = require("./util/xlsx-populate");
let holidays = [];

module.exports = {
  produce
};

function produce(workbook, employees, { year, month, sheetName }) {
  holidays = transformHolidaysRaw(require(`./holidays/${year}`));
  const sheet = initSheet(workbook, sheetName);
  const filteredEmployees = filterEmployees(employees);
  const columns = ["B", "C", "D", "E", "F", "G", "H"];
  const titles = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayparts = ["早", "中", "日"];
  const sourceMap = [titles];
  getDaysGroupByWeek(year, month).forEach(days => {
    sourceMap.push(
      days.map(day => ({
        type: "day",
        content: day
      }))
    );
    dayparts.forEach(daypart => {
      sourceMap.push(
        days.map(day => ({
          type: "shift",
          content: getShifters(
            filteredEmployees,
            new Date(year, month - 1, day),
            daypart
          )
        }))
      );
    });
  });
  sourceMap.forEach((r, ri) => {
    columns.forEach((c, ci) => {
      const data = r[ci];
      const cell = initCell(sheet, c, ri + 1);
      setBorder(cell, border.top.style, border.style.thin);
      setBorder(cell, border.bottom.style, border.style.thin);
      setBorder(cell, border.left.style, border.style.thin);
      setBorder(cell, border.right.style, border.style.thin);
      setWrapText(cell);
      const column = initColumn(sheet, c);
      setColumnWidth(column, 13);
      if (isStringValue(data)) {
        cell.value(data);
      } else {
        if (data.type === "shift" && data.content) {
          setTextAlign(cell, align.direction.vertical, align.center);
          setTextAlign(cell, align.direction.horizontal, align.left);
          const row = initRow(sheet, ri + 1);
          setRowHeight(row, 30);
          cell.value(data.content);
        } else if (data.type === "day") {
          setFontColor(cell, fontColor.white);
          cell.style("fill", { type: "solid", color: fontColor.black });
          setBorder(cell, border.top.style, border.style.thick);
          setBorder(cell, border.bottom.style, border.style.thick);
          const title = getHolidayTitle(
            holidays,
            new Date(year, month - 1, data.content)
          );
          cell.value(data.content + (title ? `(${title})` : ""));
        }
      }
    });
  });
  const firstColumns = [
    `${year}-${month}`,
    "week 1",
    "早",
    "中",
    "日",
    "week 2",
    "早",
    "中",
    "日",
    "week 3",
    "早",
    "中",
    "日",
    "week 4",
    "早",
    "中",
    "日",
    "week 5",
    "早",
    "中",
    "日"
  ];
  Array.apply(null, { length: sourceMap.length }).forEach((value, index) => {
    const cell = initCell(sheet, "A", index + 1);
    setBorder(cell, border.top.style, border.style.thin);
    setBorder(cell, border.bottom.style, border.style.thin);
    setBorder(cell, border.left.style, border.style.thin);
    setBorder(cell, border.right.style, border.style.thick);
    setWrapText(cell);
    cell.value(firstColumns[index]);
  });

  const startRowIndex = sourceMap.length + 2;
  const cellB1 = initCell(sheet, "B", startRowIndex);
  cellB1.value("時間段說明");
  mergeCells(cellB1, initCell(sheet, "E", startRowIndex));

  const cellC2 = initCell(sheet, "C", startRowIndex + 1);
  cellC2.value("早");
  const cellD2 = initCell(sheet, "D", startRowIndex + 1);
  cellD2.value("中");
  const cellE2 = initCell(sheet, "E", startRowIndex + 1);
  cellE2.value("日");

  const cellB3 = initCell(sheet, "B", startRowIndex + 2);
  cellB3.value(workday.name);
  const cellC3 = initCell(sheet, "C", startRowIndex + 2);
  cellC3.value(`${workday.morning.startFrom}~${workday.morning.endTo}`);
  const cellD3 = initCell(sheet, "D", startRowIndex + 2);
  cellD3.value(`${workday.noon.startFrom}~${workday.noon.endTo}`);
  const cellE3 = initCell(sheet, "E", startRowIndex + 2);
  cellE3.value(`${workday.general.startFrom}~${workday.general.endTo}`);

  const cellB4 = initCell(sheet, "B", startRowIndex + 3);
  cellB4.value(holiday.name);
  const cellC4 = initCell(sheet, "C", startRowIndex + 3);
  cellC4.value(`${holiday.morning.startFrom}~${holiday.morning.endTo}`);
  const cellD4 = initCell(sheet, "D", startRowIndex + 3);
  cellD4.value(`${holiday.noon.startFrom}~${holiday.noon.endTo}`);
  const cellE4 = initCell(sheet, "E", startRowIndex + 3);
  cellE4.value(`${holiday.general.startFrom}~${holiday.general.endTo}`);

  const cellB5 = initCell(sheet, "B", startRowIndex + 4);
  cellB5.value("備註");
  mergeCells(cellB5, initCell(sheet, "D", startRowIndex + 4));

  const cellB6 = initCell(sheet, "B", startRowIndex + 5);
  cellB6.value(summerMonday.name);
  mergeCells(cellB6, initCell(sheet, "C", startRowIndex + 5));
  const cellD6 = initCell(sheet, "D", startRowIndex + 5);
  cellD6.value(summerMonday.morning.name);
  const cellE6 = initCell(sheet, "E", startRowIndex + 5);
  cellE6.value(
    `${summerMonday.morning.startFrom}~${summerMonday.morning.endTo}`
  );

  const cellB7 = initCell(sheet, "B", startRowIndex + 6);
  cellB7.value(winterMonday.name);
  mergeCells(cellB7, initCell(sheet, "C", startRowIndex + 6));
  const cellD7 = initCell(sheet, "D", startRowIndex + 6);
  cellD7.value(winterMonday.morning.name);
  const cellE7 = initCell(sheet, "E", startRowIndex + 6);
  cellE7.value(
    `${winterMonday.morning.startFrom}~${winterMonday.morning.endTo}`
  );

  return workbook;
}

function filterEmployees(employees) {
  return employees.filter(e => e.dept === "客服部(C)");
}

function getDaysGroupByWeek(year, month) {
  const firstDate = new Date(year, month - 1, 1);
  const firstDateWeekday = firstDate.getDay();
  const lastDate = new Date(year, month, 0);
  const lastDateWeekday = lastDate.getDay();
  const maxDays = lastDate.getDate();
  const result = [[]];
  Array.apply(null, { length: firstDateWeekday }).forEach(() =>
    result[0].push("")
  );
  let rowIndex = 0;
  Array.apply(null, { length: maxDays }).forEach((_, index) => {
    if (result[rowIndex].length === 7) {
      rowIndex++;
      result[rowIndex] = [];
    }
    result[rowIndex].push(index + 1);
  });
  Array.apply(null, { length: 6 - lastDateWeekday }).forEach(() =>
    result[rowIndex].push("")
  );
  return result;
}

function getShifters(employees, date, daypart) {
  const matchedShifts = [];
  employees.forEach(e => {
    const shift = e.shifts.find(
      s =>
        new Date(s.date).toDateString() === date.toDateString() &&
        s.daypart === daypart
    );
    if (shift) {
      matchedShifts.push({
        primary: shift.primary,
        username: e.username
      });
    }
  });

  const result = matchedShifts.map(x =>
    matchedShifts.length > 1 && x.primary ? `${x.username}(主)` : x.username
  );

  return result.join("\n");
}
