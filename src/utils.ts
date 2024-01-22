import { publicHolidays } from "./values";

const bankHolidaysISOString = publicHolidays.map((date) => date.toISOString());

export function countWorkingDays(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  let count = 0;

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (
      currentDate.getDay() !== 0 &&
      currentDate.getDay() !== 6 &&
      !bankHolidaysISOString.includes(currentDate.toISOString())
    ) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}

export const calcPercentage = (holidayPay: number, workday: number): string => {
  const value = (100 * holidayPay) / workday - 100;
  if (value > 0) return "+" + value.toFixed(2);
  return value.toFixed(2);
};

export const calcWorkPayPerDay = (baseSalary: number, date: Date): number => {
  const workingDays = countWorkingDays(date);
  return baseSalary / workingDays;
};

export const calcPayHolidayPerDay = (
  baseSalary: number,
  date: Date
): number => {
  const workingDays = [...Array(3).keys()]
    .map((_, index) => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() - index - 1);
      return newDate;
    })
    .map((date) => countWorkingDays(date))
    .reduce((out, days) => out + days, 0);

  return (baseSalary * 3) / workingDays;
};

export function getMonthNameFromDate(date: Date, locale: string): string {
  const options: Intl.DateTimeFormatOptions = { month: "long" };
  const monthName: string = date.toLocaleString(locale, options);
  return monthName;
}
