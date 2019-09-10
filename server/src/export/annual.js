const XlsxPopulate = require("xlsx-populate");
const RichText = XlsxPopulate.RichText;
const headers = require("./headers/annual");
const { align, border } = require("./styles/const");
const { isSunday } = require("./condition/weekday");
const {
  isDeadlineExpired,
  isStringFormat,
  isEmployeeInfoArea,
  isDayReportArea,
  isMonthReportArea,
  isLTReportArea,
  isAnnualInfoArea,
  isLastEmployee,
  isOverMaxDayOfMonth,
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
  comparer,
  rewriteIfEmployeeWorkUnderHalfYear,
  totalsToString
} = require("./util/leave-type");
const {
  setBorder,
  hideColumn,
  setTextAlign,
  setRichTextFontColor,
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

module.exports = {
  produce
};

function produce(workbook, employees, { year, month, sheetName }) {
  const sheet = initSheet(workbook, sheetName);
  const filteredEmployees = filterEmployees(employees);
  initSheetTitle(sheet, sheetName, headers);
  const firstRowNumber = 2;
  const lastRowNumber = filteredEmployees.length + firstRowNumber + 1;
  // Head
  headers.forEach(
    ({ area, styles, width, height, merged, dataKey, title, name }) => {
      const rowNumber = firstRowNumber;
      const { cell } = init(sheet, name, rowNumber, {
        area,
        styles,
        width,
        height
      });
      setBorder(cell, border.bottom.style, border.style.thick);
      if (isEmployeeInfoArea(area)) {
        if (dataKey === "arrivedDate") {
          setNoBorder(cell);
        }
      } else if (isMonthReportArea(area, dataKey.month)) {
        setTextAlign(cell, align.direction.vertical, align.bottom);
      } else if (isAnnualInfoArea(area, dataKey.index)) {
        setNoBorder(cell);
      }
      if (merged) {
        mergeCells(cell, initCell(sheet, merged, rowNumber));
      }
      const cellValue = isStringFormat(title)
        ? stringFormat(
            title.format,
            `${year + dataKey.index - 1}-${year + dataKey.index}`
          )
        : title;
      cell.value(cellValue);
    }
  );

  const ltTotalsMap = {};
  // Body
  filteredEmployees.forEach((e, index) => {
    const rowNumber = index + firstRowNumber + 1;
    headers.forEach(({ area, styles, width, height, dataKey, name }) => {
      const { cell } = init(sheet, name, rowNumber, {
        area,
        styles,
        width,
        height
      });
      if (isLastEmployee(filteredEmployees.length, index)) {
        setBorder(cell, border.bottom.style, border.style.double);
        if (dataKey === "arrivedDate") {
          setNoBorder(cell);
        }
      }
      if (isEmployeeInfoArea(area)) {
        cell.value(e[dataKey]);
      } else if (isMonthReportArea(area, dataKey.month)) {
        const month = dataKey.month;
        const group = e.recordGroups.find(g => g.month === month);
        cell.value(new RichText());
        const richText = cell.value();
        if (group && group.list.length > 0) {
          group.list.sort(comparer).forEach(x => {
            const fontColor = findFontColor(headers, x.key);
            const value = totalsToString(x.totals, x.key) + "\n";
            setRichTextFontColor(richText, value, fontColor);
          });
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
              groups.map(g => sumUpTotalsList(g.list.map(x => x.totals)))
            );
            finalTotals = totalsRemap(finalTotals, unit);
            updateLTTotalsMap(ltTotalsMap, finalTotals, compensatory, unit);
            cell.value(totalsToString(totalsRemap(finalTotals, unit)));
          }
        } else {
          const group = e.leaveTypeGroups.find(({ key }) => key === leaveType);
          if (group) {
            let finalTotals = {};
            if (unit) {
              finalTotals = sumUpTotalsList(group.list.map(x => x.totals));
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
        setBorder(cell, border.top.style, undefined);
        setBorder(cell, border.bottom.style, undefined);
        setBorder(cell, border.left.style, undefined);
        setBorder(cell, border.right.style, undefined);
        const type = dataKey.type;
        const deadlineThisYear = year + e.arrivedDate.substr(4);
        const deadlineDateThisYear = new Date(deadlineThisYear);
        const index = isDeadlineExpired(deadlineDateThisYear) ? 1 : 0;
        const { totalDays, totals, deadline } = e.annualInfo[index];
        if (type === "remaining") {
          const remainingTotals = { days: totalDays - totals.days };
          const remainingStr = totalsToString(remainingTotals);
          cell.value((remainingStr ? remainingStr : "0天") + `/${totalDays}`);
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
    setNoBorder(cell);
    if (isLTReportArea(area, dataKey.leaveType)) {
      setTextAlign(cell, align.direction.horizontal, align.center);
      setTextAlign(cell, align.direction.vertical, align.center);
      const leaveType = dataKey.leaveType;
      const unit = dataKey.unit;
      const key = unit ? `${leaveType}.${unit}` : leaveType;
      cell.value(totalsToString(sumUpTotalsList(ltTotalsMap[key])));
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
