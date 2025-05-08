import SubmenuMenuItem from '../SubmenuMenuItem/SubmenuMenuItem';
import ButtonMenuItem from '../ButtonMenuItem/ButtonMenuItem';
import CheckboxMenuItem from '../CheckboxMenuItem/CheckboxMenuItem';

import type { MenuItem } from '../RecipeMenu';

import styles from "./MenuPanel.module.scss";

interface MenuPanelProps {
  options: {
    [key: string]: MenuItem[];
  };
  menuRef?: React.RefObject<HTMLElement | null>;
  closeMenu: () => void;
}

export default function MenuPanel({ options, menuRef, closeMenu }: MenuPanelProps) {

  const getMenuItem = (menuItem: MenuItem) => {
    switch (menuItem.type) {
      case "submenu": {
        return <SubmenuMenuItem {...menuItem} menuRef={menuRef} closeMenu={closeMenu} />;
      }
      case "button": {
        return <ButtonMenuItem {...menuItem} closeMenu={closeMenu} />;
      }
      case "checkbox": {
        return <CheckboxMenuItem {...menuItem} />;
      }
    }
  }

  return (
    <div className={styles.menuPanel}>
      {Object.entries(options).map(([key, optionGroup]) => {
        return (
          <div className={styles.menuPanelBlock} key={key}>
            <ul className={styles.menuPanelList}>
              {
                optionGroup.map(menuItem => (
                  <li key={menuItem.id}>{getMenuItem(menuItem)}</li>
                ))
              }
            </ul>
          </div>
        );
      })}
    </div>
  );
}
