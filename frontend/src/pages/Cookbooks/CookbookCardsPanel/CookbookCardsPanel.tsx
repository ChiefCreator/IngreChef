import React from "react";

import CookbookCard from "../CookbookCard/CookbookCard";
import CookbookCardSkeleton from "../CookbookCardSkeleton/CookbookCardSkeleton";
import CookbooksNotFound from "../CookbooksNotFound/CookbooksNotFound";

import styles from "./CookbookCardsPanel.module.scss";

import type { Cookbook } from "../../../types/cookBookTypes";

interface CookbookCardsPanelProps {
  data?: Cookbook[];
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  isFetching: boolean;

  openCookbookModal?: () => void;
}

export default React.memo(function CookbookCardsPanel({ data, isSuccess, isError, isLoading, isFetching, openCookbookModal }: CookbookCardsPanelProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.cardsList}>
          <CookbookCardSkeleton count={8} />
        </div>
      );
    } else if (isSuccess && data?.length) {
      return (
        <div className={styles.cardsList}>
          {data.map(({ id, name, recipes, colorPalette }) => {
            const recipesCount = recipes?.length;
            const lastImageUrl = recipes[recipesCount - 1]?.imageUrl;
            
            return (
              <CookbookCard
                key={id}
                id={id}
                title={name}
                imageUrl={lastImageUrl}
                recipesCount={recipesCount}
                colorPalette={colorPalette}
                isFetching={isFetching}
              />
            );
          }
          )}
        </div>
      )
    } else if (isSuccess && !data?.length) {
      return <CookbooksNotFound buttonOnClick={openCookbookModal} />;
    } else if (isError) {
      return <CookbooksNotFound buttonOnClick={openCookbookModal} />;
    }
  };


  return (
    <div className={styles.cardsPanel}>
      {renderContent()}
    </div>
  );
})