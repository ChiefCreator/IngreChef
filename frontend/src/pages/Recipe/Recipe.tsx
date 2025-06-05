import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetRecipeQuery, useAddRecipeToFavoriteMutation, useDeleteRecipeFromFavoriteMutation } from "../../features/api/recipesApi/recipesApi";
import { useGetCookBooksQuery, useAddRecipeToCookbookMutation, useRemoveRecipeFromCookbookMutation } from "../../features/api/cookbooksApi/cookbooksApi";
import { useAppSelector, useMediaQuery } from "../../app/hooks";
import { selectUserId } from "../../features/auth/authSlice";

import { recipeOptions } from "../../data/selectedRecipeData";

import RecipeMeta from "./RecipeMeta/RecipeMeta";
import ButtonAddToFavorite from "./ButtonAddToFavorite/ButtonAddToFavorite";
import Steps from "./Steps/Steps";
import RecipeMenu from "../../components/RecipeMenu/RecipeMenu";
import RecipeMetaSkeleton from "./RecipeMetaSkeleton/RecipeMetaSkeleton";
import Ingredients from "./Ingredients/Ingredients";
import CreateCookbookModal from "../../components/CreateCookbookModal/CreateCookbookModal";
import NoRecipeImage from "../../components/NoRecipeImage/NoRecipeImage";
import { ChefHat, Clock, CalendarCheck2, BookMarked, BicepsFlexed, Shapes, Plus } from "lucide-react";

import { convertDateToDDMMYYYYFormat } from "../../lib/dateUtils";

import type { Recipe } from "../../types/recipeTypes";
import type { RecipeCardOfMyRecipesOptions } from "../../types/recipeTypes";

import styles from "./Recipe.module.scss";
import Skeleton from "react-loading-skeleton";

