import { X } from "lucide-react";

import styles from "./ButtonClose.module.scss";

interface ButtonCloseProps {
  className?: string;  
  onClick: () => void;
};

export default function ButtonClose({ className, onClick }: ButtonCloseProps) {
  return (
    <button className={`${styles.button} ${className}`} type="button" onClick={onClick}>
      <X className={styles.buttonIcon} />
    </button>
  );
}