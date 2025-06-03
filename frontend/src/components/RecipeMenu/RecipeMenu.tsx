import { useRef } from 'react';

import MenuPanel from './MenuPanel/MenuPanel';
import Dropdown from '../Dropdown/Dropdown';

import type { RecipeCardOfMyRecipesOptions } from '../../types/recipeTypes';
import type { PositionerProps } from '../Positioner/Positioner';

import styles from "./RecipeMenu.module.scss";

interface RecipeMenuProps {
  className?: string;
  isOpen: boolean;
  options?: RecipeCardOfMyRecipesOptions;
  ref?: React.RefObject<HTMLDivElement | null>;
  positionerProps: PositionerProps;

  closeMenu: () => void;
}

type BaseMenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode; 
};
  
export interface ButtonItem extends BaseMenuItem {
  type: "button";
  onClick?: () => void;
};
export interface CheckboxItem extends BaseMenuItem {
  type: "checkbox";
  checked: boolean;
  onToggle?: (isChecked: boolean) => void;
};
export interface SubmenuItem extends BaseMenuItem {
  type: "submenu";
  submenu: {
    [key: string]: MenuItem[];
  }
};
  
export type MenuItem = ButtonItem | CheckboxItem | SubmenuItem;
  
export default function RecipeMenu({ className, isOpen, options, ref, positionerProps, closeMenu }: RecipeMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  return (
    <Dropdown isOpen={isOpen} toggle={closeMenu} positionerProps={positionerProps}>
      <div className={styles.popup} ref={ref}>
        <div className={`${styles.menu} ${className}`} ref={menuRef}>
          <MenuPanel
            options={options!}
            menuRef={menuRef}
            closeMenu={closeMenu}
          />
        </div>
      </div>
    </Dropdown>
  );
}