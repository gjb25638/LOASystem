const XlsxPopulate = require("xlsx-populate");
const RichText = XlsxPopulate.RichText;
const headers = require("./headers/monthly");
const { align, border, fontColor } = require("./styles/const");
const { isSunday, isMonday, isSaturday } = require("./condition/weekday");
const {
  isDeadlineExpired,
  isStringFormat,
  isEmployeeInfoArea,
  isDayReportArea,
  isLTReportArea,
  isAnnualInfoArea,
  isLastEmployee,
  isOverMaxDayOfMonth,
  isHoliday,
  isMakeUpWorkday,
  isEmployeeWorkingShifts,
  isCompensatoryLT
} = require("./condition/general");
const {
  stringFormat,
  getChineseWeekday,
  filterEmployees,
  totalsRemap,
  sumUpTotalsList
} = require("./util/general");
const {
  setHolidayStyle,
  transformHolidaysRaw,
  getHolidayTitle
} = require("./util/holiday");
const {
  comparer,
  rewriteIfEmployeeWorkUnderHalfYear,
  totalsToString
} = require("./util/leave-type");
const {
  setBorder,
  hideColumn,
  setTextAlign,
  setRichTextFontColor,
  setFontColor,
  findFontColor,
  setNoBorder
} = require("./util/style");
const {
  initSheet,
  init,
  initCell,
  mergeCells,
  initSheetTitle
} = require("./util/xlsx-populate");
let holidays = [];

module.exports = {
  produce
};

