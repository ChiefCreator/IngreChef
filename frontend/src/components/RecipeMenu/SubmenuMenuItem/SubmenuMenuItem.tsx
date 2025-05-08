import { useState } from 'react';

import { Menu } from '@base-ui-components/react/menu';
import { ChevronRight } from 'lucide-react';
import MenuPanel from '../MenuPanel/MenuPanel';

import type { SubmenuItem } from '../RecipeMenu';

import stylesBase from "./../MenuItem.module.scss";
import styles from "./SubmenuMenuItem.module.scss";

interface SubmenuMenuItemProps extends SubmenuItem {
  menuRef?: React.RefObject<HTMLElement | null>
  closeMenu: () => void;
}

export default function SubmenuMenuItem({ id, label, icon, submenu, menuRef, closeMenu }: SubmenuMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <Menu.Root open={isOpen} openOnHover={false}>
      <Menu.SubmenuTrigger className={stylesBase.menuItem} onMouseEnter={toggleSubmenu}>
        <div className={stylesBase.menuItemIconWrapper}>{icon}</div>
  
        <span className={stylesBase.menuItemLabel}>{label}</span>
  
        <ChevronRight className={stylesBase.menuItemArrow} size={16} />
      </Menu.SubmenuTrigger>

      <Menu.Portal container={menuRef}>
        <Menu.Positioner
          className={styles.Positioner}
          alignOffset={15}
          sideOffset={6}
        >
          <Menu.Popup className={styles.Popup}>
            <MenuPanel
              options={submenu}
              closeMenu={closeMenu}
            />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}