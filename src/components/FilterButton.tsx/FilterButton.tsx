import { Funnel } from 'lucide-react';

import styles from "./FilterButton.module.scss";

interface FilterButtonProps {
  className?: string;
  children?: string;
}

export default function FilterButton({ className = "", children = "Фильтр" }: FilterButtonProps) {
  return (
    <button className={`${styles.button} ${className}`} type="button">
      <Funnel className={styles.icon} size={16} />

      <span className={styles.title}>{children}</span>
    </button>
  );
}