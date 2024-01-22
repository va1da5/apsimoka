import { useEffect, useState } from "react";
import SalaryInput from "@/components/salaryInput";
import MonthsInput from "@/components/monthsInput";
import LanguageSelect from "@/components/languageSelect";
import { Trans, useTranslation } from "react-i18next";
import { calcPayHolidayPerDay, calcWorkPayPerDay } from "./utils";
import CalendarItem from "@/components/calendarItem";
import Overview from "@/components/overview";

function App() {
  const now = new Date();
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState<string>("lt");
  const [numberOfMonths, setNumberOfMonth] = useState<number>(24);
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

          <div className="mt-12 w-full h-[200px]">
            <Overview
              months={months}
              holidayPayPerDay={holidayPayPerDay}
              workPayPerDay={workPayPerDay}
              locale={locale}
            />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 p-2">
            {months &&
              months.map((date, index) => (
                <CalendarItem
                  key={index}
                  date={date}
                  now={now}
                  locale={locale}
                  holidayPayPerDay={holidayPayPerDay[index]}
                  workPayPerDay={workPayPerDay[index]}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
