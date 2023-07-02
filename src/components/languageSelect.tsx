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
  return (
    <Select {...props}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          <SelectItem value="lt">🇱🇹 LT</SelectItem>
          <SelectItem value="en">🇬🇧 EN</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
