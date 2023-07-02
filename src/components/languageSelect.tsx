import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = React.ComponentProps<typeof Select>;

export default function LanguageSelect({ ...props }: Props) {
  const { t } = useTranslation();
  return (
    <Select {...props}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("language")}</SelectLabel>
          <SelectItem value="lt">🇱🇹 LT</SelectItem>
          <SelectItem value="en">🇬🇧 EN</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
