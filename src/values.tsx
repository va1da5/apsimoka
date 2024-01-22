import Holidays from "date-holidays";

function getDatesList(startDate: Date, endDate: Date) {
  let currentDate = new Date(startDate);
  const dateList = [];

  while (currentDate < endDate) {
    dateList.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateList;
}

const holidays = new Holidays("LT");
const now = new Date();

export const publicHolidays = [...Array(10).keys()]
  .map((_, index) => {
    const newDate = new Date(now);
    newDate.setFullYear(newDate.getFullYear() + index - 1);
    return newDate.getFullYear();
  })
  .map((year) => {
    return holidays
      .getHolidays(year)
      .filter((holiday) => holiday.type == "public")
      .map((holiday) => getDatesList(holiday.start, holiday.end));
  })
  .reduce((items, out) => {
    return [...items, ...out];
  }, [])
  .map((items) => items[0]);
