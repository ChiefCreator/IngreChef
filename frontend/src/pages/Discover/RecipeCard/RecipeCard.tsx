import React, { useState, useRef, useEffect } from "react";

import { useMediaQuery } from "../../../app/hooks";

import styles from "./RecipeCard.module.scss";
import { getTimeAgo } from "../../../lib/dateUtils";
import { Heart, BookMarked } from "lucide-react";
import NoRecipeImage from "../../../components/NoRecipeImage/NoRecipeImage";
import { Link } from "react-router-dom";
import RecipeMenu from "../../../components/RecipeMenu/RecipeMenu";

import type { RecipeCardOfMyRecipesOptions } from "../../../types/recipeTypes";

import { useAddRecipeToFavoriteMutation, useDeleteRecipeFromFavoriteMutation } from "../../../features/api/recipesApi/recipesApi";

interface RecipeCardProps {
  userId: string;
  recipeId: string;
  title: string;
  description: string;
  imageUrl?: string;
  isFavorite: boolean;
  authorId: string;
  createdAt?: Date;

  menuOptions?: RecipeCardOfMyRecipesOptions;
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

export default React.memo(function RecipeCard({ userId, recipeId, title, description, imageUrl, isFavorite, createdAt, menuOptions }: RecipeCardProps) {
  const [isMenuOpen, setIsOpen] = useState(false);
  const isTouchScreen = useMediaQuery("(hover: none)");

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerMenuRef = useRef<HTMLButtonElement>(null);

  const [addRecipeToFavorite] = useAddRecipeToFavoriteMutation();
  const [deleteRecipeFromFavorite] = useDeleteRecipeFromFavoriteMutation();
  

  const toggleRecipe = () => {
    if (isFavorite) {
      deleteRecipeFromFavorite({ userId, recipeId });
    } else {
      addRecipeToFavorite({ userId, recipeId });
    }
  };

  const handleTriggerMenuClick = () => {
    setIsOpen(prev => !prev);
  }
  const handleClickOutside = (e: MouseEvent) => {
    if (!isTouchScreen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardImgWrapper}>
          <Link className={styles.cardImageLink} to={`/recipes/${recipeId}`}>
            {imageUrl && <img className={styles.cardImage} src={imageUrl}></img>}
            {!imageUrl && <NoRecipeImage />}
          </Link>
        </div>
  
        <div className={styles.body}>
          <div className={styles.bodyContainer}>
            <div className={styles.controls}>
              <div className={styles.controlsActions}>
                <Control
                  className={styles.controlAddToFavorites}
                  isActive={isFavorite}
                  onClick={toggleRecipe}
                >
                  <Heart size={18} />
                </Control>

                <button className={styles.control} type="button" onClick={handleTriggerMenuClick} ref={triggerMenuRef}>
                  <BookMarked size={18} />
                </button>
              </div>
            </div>
  
            <h3 className={styles.title}><Link className={styles.titleLink} to={`/recipes/${recipeId}`}>{title}</Link></h3>
  
            <p className={styles.bodyDescription}>{description}</p>
  
            {createdAt && <span className={styles.bodyTimeAgo}>{getTimeAgo(new Date(createdAt))}</span>}
          </div>
        </div>
      </div>

      <RecipeMenu
        isOpen={isMenuOpen}
        options={menuOptions}
        ref={menuRef}
        positionerProps={{ triggerRef: triggerMenuRef }}
        closeMenu={() => setIsOpen(false)}
      />
    </>
  );
})