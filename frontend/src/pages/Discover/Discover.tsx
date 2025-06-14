import { useState, useEffect, useCallback, useMemo } from "react";
import { useLazyGetRecipesQuery } from "../../features/api/recipesApi/recipesApi";
import { selectUserId } from "../../features/auth/authSlice";
import { useAppSelector, useMediaQuery, useInfiniteScroll } from "../../app/hooks";
import { useGetCookBooksQuery, useAddRecipeToCookbookMutation, useRemoveRecipeFromCookbookMutation } from "../../features/api/cookbooksApi/cookbooksApi";

import type { Filter } from "../../types/filtersTypes";
import type { Category, Difficulty } from "../../types/recipeTypes";
import type { ChangeFilter } from "../../types/filtersTypes";
import type { FilterListItemProps, FilterItemProps } from "../../components/SearchPanel/FilterItem/FilterItem";
import type { RecipeCardOfMyRecipesOptions } from "../../types/recipeTypes";

import CardsPanel from "./CardsPanel/CardsPanel";
import SearchPanel from "../../components/SearchPanel/SearchPanel";
import CreateCookbookModal from "../../components/CreateCookbookModal/CreateCookbookModal";
import { Rocket, ListCheck, Clock, Heart, BookMarked, Plus } from "lucide-react";

import styles from "./Discover.module.scss";

export default function Discover() {
  const userId = useAppSelector(selectUserId);
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const isMobile = useMediaQuery("(hover: none)");

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<Filter>({});
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [isCreateCookbookModalOpen, setIsCreateCookbookModalOpen] = useState(false);
  

  const [trigger, { data, isSuccess, isError, isLoading, isFetching }] = useLazyGetRecipesQuery();
  const { data: cookbooks } = useGetCookBooksQuery({ userId }, { skip: !userId });

  const recipes = data?.recipes;

  const [removeRecipeFromCookbook] = useRemoveRecipeFromCookbookMutation();
  const [addRecipeToCookbook] = useAddRecipeToCookbookMutation();

  useInfiniteScroll({
    hasMore: !!cursor,
    isLoading: isFetching,
    loadMore: () => {
      trigger({ userId, pagination: { cursor }, filters });
    },
  });
  
  const changeFilter: ChangeFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  const removeFilters = useCallback(() => {
    setFilters({});
  }, []);
  const toggleFiltersPanel = useCallback(() => {
    setIsFiltersPanelOpen(prev => !prev);
  }, [isFiltersPanelOpen, setIsFiltersPanelOpen]);
  const toggleCookbookModal = useCallback((isOpen?: boolean) => {
    if (isOpen === undefined) setIsCreateCookbookModalOpen(prev => !prev);
    else {
      setIsCreateCookbookModalOpen(isOpen);
    }
  }, [setIsCreateCookbookModalOpen]);

  const filterItemsData = useMemo<FilterItemProps[]>(() => (
    [
      {
        id: "difficulty",
        icon: <Rocket size={16} />,
        label: "Сложность",
        type: "list",
        selectedValue: filters["difficulty"],
        options: [
          { 
            label: "Легкая",
            value: "easy",
          },
          { 
            label: "Средняя",
            value: "medium",
          },
          { 
            label: "Тяжелая",
            value: "hard",
          },
        ],
      } as FilterListItemProps<Difficulty>,
      {
        id: "category",
        icon: <ListCheck size={16} />,
        label: "Категория",
        type: "list",
        selectedValue: filters["category"],
        options: [
          { 
            label: "Супы",
            value: "soups",
          },
          { 
            label: "Основные блюда",
            value: "main-dishes",
          },
          { 
            label: "Гарниры",
            value: "side-dishes",
          },
          { 
            label: "Салаты",
            value: "salads",
          },
          { 
            label: "Закуски",
            value: "snacks",
          },
          { 
            label: "Дессерты",
            value: "desserts",
          },
          { 
            label: "Хлебобулочные изделия",
            value: "bakery-products",
          },
        ],
      } as FilterListItemProps<Category>,
      {
        id: "cookingTime",
        icon: <Clock size={16} />,
        label: "Время приготовления",
        type: "range",
        currentValue: filters["cookingTime"],
        min: 0,
        max: 600,
        defaultFrom: filters.cookingTime?.from,
        defaultTo: filters.cookingTime?.to,
      },
      {
        id: "isFavorite",
        Icon: Heart,
        label: "Избранные",
        type: "toggle",
        isActive: Boolean(filters["isFavorite"]),
      },
    ]
  ), [filters]);
  const recipeCardsMenuOptions: RecipeCardOfMyRecipesOptions[] | undefined = useMemo(() => recipes?.map(recipe => {
    const recipeId = recipe.id;

    return {
      "cookbook-controls": [
        {
          id: "save",
          type: "submenu",
          label: "Сохранить",
          icon: <BookMarked size={16} />,
          submenu: {
            "cookbooks": cookbooks ? cookbooks.map(cookbook => {
              const cookbookId = cookbook.id;

              return {
                id: cookbookId,
                type: "checkbox",
                label: cookbook.name,
                checked: !!cookbook.recipes.find(recipe => recipe.id === recipeId),
                onToggle: (isChecked: boolean) => {
                  if (isChecked) {
                    addRecipeToCookbook({ userId, cookbookId, recipeId, recipe });
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
                onClick: () => toggleCookbookModal(true),
              },
            ],
          }
        },
      ],
    }
  }), [recipes, cookbooks, removeRecipeFromCookbook, addRecipeToCookbook]);

  useEffect(() => {
    setCursor(undefined);
    trigger({ userId, pagination: { cursor: undefined }, filters });
  }, [filters]);
  useEffect(() => {
    if (data?.recipes) {
      setCursor(data.nextCursor || undefined);
    }
  }, [data]);

  return (
    <section className={styles.page}>
      <div className={styles.body}>
        <header className={styles.bodyHeader}>
          {isDesktop && (
            <>
              <h1 className={styles.bodyTitle}>Откройте для себя новые рецепты</h1>
              <p className={styles.bodyDescription}>Ознакомьтесь с нашей коллекцией рецептов, присланных пользователями. Найдите свое новое кулинарное вдохновение!</p>
            </>
          )}

          <SearchPanel
            className={styles.bodySearchPanel}
            filterItemsData={filterItemsData}
            placeholder="Поиск по названию..."
            isFiltersPanelOpen={isFiltersPanelOpen}

            changeFilter={changeFilter}
            removeFilters={removeFilters}
            toggleFiltersPanel={toggleFiltersPanel}
          />
        </header>

        <CardsPanel
          recipes={recipes}
          menuOptions={recipeCardsMenuOptions}
          isSuccess={isSuccess}
          isError={isError}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>

      <CreateCookbookModal
        isOpen={isCreateCookbookModalOpen}
        isMobile={isMobile}
        toggle={toggleCookbookModal}
      />
    </section>
  );
}
