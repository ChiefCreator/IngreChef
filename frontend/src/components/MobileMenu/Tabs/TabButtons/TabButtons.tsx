import { Tab } from "../Tabs";
import styles from "./TabButtons.module.scss";
import { useEffect, useRef } from "react";


interface NavigateButtonsProps {
  className?: string;
  tabs: Tab[];
  activeIndex: number;

  setActiveIndex: (i: number) => void;
}

export default function TabButtons({ className = "", tabs, activeIndex, setActiveIndex }: NavigateButtonsProps) {
  const navigationRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLButtonElement>(null);
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
  }, [activeIndex]);

  return (
    <div className={`${styles.navigation} ${className}`} ref={navigationRef}>
      <div className={styles.indicator} ref={indicatorRef}></div>

      {tabs.map(({ id, title }, i) => {
        const isActive = i === activeIndex;

        return (
          <button
            className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
            
            key={id}
            ref={isActive ? activeLinkRef : undefined}
            type="button"
            onClick={() => setActiveIndex(i)}
          >{title}</button>
        )
      })}
    </div>
  );
}