import styles from "./RecipeCard.module.scss";
import { getTimeAgo } from "../../../lib/dateUtils";
import { Heart, BookMarked, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

import { useToggleRecipesIdsMutation } from "../../../features/api/recipesApi";

interface RecipeCardProps {
  userId: string;
  recipeId: string;
  title: string;
  description: string;
  imageUrl?: string;
  isFavorite: boolean;
  authorId: string;
  createdAt: Date;
}

function Profile({ authorId }: { authorId: RecipeCardProps["authorId"] }) {
  return (
    <div className={styles.profile}>

    </div>
  );
}

interface ControlProps {
  className?: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

function Control({ className = "", children, isActive, onClick }: ControlProps) {
  return (
    <button className={`${styles.control} ${isActive ? styles.controlActive : ""} ${className}`} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function RecipeCard({ userId, recipeId, title, description, imageUrl, isFavorite, authorId, createdAt }: RecipeCardProps) {
  const [toggleRecipe] = useToggleRecipesIdsMutation();

  return (
    <div className={styles.card}>
      <div className={styles.cardImgWrapper}>
        <Link className={styles.cardImageLink} to={`/recipes/${recipeId}`}>
          {imageUrl && <img className={styles.cardImage} src={imageUrl}></img>}
          {!imageUrl && <div className={styles.illustration}><ChefHat className={styles.illustrationIcon} size={"50%"} /></div>}
        </Link>
      </div>

      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <div className={styles.controls}>
            <div className={styles.controlsActions}>
              <Control
                className={styles.controlAddToFavorites}
                isActive={isFavorite}
                onClick={() => toggleRecipe({ userId, recipeId })}
              >
                <Heart size={18} />
              </Control>
              <Control>
                <BookMarked size={18} />
              </Control>
            </div>

            <Profile authorId={authorId} />
          </div>

          <h3 className={styles.title}><Link className={styles.titleLink} to={`/recipes/${recipeId}`}>{title}</Link></h3>

          <p className={styles.bodyDescription}>{description}</p>

          <span className={styles.bodyTimeAgo}>{getTimeAgo(new Date(createdAt))}</span>
        </div>
      </div>
    </div>
  );
}