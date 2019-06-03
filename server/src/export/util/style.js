const leaveTypeUtil = require("./leave-type");

module.exports = {
  setBorder,
  hideColumn,
  setTextAlign,
  setRichTextFontColor,
  findStyle,
  findFontColor,
  setFontColor
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
