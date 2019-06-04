const globalStyles = require("../styles/global");
const areaStyles = require("../styles/area");

module.exports = {
  initSheet,
  init,
  initColumn,
  initRow,
  initCell,
  constructGlobal,
  constructArea,
  construct,
  setAreaColumnWidth,
  setAreaRowHeight,
  setAreaStyles,
  setColumnWidth,
  setRowHeight,
  setStyles,
  mergeCells
};

function initSheet(workbook, name) {
  const sheet = workbook.addSheet(name);
  workbook.deleteSheet("Sheet1");
  return sheet;
}

function init(sheet, columnName, rowNumber, { area, styles, width, height }) {
  const column = initColumn(sheet, columnName);
  const row = initRow(sheet, rowNumber);
  const cell = initCell(sheet, columnName, rowNumber);
  constructGlobal(column, row, cell);
  if (area) {
    constructArea(column, row, cell, area);
  }
  construct(column, row, cell, { styles, width, height });
  return { column, row, cell };
}

function initColumn(sheet, columnName) {
  return sheet.column(columnName);
}

function initRow(sheet, rowNumber) {
  return sheet.row(rowNumber);
}

function initCell(sheet, columnName, rowNumber = 1, area) {
  return sheet.cell(`${columnName}${rowNumber}`);
}

function constructGlobal(column, row, cell) {
  setStyles(cell, globalStyles.styles);
  setColumnWidth(column, globalStyles.width);
  setRowHeight(row, globalStyles.height);
}

function constructArea(column, row, cell, area) {
  setAreaStyles(cell, area);
  setAreaColumnWidth(column, area);
  setAreaRowHeight(row, area);
}

function construct(column, row, cell, { styles, width, height }) {
  setStyles(cell, styles);
  setColumnWidth(column, width);
  setRowHeight(row, height);
}

function setAreaColumnWidth(column, area) {
  if (area) {
    setColumnWidth(column, areaStyles[area].width);
  }
}

function setAreaRowHeight(row, area) {
  if (area) {
    setRowHeight(row, areaStyles[area].height);
  }
}

function setAreaStyles(cell, area) {
  if (area) {
    setStyles(cell, areaStyles[area].styles);
  }
}

function setColumnWidth(column, width) {
  if (width) {
    column.width(width);
  }
}

function setRowHeight(row, height) {
  if (height) {
    row.height(height);
  }
}

function setStyles(cell, styles) {
  if (styles) {
    styles.forEach(style => cell.style(style.name, style.value));
  }
}

function mergeCells(fromCell, toCell) {
  const range = fromCell.rangeTo(toCell);
  range.merged(toCell);
}
