import React from "react";

import { useAppSelector } from "../../../app/hooks";
import { selectUserId } from "../../../features/auth/authSlice";

import MyRecipeCard from "../MyRecipeCard/MyRecipeCard";
import MyRecipeCardSkeleton from "../MyRecipeCardSkeleton/MyRecipeCardSkeleton";
import RecipesNotFound from "../../../components/RecipesNotFound/RecipesNotFound";

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
  const userId = useAppSelector(selectUserId);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.cardsList}>
          <MyRecipeCardSkeleton count={8} />
        </div>
      );
    } else if (isSuccess && recipes?.length) {
      return (
        <div className={styles.cardsList}>
          {recipes.map((recipe, i) => (
            <MyRecipeCard
              key={recipe.id}
              userId={userId}
              recipeId={recipe.id}
              title={recipe.title}
              imageUrl={recipe.imageUrl}
              isFetching={isFetching}
              menuOptions={cardsMenuOptions?.[i]}
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