function produce(workbook, employees, { year, month, sheetName }) {
  holidays = transformHolidaysRaw(require(`./holidays/${year}`));
  const sheet = initSheet(workbook, sheetName);
  const filteredEmployees = filterEmployees(employees);
  initSheetTitle(sheet, sheetName, headers);
  const firstRowNumber = 2;
  const lastRowNumber = filteredEmployees.length + firstRowNumber + 1;
  // Head
  headers.forEach(
    ({ area, styles, width, height, merged, dataKey, title, name }) => {
      const rowNumber = firstRowNumber;
      const { column, cell } = init(sheet, name, rowNumber, {
        area,
        styles,
        width,
        height
      });
      let chineseWeekday;
      setBorder(cell, border.bottom.style, border.style.thick);
      if (isEmployeeInfoArea(area)) {
        if (dataKey === "arrivedDate") {
          setNoBorder(cell);
        }
      } else if (isDayReportArea(area, dataKey.day)) {
        setTextAlign(cell, align.direction.vertical, align.bottom);
        const day = dataKey.day + 1;
        const date = new Date(year, month - 1, day);
        chineseWeekday = getChineseWeekday(year, month, day);
        if (isOverMaxDayOfMonth(year, month, day) || isSunday(date)) {
          hideColumn(column);
        }
      } else if (isAnnualInfoArea(area, dataKey.index)) {
        setNoBorder(cell);
      }
      if (merged) {
        mergeCells(cell, initCell(sheet, merged, rowNumber));
      }
      const cellValue = isStringFormat(title)
        ? stringFormat(title.format, month, chineseWeekday)
        : title;
      cell.value(cellValue);
    }
  );

  const ltTotalsMap = {};
  const absencesMap = [];
  // Body
  filteredEmployees.forEach((e, index) => {
    const rowNumber = index + firstRowNumber + 1;
    headers.forEach(({ area, styles, width, height, dataKey, name }) => {
      const { column, cell } = init(sheet, name, rowNumber, {
        area,
        styles,
        width,
        height
      });
      if (isLastEmployee(filteredEmployees.length, index)) {
        if (
          isAnnualInfoArea(area, dataKey.index) ||
          dataKey === "arrivedDate"
        ) {
          setNoBorder(cell);
        } else {
          setBorder(cell, border.bottom.style, border.style.double);
        }
      }
      if (isEmployeeInfoArea(area)) {
        cell.value(e[dataKey]);
      } else if (isDayReportArea(area, dataKey.day)) {
        const dayIndex = dataKey.day;
        const day = dataKey.day + 1;
        const date = new Date(year, month - 1, day);
        if (isMonday(date)) {
          setBorder(cell, border.left.style, border.style.thick);
        }
        if (
          !isEmployeeWorkingShifts(e) &&
          isHoliday(date, holidays) &&
          !isMakeUpWorkday(date, holidays)
        ) {
          setHolidayStyle(cell);
          if (isSaturday(date)) {
            hideColumn(column);
          }
        }
        const group = e.recordGroups.find(g => g.day === dayIndex);
        if (group && group.list.length > 0) {
          cell.value(new RichText());
          const richText = cell.value();
          group.list.sort(comparer).forEach(x => {
            const fontColor = findFontColor(headers, x.key);
            const value = totalsToString(x.totals, x.key) + "\n";
            setRichTextFontColor(richText, value, fontColor);
          });
          updateAbsencesMap(absencesMap, dayIndex);
        }
      } else if (isLTReportArea(area, dataKey.leaveType)) {
        const leaveType = dataKey.leaveType;
        const unit = dataKey.unit;
        const compensatory = "compensatory";
        if (leaveType === compensatory) {
          const groups = e.leaveTypeGroups.filter(({ key }) =>
            isCompensatoryLT(key)
          );
          if (groups && groups.length > 0) {
            let finalTotals = sumUpTotalsList(
              groups.map(g => sumUpTotalsList(g.list.map(x => x.totals))),
              unit
            );
            finalTotals = totalsRemap(finalTotals, unit);
            updateLTTotalsMap(ltTotalsMap, finalTotals, compensatory, unit);
            cell.value(totalsToString(finalTotals));
          }
        } else {
          const group = e.leaveTypeGroups.find(({ key }) => key === leaveType);
          if (group) {
            let finalTotals = {};
            if (unit) {
              finalTotals = sumUpTotalsList(
                group.list.map(x => x.totals),
                unit
              );
              finalTotals = totalsRemap(finalTotals, unit);
              updateLTTotalsMap(ltTotalsMap, finalTotals, group.key, unit);
            } else {
              finalTotals = sumUpTotalsList(group.list.map(x => x.totals));
              updateLTTotalsMap(ltTotalsMap, finalTotals, group.key);
            }
            cell.value(totalsToString(finalTotals));
          }
        }
      } else if (isAnnualInfoArea(area, dataKey.index)) {
        const type = dataKey.type;
        const deadlineThisYear = year + e.arrivedDate.substr(4);
        const deadlineDateThisYear = new Date(deadlineThisYear);
        const index = isDeadlineExpired(deadlineDateThisYear) ? 1 : 0;
        const { totalDays, totals, deadline } = e.annualInfo[index];
        if (type === "remaining") {
          const remainingTotals = { days: totalDays - totals.days };
          const remainingStr = totalsToString(remainingTotals);
          cell.value(
            (remainingStr ? remainingStr : "0天") + `/${e.actualTotalDays}`
          );
          rewriteIfEmployeeWorkUnderHalfYear(cell, e.arrivedDate);
        } else if (type === "deadline") {
          cell.value(`${deadline.substr(5, 4)}${e.arrivedDate.substr(4)}`);
        }
      }
    });
  });

  // Foot
  headers.forEach(({ name, area, styles, width, height, dataKey }) => {
    const { cell } = init(sheet, name, lastRowNumber, {
      area,
      styles,
      width,
      height
    });
    setBorder(cell, border.bottom.style, border.style.thick);
    setTextAlign(cell, align.direction.horizontal, align.center);
    setTextAlign(cell, align.direction.vertical, align.center);
    if (isEmployeeInfoArea(area)) {
      if (dataKey === "arrivedDate") {
        setNoBorder(cell);
      }
      if (name == "B") {
        cell.value("休假/公出人數");
        setTextAlign(cell, align.direction.horizontal, align.right);
        mergeCells(cell, initCell(sheet, "C", lastRowNumber));
      }
    } else if (isDayReportArea(area, dataKey.day)) {
      const dayIndex = dataKey.day;
      const day = dataKey.day + 1;
      const date = new Date(year, month - 1, day);
      const holidayTitle = getHolidayTitle(holidays, date);
      if (holidayTitle) {
        setFontColor(cell, fontColor.red);
        cell.value(holidayTitle);
      } else {
        const amount = absencesMap[dayIndex];
        cell.value(amount ? `${amount}人` : "");
      }
    } else if (isLTReportArea(area, dataKey.leaveType)) {
      const leaveType = dataKey.leaveType;
      const unit = dataKey.unit;
      const key = unit ? `${leaveType}.${unit}` : leaveType;
      cell.value(totalsToString(sumUpTotalsList(ltTotalsMap[key])));
    } else if (isAnnualInfoArea(area, dataKey.index)) {
      setNoBorder(cell);
    }
  });
  return workbook;
}

function updateLTTotalsMap(ltTotalsMap, totals, ltName, unit) {
  const key = ltName + (unit ? `.${unit}` : "");
  if (ltTotalsMap[key]) {
    ltTotalsMap[key].push(totals);
  } else {
    ltTotalsMap[key] = [totals];
  }
}

function updateAbsencesMap(absencesMap, day) {
  if (absencesMap[day]) {
    absencesMap[day]++;
  } else {
    absencesMap[day] = 1;
  }
}
