import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ChefHat } from "lucide-react";
import RecipeMenu from "../../../components/RecipeMenu/RecipeMenu";

import type { RecipeCardOfMyRecipesOptions } from "../../../types/recipeTypes";

import styles from "./MyRecipeCard.module.scss";

interface MyRecipeCardProps {
  userId: string;
  recipeId: string;
  title: string;
  imageUrl?: string;
  isFetching?: boolean;
  menuOptions?: RecipeCardOfMyRecipesOptions;
}

export default React.memo(function MyRecipeCard({ recipeId, title, imageUrl, isFetching, menuOptions }: MyRecipeCardProps) {
  const [isMenuOpen, setIsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setContextMenu(null);
    setIsOpen(false);
  }
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
    setIsOpen(true);
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    cardRef.current?.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClickOutside);
    return () => {
      cardRef.current?.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={`${styles.card} ${isFetching ? styles.cardFetching : ""}`} ref={cardRef}>
        <div className={styles.cardImgWrapper}>
          <Link className={styles.cardImageLink} to={`/recipes/${recipeId}`}>
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

      {isMenuOpen && <RecipeMenu
        isOpen={isMenuOpen}
        options={menuOptions}
        ref={menuRef}
        positionerProps={{
          mousePos: contextMenu,
        }}
        closeMenu={closeMenu}
      />}
    </>
  );
})