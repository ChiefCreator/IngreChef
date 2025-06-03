import { useRef, useState } from 'react';

import { useMediaQuery } from '../../../app/hooks';

import { ChevronRight } from 'lucide-react';
import MenuPanel from '../MenuPanel/MenuPanel';
import Dropdown from '../../Dropdown/Dropdown';

import type { SubmenuItem } from '../RecipeMenu';

import stylesBase from "./../MenuItem.module.scss";
import styles from "./SubmenuMenuItem.module.scss";

interface SubmenuMenuItemProps extends SubmenuItem {
  menuRef?: React.RefObject<HTMLElement | null>
  closeMenu: () => void;
}

export default function SubmenuMenuItem({ label, icon, submenu, closeMenu }: SubmenuMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isTouchScreen = useMediaQuery("(hover: none)");

  const toggleSubmenu = () => {
    setIsOpen(prev => !prev);
  }

  const handleMouseOver = () => {
    if (isTouchScreen) return;

    setIsOpen(prev => !prev);
  }

  return (
    <>
      <button className={`${stylesBase.menuItem} ${styles.menuItem}`} onMouseEnter={handleMouseOver} onClick={toggleSubmenu} ref={triggerRef}>
        <div className={stylesBase.menuItemIconWrapper}>{icon}</div>
  
        <span className={stylesBase.menuItemLabel}>{label}</span>
  
        <ChevronRight className={stylesBase.menuItemArrow} size={16} />
      </button>

      <Dropdown isOpen={isOpen} isAbsolute={!isTouchScreen} positionerProps={{ triggerRef, anchorOrigin: { vertical: "top", horizontal: "right" } }} toggle={toggleSubmenu}>
        <div className={styles.menuItemDropdownContent}>
          <MenuPanel
            options={submenu}
            closeMenu={closeMenu}
          />
        </div>
      </Dropdown>
    </>
  );
}