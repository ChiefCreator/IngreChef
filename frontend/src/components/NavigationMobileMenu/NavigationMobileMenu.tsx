import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useMediaQuery } from "../../app/hooks";


import NavigationItem from "./NavigationItem/NavigationItem";
import { ChefHat, BookMarked, Compass, CookingPot } from "lucide-react";

import styles from "./NavigationMobileMenu.module.scss";

interface NavigationMobileMenuProps {
  className?: string;
}

export interface MenuItemData {
  id: string;
  pathname?: string;
  index?: boolean;
  title: string;
  icon: React.ReactNode;
}

interface IndicatorSize {
  width: number;
  left: number;
}

export default function NavigationMobileMenu({ className = "" }: NavigationMobileMenuProps) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { pathname } = useLocation();
  const [indicatorSize, setIndicatorSize] = useState<IndicatorSize>({ width: 0, left: 0 });

  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const menuData = useMemo<MenuItemData[]>(() => [
    {
      id: "item-1",
      pathname: "/",
      index: true,
      title: "Мои рецепты",
      icon: <ChefHat size={16} />,
    },
    {
      id: "item-7",
      title: "Генерация",
      pathname: "/generate-recipe",
      icon: <CookingPot size={16} />,
    },
    {
      id: "item-4",
      title: "Кулинарные книги",
      pathname: "/cookbooks",
      icon: <BookMarked size={16} />,
    },
    {
      id: "item-8",
      title: "Лента",
      pathname: "/discover",
      icon: <Compass size={16} />,
    },
  ], []);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const item = (e.target as Element).closest(`.${styles.menuItem}`);
    const itemRect = item?.getBoundingClientRect();

    setIndicatorSize({
      width: itemRect?.width || 0,
      left: itemRect?.left || 0,
    });
  }

  useLayoutEffect(() => {

    setTimeout(() => {
      if (!activeItemRef.current) return;

      const activeItemRect = activeItemRef.current?.getBoundingClientRect();

      console.log(activeItemRef) 

      setIndicatorSize({
        width: activeItemRect?.width || 0,
        left: activeItemRect?.left || 0,
      });
    })
  }, [activeItemRef]);

  if (!isMobile) return null;

  return (
    <nav className={`${styles.menu} ${className}`}>
      <div className={styles.menuBorder}>
        <div className={styles.menuIndicator} ref={indicatorRef} style={{ width: indicatorSize.width, left: indicatorSize.left }}></div>
      </div>

      <div className={styles.menuContainer}>
        {menuData.map(({ id, title, icon, pathname: path }) => (
          <NavigationItem className={styles.menuItem} key={id} ref={pathname === path ? activeItemRef : undefined} id={id} title={title} icon={icon} to={path ?? "/"} isActive={pathname === path} onClick={handleItemClick} />
        ))}
      </div>
    </nav>
  );
}