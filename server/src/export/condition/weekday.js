module.exports = {
  isSunday: date => date.getDay() === week.sunday,
  isMonday: date => date.getDay() === week.monday,
  isTuesday: date => date.getDay() === week.tuesday,
  isWednesday: date => date.getDay() === week.wednesday,
  isThursday: date => date.getDay() === week.thursday,
  isFriday: date => date.getDay() === week.friday,
  isSaturday: date => date.getDay() === week.saturday
};

const week = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};
