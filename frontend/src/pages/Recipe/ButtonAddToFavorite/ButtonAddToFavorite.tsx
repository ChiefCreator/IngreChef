import { Heart } from "lucide-react";

import styles from "./ButtonAddToFavorite.module.scss";

interface ButtonAddToFavoriteProps {
  isActive: boolean;
  toggleIsActive: () => void;
};

export default function ButtonAddToFavorite({ isActive, toggleIsActive }: ButtonAddToFavoriteProps) {
  return (
    <button className={`${styles.button} ${isActive ? styles.buttonActive : ""}`} type="button" onClick={toggleIsActive}>
      <Heart className={styles.buttonIcon} size={16} />

      <span className={styles.buttonTitle}>{isActive ? "Сохранено" : "Сохранить"}</span>
    </button>
  );
}