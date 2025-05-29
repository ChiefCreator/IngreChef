import { useCallback, useState } from "react";

import GenerateRecipeForm from "./GenerateRecipeForm/GenerateRecipeForm";
import SelectRecipeModal from "./SelectRecipeModal/SelectRecipeModal";

import styles from "./GenerateRecipe.module.scss";
import type { Recipe } from "../../types/recipeTypes";

export default function GenerateRecipe() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setTempRecipes = useCallback((newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
  }, [setRecipes]);
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const onSuccessSubmit = useCallback((recipes: Recipe[]) => {
    setTempRecipes(recipes);
    openModal();
  }, [setIsModalOpen]);

  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <GenerateRecipeForm onSuccessSubmit={onSuccessSubmit} />

        <SelectRecipeModal
          recipes={recipes}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
}