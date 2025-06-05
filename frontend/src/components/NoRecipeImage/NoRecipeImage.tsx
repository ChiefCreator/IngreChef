import { ChefHat } from "lucide-react";

import styles from "./NoRecipeImage.module.scss";

export default function NoRecipeImage({ className }: { className?: string }) {
  return (
    <div className={`${styles.noImage} ${className}`}>
      <ChefHat className={styles.noImageIcon} size={"50%"} />
    </div>
  );
}