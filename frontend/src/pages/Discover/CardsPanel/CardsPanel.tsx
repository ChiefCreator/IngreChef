import React from "react";

import RecipeCard from "../RecipeCard/RecipeCard";
import RecipeCardSkeleton from "../RecipeCardSkeleton/RecipeCardSkeleton";

import styles from "./CardsPanel.module.scss";

import type { Recipe } from "../../../types/recipeTypes";

interface CardsPanelProps {
  recipes: Recipe[] | undefined;
  favoriteRecipesIds: string[] | undefined;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  isFetching: boolean;
}

export default React.memo(function CardsPanel({ recipes, favoriteRecipesIds, isSuccess, isError, isLoading, isFetching }: CardsPanelProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.cardsList}>
          <RecipeCardSkeleton count={4} />
        </div>
      );
    } else if (isSuccess) {
      return (
        <div className={styles.cardsList}>
          {recipes?.map(recipe => (
            <RecipeCard
              key={recipe.id}
              userId="author_1"
              recipeId={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              isFavorite={!!favoriteRecipesIds?.find(id => id === recipe.id)}
              authorId={recipe.authorId}
              createdAt={recipe.createdAt}
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