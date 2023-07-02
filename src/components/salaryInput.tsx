import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useTranslation } from "react-i18next";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function SalaryInput({ value, onChange }: Props) {
  const [salary, setSalary] = useState<number | undefined>(value);
  const { t } = useTranslation();

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(salary as number);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [salary]);

  return (
    <div className="grid w-[200px] max-w-sm items-center gap-1.5">
      <Label htmlFor="salary">{t("salaryLabel")}</Label>
      <Input
        type="text"
        id="salary"
        name="salary"
        placeholder="Base Salary"
        defaultValue={salary}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length < 1) return setSalary(0);
          if (isNaN(Number(value))) return setSalary(0);
          setSalary(Number(value));
        }}
      />
    </div>
  );
}
