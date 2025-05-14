import React from "react";
import MenuItem from "../MenuItem/MenuItem";

import { MenuItemData } from "../Sidebar";

import styles from "./Menu.module.scss";

interface MenuProps {
  isSidebarOpen: boolean;
  data: MenuItemData[];
  openPath: string[];
  setOpenPath: React.Dispatch<React.SetStateAction<string[]>>;
}

export default React.memo(function Menu({ isSidebarOpen, openPath, setOpenPath, data }: MenuProps) {
  return (
    <div className={styles.menu}>
      <ul className={styles.menuList}>
        {data.map((menuItemData) => {
          return <MenuItem
            key={menuItemData.id}
            data={menuItemData}
            level={0}
            openPath={openPath}
            setOpenPath={setOpenPath}
            isSidebarOpen={isSidebarOpen}
          />;
        })}
      </ul>
    </div>
  );
})
