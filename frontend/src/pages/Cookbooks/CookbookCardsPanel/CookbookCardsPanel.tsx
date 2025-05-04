import React from "react";

import CookbookCard from "../CookbookCard/CookbookCard";
import CookbookCardSkeleton from "../CookbookCardSkeleton/CookbookCardSkeleton";

import styles from "./CookbookCardsPanel.module.scss";

import type { Cookbook } from "../../../types/cookBookTypes";

interface CookbookCardsPanelProps {
  data?: Cookbook[];
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  isFetching: boolean;
}

export default React.memo(function CookbookCardsPanel({ data, isSuccess, isError, isLoading, isFetching }: CookbookCardsPanelProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.cardsList}>
          <CookbookCardSkeleton count={8} />
        </div>
      );
    } else if (isSuccess) {
      return (
        <div className={styles.cardsList}>
          {data?.map(cookBook => {
            const recipesCount = cookBook.recipes?.length;
            const lastImageUrl = cookBook.recipes[recipesCount - 1]?.imageUrl;
            
            return (
              <CookbookCard
                key={cookBook.id}
                id={cookBook.id}
                title={cookBook.name}
                imageUrl={lastImageUrl}
                recipesCount={recipesCount}
                isFetching={isFetching}
              />
            );
          }
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