import type { ButtonItem } from '../RecipeMenu';

import stylesBase from "./../MenuItem.module.scss";
import styles from "./SubmenuMenuItem.module.scss";

interface ButtonMenuItemProps extends ButtonItem {
  closeMenu: () => void;
}

export default function ButtonMenuItem({ id, label, icon, onClick, closeMenu }: ButtonMenuItemProps) {
  const handleClick = () => {
    closeMenu();
    onClick?.();
  }

  return (
    <button className={stylesBase.menuItem} type="button" onClick={handleClick}>
      <div className={stylesBase.menuItemIconWrapper}>{icon}</div>
  
      <span className={stylesBase.menuItemLabel}>{label}</span>
    </button>
  );
}