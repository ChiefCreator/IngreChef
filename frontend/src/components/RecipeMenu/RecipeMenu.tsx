import { Ref, useRef } from 'react';

import { Menu } from '@base-ui-components/react/menu';
import MenuPanel from './MenuPanel/MenuPanel';

import type { RecipeCardOfMyRecipesOptions } from '../../types/recipeTypes';

import styles from "./RecipeMenu.module.scss";

interface RecipeMenuProps {
  isOpen: boolean;
  options?: RecipeCardOfMyRecipesOptions;
  ref?: Ref<Element>;
  mousePos?: { x: number; y: number } | null;

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
  

export default function RecipeMenu({ isOpen, options, ref, mousePos, closeMenu }: RecipeMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  return (
    <Menu.Root open={isOpen}>
      <Menu.Portal>
         <Menu.Positioner
           sideOffset={8}
           style={{ top: mousePos?.y, left: mousePos?.x, position: 'absolute' }}
          >
          <Menu.Popup ref={ref}>
          <div className={styles.menu} ref={menuRef}>
            <MenuPanel
              options={options!}
              menuRef={menuRef}
              closeMenu={closeMenu}
            />
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}