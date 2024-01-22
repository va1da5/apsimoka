import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTranslation } from "react-i18next";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function MonthsInput({ value, onChange }: Props) {
  const [count, setCount] = useState<number | undefined>(value);
  const { t } = useTranslation();

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(count as number);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [count]);

  return (
    <div className="grid w-[140px] max-w-sm items-center gap-1.5">
      <Label htmlFor="salary">{t("monthsLabel")}</Label>
      <Input
        type="number"
        id="months"
        name="months"
        defaultValue={count}
        placeholder="Number of months"
        onChange={(e) => {
          const count = parseInt(e.target.value);
          if (isNaN(count)) return;
          if (count < 1 || count > 96) return;
          setCount(count);
        }}
      />
    </div>
  );
}
