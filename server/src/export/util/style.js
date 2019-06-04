const leaveTypeUtil = require("./leave-type");
const { align, border } = require("../styles/const");

module.exports = {
  setBorder,
  hideColumn,
  setTextAlign,
  setRichTextFontColor,
  findStyle,
  findFontColor,
  setFontColor,
  setWrapText,
  setNoBorder
};

function setBorder(cell, name, value) {
  cell.style(name, value);
}

function hideColumn(column) {
  column.hidden(true);
}

function setTextAlign(cell, direction, align) {
  cell.style(direction, align);
}

function setRichTextFontColor(richText, value, fontColor) {
  richText.add(value, { fontColor });
}

function setFontColor(cell, fontColor) {
  cell.style("fontColor", fontColor);
}

function findStyle(styles, styleName) {
  if (styles) {
    return styles.find(style => style.name === styleName);
  }
}

function findFontColor(headers, leaveType) {
  const header = leaveTypeUtil.findLTHeader(headers, leaveType);
  const fontColorStyle = header
    ? findStyle(header.styles, "fontColor")
    : undefined;
  return fontColorStyle ? fontColorStyle.value : undefined;
}

function setWrapText(cell) {
  cell.style("wrapText", true);
}

function setNoBorder(cell) {
  setBorder(cell, border.top.style, undefined);
  setBorder(cell, border.bottom.style, undefined);
  setBorder(cell, border.left.style, undefined);
  setBorder(cell, border.right.style, undefined);
}
