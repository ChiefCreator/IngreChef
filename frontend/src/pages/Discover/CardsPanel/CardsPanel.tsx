import React from "react";

import { useAppSelector } from "../../../app/hooks";
import { selectUserId } from "../../../features/auth/authSlice";

import RecipeCard from "../RecipeCard/RecipeCard";
import RecipeCardSkeleton from "../RecipeCardSkeleton/RecipeCardSkeleton";
import RecipesNotFound from "../../../components/RecipesNotFound/RecipesNotFound";

import styles from "./CardsPanel.module.scss";

import type { Recipe } from "../../../types/recipeTypes";
import type { RecipeCardOfMyRecipesOptions } from "../../../types/recipeTypes";

interface CardsPanelProps {
  recipes: Recipe[] | undefined;
  menuOptions?: RecipeCardOfMyRecipesOptions[];
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  isFetching: boolean;
}

export default React.memo(function CardsPanel({ recipes, menuOptions, isSuccess, isError, isLoading }: CardsPanelProps) {
  const userId = useAppSelector(selectUserId);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.cardsList}>
          <RecipeCardSkeleton count={4} />
        </div>
      );
    } else if (isSuccess && recipes?.length) {
      return (
        <div className={styles.cardsList}>
          {recipes.map((recipe, i) => (
            <RecipeCard
              key={recipe.id}
              userId={userId}
              recipeId={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              isFavorite={!!recipe.isFavorite}
              authorId={recipe.authorId}
              createdAt={recipe.createdAt}

              menuOptions={menuOptions?.[i]}
            />)
          )}
        </div>
      )
    } else if (isSuccess && !recipes?.length) {
      return <RecipesNotFound />;
    } else if (isError) {
      return <RecipesNotFound />;
    }
  };


  return (
    <div className={styles.cardsPanel}>
      {renderContent()}
    </div>
  );
})