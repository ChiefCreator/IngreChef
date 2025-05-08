import { Link } from "react-router-dom";

import { ChefHat } from "lucide-react";

import { getPluralForm } from "../../../lib/stringUtils";

import styles from "./CookbookCard.module.scss";

interface CookbookCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  recipesCount?: number;
  isFetching?: boolean;
}

export default function CookbookCard({ id, title, imageUrl, recipesCount, isFetching }: CookbookCardProps) {
  return (
    <Link className={`${styles.card} ${isFetching ? styles.cardFetching : ""}`} to={`${id}`}>
      <div className={styles.cardContainer}>
        <div className={styles.content}>
          <div className={styles.contentImgWrapper}>
            {imageUrl && <img className={styles.contentImg} src={imageUrl}></img>}
            {!imageUrl && <div className={styles.illustration}><ChefHat className={styles.illustrationIcon} size={"50%"} /></div>}
          </div>

          <h3 className={styles.contentTitle}>{title}</h3>

          <span className={styles.contentCount}>{!!recipesCount && getPluralForm(recipesCount, ["рецепт", "рецепта", "рецептов"])}</span>
        </div>

        <div className={styles.leftPart}></div>
        <div className={styles.pages}></div>
        <div className={styles.backSide}></div>
      </div>
    </Link>
  );
}