export default function Recipe() {
  const userId = useAppSelector(selectUserId);
  const recipeId = useParams().recipeId!;
  const [isCookbookMenuOpen, setIsCookbookMenuOpen] = useState(false);
  const [isCreateCookbookModalOpen, setIsCreateCookbookModalOpen] = useState(false);
  const cookbookMenuRef = useRef<HTMLDivElement>(null);
  const buttonCookbookRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(hover: none)");

  const { data: recipe, isSuccess: isRecipeSuccess, isLoading: isRecipeLoading } = useGetRecipeQuery({ userId, recipeId }, { skip: !userId });
  const { data: cookbooks } = useGetCookBooksQuery({ userId }, { skip: !userId });

  const [addRecipeToFavorite] = useAddRecipeToFavoriteMutation();
  const [deleteRecipeFromFavorite] = useDeleteRecipeFromFavoriteMutation();
  const [addRecipeToCookbook] = useAddRecipeToCookbookMutation();
  const [removeRecipeFromCookbook] = useRemoveRecipeFromCookbookMutation();

  const { title, description, imageUrl, category, difficulty, cuisine, cookingTime, createdAt, isFavorite, ingredients, steps  } = recipe ?? {};

  const toggleIsFavorite = () => {
    isFavorite ? deleteRecipeFromFavorite({ userId, recipeId }) : addRecipeToFavorite({ userId, recipeId });
  };
  const toggleCookbookMenu = useCallback(() => {
    setIsCookbookMenuOpen(prev => !prev);
  }, [setIsCookbookMenuOpen]);
  const closeCookbookMenu = useCallback(() => {
    setIsCookbookMenuOpen(false);
  }, [setIsCookbookMenuOpen]);
  const openCookbookModal = useCallback(() => {
    setIsCreateCookbookModalOpen(true);
  }, [setIsCreateCookbookModalOpen]);
  const toggleCookbookModal = useCallback((isOpen?: boolean) => {
    if (isOpen === undefined) setIsCreateCookbookModalOpen(prev => !prev);
    else {
      setIsCreateCookbookModalOpen(isOpen);
    }
  }, [setIsCreateCookbookModalOpen]);

  const handleClickOutsideCookbookMenu = (e: MouseEvent) => {
    if (cookbookMenuRef.current && !cookbookMenuRef.current.contains(e.target as Node) && buttonCookbookRef.current && !buttonCookbookRef.current.contains(e.target as Node)) {
      closeCookbookMenu();
    }
  };

  const cookbookMenuOptions: RecipeCardOfMyRecipesOptions | undefined = useMemo(() => ({
    "cookbooks": cookbooks ? cookbooks.map(cookbook => {
      const cookbookId = cookbook.id;

      return {
        id: cookbookId,
        type: "checkbox",
        label: cookbook.name,
        checked: !!cookbook.recipes.find(recipe => recipe.id === recipeId),
        onToggle: (isChecked: boolean) => {
          if (isChecked) {
            addRecipeToCookbook({ userId, cookbookId, recipeId, recipe: recipe! });
          } else {
            removeRecipeFromCookbook({ userId, cookbookId, recipeId });
          }
        }, 
      }
    }) : [],
    "add-cookbook": [
      {
        id: "add-cookbook/create",
        type: "button",
        label: "Создать книгу",
        icon: <Plus size={16} />,
        onClick: openCookbookModal,
      },
    ],
  }), [recipe, cookbooks, removeRecipeFromCookbook, addRecipeToCookbook]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideCookbookMenu);

    return () => {
      document.removeEventListener("click", handleClickOutsideCookbookMenu);
    };
  }, []);

  const imageWrapper = (
    <div className={styles.mainSectionImgWrapper} style={{ marginTop: Number(isDesktop || 20) }}>
      {imageUrl && <img className={styles.mainSectionImg} src={imageUrl}></img>}
      {(!imageUrl && isRecipeSuccess) && <NoRecipeImage />}
      {isRecipeLoading && (
        <div className={styles.illustration}>
          <Skeleton className={styles.illustrationSkeleton} />
          <ChefHat className={styles.illustrationIcon} size={"50%"} />
        </div>
      )}
    </div>
  );

  return (
    <section className={styles.page}>
      <div className={styles.pageContainer}>
        <div className={styles.body}>
          <section className={styles.mainSection}>
            {isDesktop && imageWrapper}
            <div className={styles.mainSectionContent}>
              <div className={styles.mainSectionInfo}>
                <h1 className={styles.mainSectionTitle}>
                  {title}
                  {isRecipeLoading && <Skeleton />}
                </h1>
                <p className={styles.mainSectionDescription}>
                  {description}
                  {isRecipeLoading && <Skeleton count={5} />}
                </p>
                {!isDesktop && imageWrapper}

                <div className={styles.mainSectionMetaWrapper}>
                  <div className={styles.recipeMetaList}>
                    {isRecipeLoading && <RecipeMetaSkeleton count={5} />}
                    {isRecipeSuccess && (
                      <>
                        <RecipeMeta
                          icon={<Shapes size={16} />}
                          label="Категория"
                          selectedValue={recipeOptions.category.find(item => item.value === category)?.label}
                        />
                        <RecipeMeta
                          icon={<BicepsFlexed size={16} />}
                          label="Сложность"
                          selectedValue={recipeOptions.difficulty.find(item => item.value === difficulty)?.label}
                        />
                        <RecipeMeta
                          icon={<ChefHat size={16} />}
                          label="Кухня"
                          selectedValue={recipeOptions.cuisine.find(item => item.value === cuisine)?.label}
                        />
                        <RecipeMeta
                          icon={<Clock size={16} />}
                          label="Время приготовления"
                          selectedValue={`${cookingTime} мин.`}
                        />
                        <RecipeMeta
                          icon={<CalendarCheck2 size={16}/>}
                          label="Дата создания"
                          selectedValue={createdAt && convertDateToDDMMYYYYFormat(createdAt)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.mainSectionControls}>
                <button className={styles.buttonCookbook} ref={buttonCookbookRef} type="button" onClick={toggleCookbookMenu}>
                  <BookMarked className={styles.buttonCookbookIcon} size={16} />
                  <span className={styles.buttonCookbookTitle}>Кулинарная книга</span>
                </button>
                
                <RecipeMenu
                  isOpen={isCookbookMenuOpen}
                  options={cookbookMenuOptions}
                  positionerProps={{
                    triggerRef: buttonCookbookRef
                  }}
                  ref={cookbookMenuRef}
                  closeMenu={closeCookbookMenu}
                />
                
                <ButtonAddToFavorite isActive={!!isFavorite} toggleIsActive={toggleIsFavorite}  />
              </div>
            </div>
          </section>
          <div className={styles.ingredientsAndStepsWrapper}>
            <div className={styles.ingredientsSection}>
              <h3 className={styles.ingredientsSectionTitle}>Ингредиенты</h3>
              <Ingredients ingredients={ingredients} isLoading={isRecipeLoading} />
            </div>
            <div className={styles.stepsSection}>
              <Steps className={styles.stepsSection} steps={steps} isLoading={isRecipeLoading} />
            </div>
          </div>
        </div>
      </div>

      <CreateCookbookModal
        isOpen={isCreateCookbookModalOpen}
        isMobile={isMobile}
        toggle={toggleCookbookModal}
      />
    </section>
  );
}