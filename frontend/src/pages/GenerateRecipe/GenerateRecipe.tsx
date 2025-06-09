import { useCallback, useState } from "react";

import GenerateRecipeForm from "./GenerateRecipeForm/GenerateRecipeForm";
import SelectRecipeModal from "./SelectRecipeModal/SelectRecipeModal";
import Header from "../../components/Header/Header";
import Container from "../../components/Container/Container";

import styles from "./GenerateRecipe.module.scss";
import type { Recipe } from "../../types/recipeTypes";
import { useMediaQuery } from "../../app/hooks";

export default function GenerateRecipe() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(hover: none)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  const setTempRecipes = useCallback((newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
  }, [setRecipes]);
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);
  const toggleModal = useCallback((isOpen?: boolean) => {
    if (isOpen === undefined) setIsModalOpen(prev => !prev);
    else {
      setIsModalOpen(isOpen);
    }
  }, [setIsModalOpen]);

  const onSuccessSubmit = useCallback((recipes: Recipe[]) => {
    setTempRecipes(recipes);
    openModal();
  }, [setIsModalOpen]);

  return (
    <div className={styles.page}>
      <Container className={styles.pageContainer}>
        {isDesktop && (
          <Header
            className={styles.pageHeader}
            title="Генерация рецептов"
          />
        )}

        <GenerateRecipeForm onSuccessSubmit={onSuccessSubmit} />

        <SelectRecipeModal
          recipes={recipes}
          isOpen={isModalOpen}
          isMobile={isMobile}
          toggle={toggleModal}
        />
      </Container>
    </div>
  );
}