import GenerateRecipeForm from "./GenerateRecipeForm/GenerateRecipeForm";

import styles from "./GenerateRecipe.module.scss";

export default function GenerateRecipe() {
  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <GenerateRecipeForm />
      </div>
    </div>
  );
}