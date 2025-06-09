import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import HideElement from "../HideElement/HideElement";
import MenuItemSkeleton from "../MenuItemSkeleton/MenuItemSkeleton";

import styles from "./MenuItem.module.scss";

import type { MenuItemData } from "../Sidebar";

interface MenuItemProps {
  isSidebarOpen: boolean;
  data: MenuItemData;
  level: number;
  openPath: string[];
  setOpenPath: React.Dispatch<React.SetStateAction<string[]>>;
}
interface DropdownContentProps {
  isSidebarOpen: boolean;
  data: MenuItemData;
  level: number;
  openPath: string[];
  setOpenPath: React.Dispatch<React.SetStateAction<string[]>>;
}

function DropdownContent({ data, isSidebarOpen, level, openPath, setOpenPath }: DropdownContentProps) {
  const { children, isChildrenLoading } = data || {};

  if (isChildrenLoading) {
    return <MenuItemSkeleton count={3} />
  }

  if (children?.length) { 
    return (
      <>
        {data?.children?.map((menuItemData) => (
          <MenuItem
            key={menuItemData.id}
            data={menuItemData}
            level={level + 1}
            openPath={openPath}
            setOpenPath={setOpenPath}
            isSidebarOpen={isSidebarOpen}
          />
        ))}
      </>
    );
  }

  if (!children?.length) {
    return data.defaultContent;
  }

}

function MenuItem({ isSidebarOpen, data, level, openPath, setOpenPath }: MenuItemProps) {
  const { pathname } = useLocation();
  const { title, icon } = data;

  const isButton = data.type === "buttonOpenDropdown";
  const isLinkActive = data.pathname !== "/" ? pathname.includes(data.pathname!) : pathname === data.pathname;
  const isSubMenuOpen = openPath.includes(data.id);

  function toggleSubMenu() {
    if (!isButton) return;

    if (isSubMenuOpen) {
      setOpenPath((prev) => prev.slice(0, prev.indexOf(data.id)));
    } else {
      setOpenPath((prev) => [...prev.slice(0, level), data.id]);
    }
  }
  function renderMenuItemHead(type: "link" | "button") {
    switch (type) {
      case "link": {
        return (
          <NavLink
            className={`${styles.link} ${isLinkActive ? styles.linkActive : ""}`}
            to={data.pathname!}
            end
            type="button"
          >
            <div className={styles.linkIcon}>{icon}</div>

            <HideElement isOpen={level === 0 ? isSidebarOpen : true}>
              <span className={styles.linkTitle}>{title}</span>
            </HideElement>
          </NavLink>
        );
      }
      case "button": {
        const isButtonActive = !isSidebarOpen && data?.children?.map(data => data.pathname).includes(pathname) && !isSubMenuOpen;

        return (
          <button
            className={`${styles.button} ${isSubMenuOpen ? styles.buttonOpen : ""} ${isButtonActive ? styles.buttonActive : ""}`}
            type="button"
            onClick={toggleSubMenu}
          >
            <div className={styles.buttonIcon}>{icon}</div>

            <HideElement isOpen={level === 0 ? isSidebarOpen : true}>
              <div className={styles.buttonContent}>
                <span className={styles.buttonTitle}>{title}</span>
  
                <FontAwesomeIcon className={styles.buttonArrow} icon={faAngleUp} />
              </div>
            </HideElement>
          </button>
        );
      }
    }
  }

  return (
    <div className={`${styles.menuItem} ${isSubMenuOpen ? styles.menuItemOpen : ""}`}>
      {renderMenuItemHead(isButton ? "button" : "link")}

      {(isButton && isSidebarOpen) && (
        <div className={`${styles.dropdown} ${isSubMenuOpen ? styles.dropdownOpen : ""}`}>
          <div className={styles.dropdownContainer}>
            {<DropdownContent data={data} isSidebarOpen={isSidebarOpen} level={level} openPath={openPath} setOpenPath={setOpenPath} />}
          </div>
        </div>
      )}
      {(isButton && !isSidebarOpen) && (
        <div className={`${styles.dropdownAbsolute} ${isSubMenuOpen ? styles.dropdownAbsoluteOpen : ""}`}>
          {<DropdownContent data={data} isSidebarOpen={isSidebarOpen} level={level} openPath={openPath} setOpenPath={setOpenPath} />}
        </div>
      )}
    </div>
  );
}

export default React.memo(MenuItem)
