

import { Link, useLocation } from "react-router-dom";
import styles from "./NavigateButtons.module.scss";
import { useEffect, useRef } from "react";

interface navigationDataItem {
  id: string;
  to: string;
  title: string;
}

const navigationData: navigationDataItem[] = [
  {
    id: "profile",
    to: "/settings/profile",
    title: "Профиль"
  },
  {
    id: "preferences",
    to: "/settings/preferences",
    title: "Предпочтения"
  }
];

interface NavigateButtonsProps {
  className?: string;
}

export default function NavigateButtons({ className = "" }: NavigateButtonsProps) {
  const { pathname } = useLocation();

  const navigationRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navigation = navigationRef.current;
    const activeLink = activeLinkRef.current;
    const indicator = indicatorRef.current;

    if (!activeLink || !navigation || !indicator) return;

    const navigationRect = navigation.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const offsetX = linkRect.left - navigationRect.left;
    const width = linkRect.width;

    indicator.style.transform = `translateX(${offsetX}px)`;
    indicator.style.width = `${width}px`;
  }, [pathname]);

  return (
    <nav className={`${styles.navigation} ${className}`} ref={navigationRef}>
      <div className={styles.indicator} ref={indicatorRef}></div>

      {navigationData.map(({ id, to, title }) => {
        const isActive = pathname === to;

        return (
          <Link
            className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
            to={to}
            key={id}
            ref={isActive ? activeLinkRef : undefined}
          >{title}</Link>
        )
      })}
    </nav>
  );
}