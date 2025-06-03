import type { FilterToggleItemProps } from "../FilterItem";

import baseStyles from "./../FilterItem.module.scss";
import styles from "./FilterToggleItem.module.scss";

export default function FilterToggleItem({ label, Icon, isActive, onToggle }: FilterToggleItemProps) {  
  return (
    <button className={`${baseStyles.button} ${styles.button} ${isActive ? styles.buttonActive : ""}`} type="button" onClick={() => onToggle?.(!isActive)}>
      {Icon && <Icon className={styles.buttonIcon} size={16} />}

      <span className={styles.buttonLabel}>{label}</span>
    </button>
  );
}