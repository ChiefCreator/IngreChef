import { ChefHat } from "lucide-react";

import styles from "./NoRecipeImage.module.scss";

export default function NoRecipeImage() {
  return (
    <div className={styles.noImage}>
      <ChefHat className={styles.noImageIcon} size={"50%"} />
    </div>
  );
}