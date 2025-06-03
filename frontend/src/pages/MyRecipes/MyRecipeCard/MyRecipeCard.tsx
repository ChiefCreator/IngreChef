import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import RecipeMenu from "../../../components/RecipeMenu/RecipeMenu";
import NoRecipeImage from "../../../components/NoRecipeImage/NoRecipeImage";
import { MoreVertical } from "lucide-react";

import type { RecipeCardOfMyRecipesOptions } from "../../../types/recipeTypes";

import styles from "./MyRecipeCard.module.scss";
import { useMediaQuery } from "../../../app/hooks";

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
  const isTouchScreen = useMediaQuery("(hover: none)");

  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerMenuRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setContextMenu(null);
    setIsOpen(false);
  }

  const handleTriggerMenuClick = () => {
    setIsOpen(prev => !prev);
    setContextMenu(null);
  }
  const handleContextMenu = (e: MouseEvent) => {
    if (isTouchScreen) return;
    
    e.preventDefault();

    setContextMenu({ x: e.pageX, y: e.pageY });
    setIsOpen(true);
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (!isTouchScreen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    cardRef.current?.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);

    return () => {
      cardRef.current?.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={`${styles.card} ${isFetching ? styles.cardFetching : ""}`} ref={cardRef}>
        <div className={styles.cardImgWrapper}>
          <Link className={styles.cardImageLink} to={`/recipes/${recipeId}`}>
            {imageUrl && <img className={styles.cardImage} src={imageUrl}></img>}
            {!imageUrl && <NoRecipeImage />}
          </Link>

          <button className={styles.buttonMenu} type="button" onClick={handleTriggerMenuClick} ref={triggerMenuRef}>
            <MoreVertical className={styles.buttonMenuIcon} size={18} />
          </button>
        </div>
  
        <div className={styles.body}>
          <div className={styles.bodyContainer}>
            <h3 className={styles.title}><a className={styles.titleLink} href="#">{title}</a></h3>
          </div>
        </div>
      </div>

      <RecipeMenu
        isOpen={isMenuOpen}
        options={menuOptions}
        ref={menuRef}
        positionerProps={{
          triggerRef: triggerMenuRef,
          position: contextMenu ? {
            left: contextMenu?.x,
            top: contextMenu?.y,
          } : undefined
        }}
        closeMenu={closeMenu}
      />
    </>
  );
})