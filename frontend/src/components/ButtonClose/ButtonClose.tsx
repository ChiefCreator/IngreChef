import { X } from "lucide-react";

import styles from "./ButtonClose.module.scss";

interface ButtonCloseProps {
  className?: string;  
  iconSize?: number;
  onClick: () => void;
};

export default function ButtonClose({ className, iconSize, onClick }: ButtonCloseProps) {
  return (
    <button className={`${styles.button} ${className}`} type="button" onClick={onClick}>
      <X size={iconSize} className={styles.buttonIcon} />
    </button>
  );
}