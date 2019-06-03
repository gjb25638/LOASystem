const { fontColor } = require("../styles/const");

module.exports = {
  setHolidayStyle,
  transformHolidaysRaw,
  getHolidayTitle
};

function setHolidayStyle(cell) {
  cell.style("fill", { type: "solid", color: fontColor.grey });
}

function transformHolidaysRaw(holidaysRaw) {
  let year;
  const holidays = holidaysRaw.map(holidayRaw => {
    const date = new Date(holidayRaw["Start Date"].replace("\\/", "-"));
    year = date.getFullYear();
    return {
      title: holidayRaw["Subject"],
      date,
      weekday: date.getDay()
    };
  });
  holidays.push({
    title: "勞動節",
    date: new Date(year, 4, 1),
    weekday: new Date(year, 4, 1).getDay()
  });
  return holidays;
}

function getHolidayTitle(holidays, date) {
  const holiday = holidays.find(hd => hd.date.getTime() === date.getTime());
  return holiday ? holiday.title : "";
}
