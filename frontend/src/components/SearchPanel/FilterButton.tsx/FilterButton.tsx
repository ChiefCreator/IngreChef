import { Funnel } from 'lucide-react';

import styles from "./FilterButton.module.scss";

interface FilterButtonProps {
  className?: string;
  children?: string;
  isActive: boolean;

  onClick?: () => void;
}

export default function FilterButton({ className = "", children = "Фильтр", isActive, onClick }: FilterButtonProps) {
  return (
    <button className={`${styles.button} ${className}`} type="button" onClick={onClick}>
      <Funnel className={`${styles.icon} ${isActive ? styles.iconActive : ""}`} size={16} />

      <span className={styles.title}>{children}</span>
    </button>
  );
}