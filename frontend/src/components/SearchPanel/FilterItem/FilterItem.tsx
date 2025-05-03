import FilterListItem from "./FilterListItem/FilterListItem";
import FilterRangeItem from "./FilterRangeItem/FilterRangeItem";
import FilterToggleItem from "./FilterToggleItem/FilterToggleItem";

import type { LucideProps } from "lucide-react";

import type { Category, Difficulty, Cuisine } from "../../../types/recipeTypes";
import type { Filter, ChangeFilter, ChangeFilterWithoutKey } from "../../../types/filtersTypes";

interface BaseFilterItemProps {
  readonly id: keyof Filter;
  type: "list" | "range" | "toggle";
  label: string;
  icon?: React.ReactNode;
  Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

  changeFilter?: ChangeFilter;
  removeFilter?: () => void;
}

export interface FilterListItemProps<T> extends BaseFilterItemProps {
  type: "list";

  options: { label: string; value: T; icon?: React.ReactNode }[];
  multiSelect?: boolean;
  selectedValue?: T;
  onSelect?: ChangeFilterWithoutKey;
}
export interface FilterRangeItemProps extends BaseFilterItemProps {
  type: "range";

  min: number;
  max: number;
  currentValue?: { from: number; to: number };
  defaultFrom?: number;
  defaultTo?: number;
  onComplete?: ChangeFilterWithoutKey;
}
export interface FilterToggleItemProps extends BaseFilterItemProps {
  type: "toggle";
  isActive: boolean;
  onToggle?: ChangeFilterWithoutKey;
}

export type FilterItemProps = FilterListItemProps<Category | Difficulty | Cuisine> | FilterRangeItemProps | FilterToggleItemProps;

function isListFilterItem(props: FilterItemProps): props is FilterListItemProps<Category | Difficulty | Cuisine> {
  return props.type === "list";
}
function isRangeFilterItem(props: FilterItemProps): props is FilterRangeItemProps {
  return props.type === "range";
}
function isToggleFilterItem(props: FilterItemProps): props is FilterToggleItemProps {
  return props.type === "toggle";
}

export default function FilterItem(props: FilterItemProps) {
  const { id, changeFilter } = props;

  if (isListFilterItem(props)) {
    return <FilterListItem {...props} onSelect={(value) => changeFilter?.(id, value)} />;
  }
  if (isRangeFilterItem(props)) {
    return <FilterRangeItem {...props} onComplete={(value) => changeFilter?.(id, value)} />;
  }
  if (isToggleFilterItem(props)) {
    return <FilterToggleItem {...props} onToggle={(value) => changeFilter?.(id, value)} />;
  }
}