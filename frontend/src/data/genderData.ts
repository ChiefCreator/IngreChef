import type { Gender } from "../features/api/userApi/userApiTypes";

interface GenderOption {
  value: Gender;
  label: string;
}

export const genderData: GenderOption[] = [
  {
    value: "male",
    label: "Мужской",
  },
  {
    value: "female",
    label: "Женский",
  },
  {
    value: "unspecified",
    label: "Не указан",
  },
];