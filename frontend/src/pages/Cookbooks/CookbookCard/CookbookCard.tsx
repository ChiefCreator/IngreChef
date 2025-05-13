import { Link } from "react-router-dom";

import { ChefHat } from "lucide-react";

import { getPluralForm } from "../../../lib/stringUtils";

import type { Cookbook } from "../../../types/cookBookTypes";

import styles from "./CookbookCard.module.scss";

interface CookbookCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  recipesCount?: number;
  colorPalette?: Cookbook["colorPalette"];
  isFetching?: boolean;
}

export default function CookbookCard({ id, title, imageUrl, recipesCount, colorPalette, isFetching }: CookbookCardProps) {

  return (
    <Link
      className={`${styles.card} ${isFetching ? styles.cardFetching : ""}`}
      to={`${id}`}
    >
      <div className={styles.cardContainer} style={{ backgroundColor: colorPalette?.base }}>
        <div className={styles.content}>
          <div className={styles.contentImgWrapper}>
            {imageUrl && <img className={styles.contentImg} src={imageUrl}></img>}
            {!imageUrl && 
              <div className={styles.illustration} style={{ backgroundColor: colorPalette?.darker }}>
                <ChefHat className={styles.illustrationIcon} size={"50%"} style={{ color: colorPalette?.contrast }} />
              </div>
            }
          </div>

          <h3 className={styles.contentTitle} style={{ color: colorPalette?.contrast }}>{title}</h3>

          <span className={styles.contentCount} style={{ color: colorPalette?.contrast }}>{!!recipesCount && getPluralForm(recipesCount, ["рецепт", "рецепта", "рецептов"])}</span>
        </div>

        <div className={styles.leftPart}></div>
        <div className={styles.pages}></div>
        <div className={styles.backSide}></div>
      </div>
    </Link>
  );
}