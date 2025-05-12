import { Ref, useRef } from 'react';

import { Menu } from '@base-ui-components/react/menu';
import MenuPanel from './MenuPanel/MenuPanel';

import type { RefObject } from 'react';
import type { RecipeCardOfMyRecipesOptions } from '../../types/recipeTypes';

import styles from "./RecipeMenu.module.scss";

interface RecipeMenuProps {
  className?: string;
  isOpen: boolean;
  options?: RecipeCardOfMyRecipesOptions;
  ref?: Ref<Element>;
  positionerProps?: {
    mousePos?: { x: number; y: number } | null;
    align?: "center" | "end" | "start";
    anchor?: HTMLButtonElement | Element | RefObject<Element | null> | null
  };

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
  const { mousePos, align, anchor } = positionerProps || {};

  const menuRef = useRef<HTMLDivElement | null>(null);

  return (
    <Menu.Root open={isOpen} modal={false}>
      <Menu.Portal>
        <Menu.Positioner
          sideOffset={8}
          align={align}
          anchor={anchor}
          {...(mousePos ? { style: { top: mousePos?.y, left: mousePos?.x, position: "absolute" }} : {})}
        >
          <Menu.Popup ref={ref}>
          <div className={`${styles.menu} ${className}`} ref={menuRef}>
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