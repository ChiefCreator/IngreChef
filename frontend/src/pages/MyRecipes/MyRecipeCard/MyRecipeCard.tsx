import { Link } from "react-router-dom";

import { ChefHat } from "lucide-react";

import styles from "./MyRecipeCard.module.scss";

interface MyRecipeCardProps {
  userId: string;
  recipeId: string;
  title: string;
  imageUrl?: string;
  isFetching?: boolean;
}

export default function MyRecipeCard({ title, imageUrl, isFetching }: MyRecipeCardProps) {
  return (
    <div className={`${styles.card} ${isFetching ? styles.cardFetching : ""}`}>
      <div className={styles.cardImgWrapper}>
        <Link className={styles.cardImageLink} to="/">
          {imageUrl && <img className={styles.cardImage} src={imageUrl}></img>}
          {!imageUrl && <div className={styles.illustration}><ChefHat className={styles.illustrationIcon} size={"50%"} /></div>}
        </Link>
      </div>

      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <h3 className={styles.title}><a className={styles.titleLink} href="#">{title}</a></h3>
        </div>
      </div>
    </div>
  );
}