
import { Check } from "lucide-react";

import type { CheckboxItem } from "../RecipeMenu";

import stylesBase from "./../MenuItem.module.scss";

interface CheckboxMenuItemProps extends CheckboxItem {
  
}

export default function CheckboxMenuItem({ label, checked, onToggle }: CheckboxMenuItemProps) {

  const handleClick = (isChecked: boolean) => {
    onToggle?.(isChecked);
  }

  return (
    <button className={`${stylesBase.menuItem} ${checked ? stylesBase.menuItemChecked : ""}`} onClick={() => handleClick(!checked)}>
      <div className={stylesBase.menuItemCheckboxWrapper}>
        {checked && <Check size={16} />}
      </div>

      <span className={stylesBase.menuItemLabel}>{label}</span>
    </button>
  );
}