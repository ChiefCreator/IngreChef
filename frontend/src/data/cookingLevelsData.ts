import type { CookingLevel } from "../features/api/userApi/userApiTypes";

interface cookingLevelOption {
  value: CookingLevel;
  label: string;
}

export const cookingLevelsData: cookingLevelOption[] = [
  {
    value: "novice",
    label: "Новичок",
  },
  {
    value: "intermediate",
    label: "Средний",
  },
  {
    value: "expert",
    label: "Эксперт",
  },
];