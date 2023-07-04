import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ArrowBigDown, ArrowBigUp, Info } from "lucide-react";
import { bankHolidays } from "./values";
import SalaryInput from "./components/salaryInput";
import MonthsInput from "./components/monthsInput";
import LanguageSelect from "./components/languageSelect";
import { lt, uk } from "date-fns/locale";
import { Trans, useTranslation } from "react-i18next";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./components/ui/hover-card";

const bankHolidaysISOString = bankHolidays.map((date) => date.toISOString());

function countWorkingDays(date: Date): number {
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

const calcPayHolidayPerDay = (baseSalary: number, date: Date): number => {
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

const calcWorkPayPerDay = (baseSalary: number, date: Date): number => {
  const workingDays = countWorkingDays(date);
  return baseSalary / workingDays;
};

const calcPercentage = (holidayPay: number, workday: number): string => {
  const value = (100 * holidayPay) / workday - 100;
  if (value > 0) return "+" + value.toFixed(2);
  return value.toFixed(2);
};

function App() {
  const now = new Date();
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState<string>("lt");
  const [numberOfMonths, setNumberOfMonth] = useState<number>(12);
  const [months, setMonths] = useState<Date[]>([]);
  const [salary, setSalary] = useState<number | undefined>(1000);
  const [holidayPayPerDay, setHolidayPayPerDay] = useState<number[] | []>([]);
  const [workPayPerDay, setWorkPayPerDay] = useState<number[] | []>([]);

  const calculateValues = () => {
    const dates = [...Array(numberOfMonths).keys()].map((_, index): Date => {
      const date = new Date();
      date.setMonth(date.getMonth() + index);
      return date;
    });

    setHolidayPayPerDay(
      dates.map((date) => calcPayHolidayPerDay(Number(salary), date))
    );

    setWorkPayPerDay(
      dates.map((date) => calcWorkPayPerDay(Number(salary), date))
    );

    setMonths(dates);
  };

  useEffect(() => {
    document.title = t("title");
  }, [locale]);

  useEffect(calculateValues, [salary, numberOfMonths]);

  return (
    <>
      <div className="flex justify-center">
        <div className="p-4 md:w-full lg:my-10 lg:w-2/4">
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-extrabold leading-none xl:text-5xl">
                {t("title")}
              </h1>
              <div className="my-4 xl:my-4">
                <p className="text-gray-700 xl:text-lg">
                  {t("toolDescription")}
                </p>
              </div>
            </div>
            <LanguageSelect
              defaultValue={locale}
              onValueChange={(locale) => {
                i18n.changeLanguage(locale);
                setLocale(locale);
              }}
            />
          </div>

          <div className="mt-6 lg:mt-12"></div>

          <div>
            <Trans i18nKey="description">
              Teisingai pasirinkus kurį mėnesį imti atostogas, galima gauti
              papildomą pinigų sumą prie savo atlyginimo. Atostoginiai už dieną
              paskaičiuojami pagal
              <a
                className="font-medium underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
                href="https://e-seimas.lrs.lt/portal/legalAct/lt/TAD/5a07b6715b4711e7a53b83ca0142260e#part_456997d804d943b88b1bcdb7f42d06a9"
              >
                paskutinių triejų mėnesių vidutinį užmokestį.
              </a>
            </Trans>
          </div>

          <div className="mt-10 flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-3">
              <SalaryInput value={salary as number} onChange={setSalary} />
              <MonthsInput value={numberOfMonths} onChange={setNumberOfMonth} />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-7 p-4">
            {months &&
              months.map((date, index) => (
                <div
                  key={date.toISOString()}
                  className="flex flex-col place-content-between lg:mb-6"
                >
                  {
                    <Calendar
                      key={date.toISOString()}
                      locale={{ lt, uk }[locale]}
                      disableNavigation
                      ISOWeek
                      mode="single"
                      defaultMonth={date}
                      modifiers={{ holiday: bankHolidays }}
                      modifiersClassNames={{
                        holiday: "text-red-600 font-bold bg-red-50",
                      }}
                      selected={now}
                    />
                  }

                  <div className="flex justify-between p-2">
                    <div className="flex w-full flex-col">
                      <div className="flex justify-between">
                        <div>
                          {holidayPayPerDay[index] > workPayPerDay[index] ? (
                            <ArrowBigUp
                              size={32}
                              className="inline pb-1 text-green-500"
                            />
                          ) : (
                            <ArrowBigDown
                              size={32}
                              className="inline pb-1 text-red-500"
                            />
                          )}
                          <span className="text-2xl font-bold">
                            {holidayPayPerDay[index] > workPayPerDay[index]
                              ? "+"
                              : ""}
                            {(
                              holidayPayPerDay[index] - workPayPerDay[index]
                            ).toFixed(2)}
                            {t("perDay")}
                          </span>
                        </div>
                        <div className="pr-3 pt-1">
                          <HoverCard>
                            <HoverCardTrigger>
                              <div className="text-muted-foreground hover:text-primary">
                                <Info size={16} />
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between">
                                  <span>{t("holidayPay")}</span>
                                  <span>
                                    {holidayPayPerDay[index]?.toFixed(2)}€
                                  </span>
                                </div>

                                <div className="flex justify-between">
                                  <span>{t("workPay")}</span>
                                  <span>
                                    {workPayPerDay[index]?.toFixed(2)}€
                                  </span>
                                </div>

                                <div className="flex justify-between">
                                  <span>{t("workDays")}</span>
                                  <span>{countWorkingDays(date)}</span>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </div>
                      <div className="ml-8 text-xs text-muted-foreground">
                        {calcPercentage(
                          holidayPayPerDay[index],
                          workPayPerDay[index]
                        )}
                        {t("payPercentageDifference")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
