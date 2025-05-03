import styles from "./RemoveFilter.module.scss";

import { FunnelX } from "lucide-react";

interface RemoveFilterProps {
  className?: string;
  onClick: () => void;
}

export default function RemoveFilter({ className = "", onClick }: RemoveFilterProps) {
  return (
    <button className={`${styles.removeFilter} ${className}`} type="button" onClick={onClick}>
      <FunnelX size={16} />

      <span className={styles.removeFilterTitle}>Удалить фильтр</span>
    </button>
  );
}
