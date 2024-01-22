import { Calendar } from "@/components/ui/calendar";
import { ArrowBigDown, ArrowBigUp, Info } from "lucide-react";
import { bankHolidays } from "../values";
import { lt, uk } from "date-fns/locale";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useTranslation } from "react-i18next";
import { calcPercentage, countWorkingDays } from "../utils";
import { useState } from "react";

type CalendarItemProps = {
  date: Date;
  now: Date;
  locale: string;
  holidayPayPerDay: number;
  workPayPerDay: number;
};

export default function CalendarItem({
  date,
  now,
  locale,
  holidayPayPerDay,
  workPayPerDay,
}: CalendarItemProps) {
  const { t } = useTranslation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  return (
    <div
      key={date.toISOString()}
      className="group flex flex-col place-content-between lg:mb-6"
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
              {holidayPayPerDay > workPayPerDay ? (
                <ArrowBigUp
                  size={32}
                  className="inline pb-1 text-green-500 group-hover:animate-bounce"
                />
              ) : (
                <ArrowBigDown size={32} className="inline pb-1 text-red-500" />
              )}
              <span className="text-2xl font-bold">
                {holidayPayPerDay > workPayPerDay ? "+" : ""}
                {(holidayPayPerDay - workPayPerDay).toFixed(2)}
                {t("perDay")}
              </span>
            </div>
            <div className="pr-3 pt-1">
              <button
                title="Details"
                className="opacity-50 hover:opacity-100 transition-opacity duration-300"
                onClick={() => setIsDetailsOpen(true)}
              >
                <Info className="h-4 w-4" />
              </button>
              <HoverCard open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <HoverCardTrigger></HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>{t("holidayPay")}</span>
                      <span>{holidayPayPerDay.toFixed(2)}€</span>
                    </div>

                    <div className="flex justify-between">
                      <span>{t("workPay")}</span>
                      <span>{workPayPerDay.toFixed(2)}€</span>
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
            {calcPercentage(holidayPayPerDay, workPayPerDay)}
            {t("payPercentageDifference")}
          </div>
        </div>
      </div>
    </div>
  );
}
