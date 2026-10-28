import type { UseFormSetValue } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { DemoInfoFormValues } from "../model/schema";

const specialities = [
  { code: "60110100", name: "Pedagogika" },
  { code: "60110200", name: "Maktabgacha ta’lim" },
  { code: "60110400", name: "Boshlang‘ich ta’lim" },
  { code: "60111200", name: "Jismoniy madaniyat" },
  { code: "60220300", name: "Tarix" },
  { code: "60230100", name: "Filologiya va tillarni o‘qitish" },
  { code: "60310100", name: "Siyosatshunoslik" },
  { code: "60310200", name: "Xalqaro munosabatlar" },
  { code: "60310300", name: "Psixologiya" },
  { code: "60410100", name: "Iqtisodiyot" },
  { code: "60410300", name: "Soliqlar va soliqqa tortish" },
  { code: "60410500", name: "Moliya va moliyaviy texnologiyalar" },
  { code: "60410800", name: "Menejment" },
  { code: "60411100", name: "Jahon iqtisodiyoti va xalqaro iqtisodiy munosabatlar" },
  { code: "60411200", name: "Marketing" },
  { code: "60510100", name: "Biologiya" },
  { code: "60540100", name: "Matematika" },
  { code: "60610100", name: "Axborot tizimlari va texnologiyalari" },
  { code: "60710400", name: "Energetika muhandisligi" },
  { code: "60711400", name: "Transport vositalari muhandisligi" },
  { code: "60720400", name: "Texnologik mashinalar va jihozlar" },
  { code: "60720600", name: "Neft va neft-gazni qayta ishlash texnologiyasi" },
  { code: "60720800", name: "Konchilik ishi" },
  { code: "60721700", name: "Kadastr" },
  { code: "60910100", name: "Stomatologiya" },
  { code: "60910200", name: "Davolash ishi" },
  { code: "60910500", name: "Pediatriya ishi" },
  { code: "60910600", name: "Oliy hamshiralik ishi" },
  { code: "60910800", name: "Farmatsiya" },
  { code: "61010100", name: "Turizm va mehmondo‘stlik" },
  { code: "61010400", name: "Logistika" },
];

interface SelectSpecialityProps {
  value: string;
  onValueChange: (value: string) => void;
  "aria-invalid"?: boolean;
  setValue: UseFormSetValue<DemoInfoFormValues>;
}

const SelectSpeciality = ({ value, onValueChange, "aria-invalid": ariaInvalid, setValue }: SelectSpecialityProps) => {
  const handleChange = (name: string) => {
    onValueChange(name);

    const selected = specialities.find((speciality) => speciality.name === name);

    setValue("specialityCode", selected?.code ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Select value={value} onValueChange={handleChange} aria-invalid={ariaInvalid}>
      <SelectTrigger aria-invalid={ariaInvalid}>
        <SelectValue placeholder="Yo'nalish tanlang" />
      </SelectTrigger>

      <SelectContent>
        {specialities.map((option) => (
          <SelectItem key={option.name} value={option.name}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectSpeciality;
