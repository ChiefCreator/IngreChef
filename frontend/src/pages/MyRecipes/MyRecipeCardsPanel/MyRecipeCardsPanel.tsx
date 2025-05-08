import React from "react";

import MyRecipeCard from "../MyRecipeCard/MyRecipeCard";
import MyRecipeCardSkeleton from "../MyRecipeCardSkeleton/MyRecipeCardSkeleton";

import type { RecipeCardOfMyRecipesOptions } from "../../../types/recipeTypes";

import styles from "./MyRecipeCardsPanel.module.scss";

import type { Recipe } from "../../../types/recipeTypes";

interface MyRecipeCardsPanelProps {
  recipes: Recipe[] | undefined;
  cardsMenuOptions?: RecipeCardOfMyRecipesOptions[];
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  isFetching: boolean;
}

export default React.memo(function MyRecipeCardsPanel({ recipes, cardsMenuOptions, isSuccess, isError, isLoading, isFetching }: MyRecipeCardsPanelProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.cardsList}>
          <MyRecipeCardSkeleton count={8} />
        </div>
      );
    } else if (isSuccess) {
      return (
        <div className={styles.cardsList}>
          {recipes?.map((recipe, i) => (
            <MyRecipeCard
              key={recipe.id}
              userId="author_1"
              recipeId={recipe.id}
              title={recipe.title}
              imageUrl={recipe.imageUrl}
              isFetching={isFetching}
              menuOptions={cardsMenuOptions?.[i]}
            />)
          )}
        </div>
      )
    } else if (isError) {
      return "Error";
    }
  };


  return (
    <div className={styles.cardsPanel}>
      {renderContent()}
    </div>
  );
})