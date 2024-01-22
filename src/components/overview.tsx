import { calcPercentage, getMonthNameFromDate } from "@/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

type Props = {
  months: Date[];
  holidayPayPerDay: number[];
  workPayPerDay: number[];
  locale: string;
};

function getData(
  months: Date[],
  holidayPayPerDay: number[],
  workPayPerDay: number[],
  locale: string
) {
  return months.map((month, index) => ({
    name: `${month.getFullYear()} ${getMonthNameFromDate(month, locale)}`,
    diff: parseFloat(
      calcPercentage(holidayPayPerDay[index], workPayPerDay[index])
    ),
  }));
}

const toPercent = (decimal: number) => `${decimal.toFixed(0)}%`;

export default function Overview({
  months,
  holidayPayPerDay,
  workPayPerDay,
  locale,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={200}
        height={100}
        data={getData(months, holidayPayPerDay, workPayPerDay, locale)}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={toPercent} />
        <Tooltip />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="diff" fill="#fbbf24" />
      </BarChart>
    </ResponsiveContainer>
  );
}
