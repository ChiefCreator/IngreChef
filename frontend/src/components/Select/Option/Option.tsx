import { Check } from "lucide-react";

import styles from "./Option.module.scss";

interface OptionProps {
  label: string;
  value: string | number;
  isSelected: boolean;

  onSelect: () => void;
}

export default function Option({ label, value, isSelected, onSelect }: OptionProps) {
  return (
    <button className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`} type="button" onClick={onSelect} data-value={value}>
      <span className={styles.optionTitle}>{label}</span>

      {isSelected && <Check className={styles.optionCheck} size={14} />}
    </button>
  );
}