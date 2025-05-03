import { useState, useCallback, useMemo } from "react";
import { useGetRecipesQuery, useGetFavoriteRecipesIdsQuery } from "../../features/api/apiSlice";

import type { Category, Difficulty } from "../../types/recipeTypes";
import type { ChangeFilter } from "../../types/filtersTypes";
import type { RecipeQuery } from "../../types/queryTypes";
import type { FilterListItemProps, FilterItemProps } from "../../components/SearchPanel/FilterItem/FilterItem";

import CardsPanel from "./CardsPanel/CardsPanel";
import SearchPanel from "../../components/SearchPanel/SearchPanel";
import { Rocket, ListCheck, Clock, Heart } from "lucide-react";

import styles from "./Discover.module.scss";

const defaultFilters: RecipeQuery = { page: 1, limit: 10, userId: "author_1" };

export default function Discover() {
  const [filters, setFilters] = useState<RecipeQuery>(defaultFilters);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);

  const { data: recipes, isSuccess: isRecSuccess, isError: isRecError, isLoading: isRecipesLoading, isFetching: isRecipesFetching } = useGetRecipesQuery(filters);
  const { data: favoriteRecipesIds, isSuccess: isFavRecIdsSuccess, isError: isFavRecIdsError, isLoading: isFavRecIdsLoading, isFetching: isFavRecIdsFetching } = useGetFavoriteRecipesIdsQuery({ userId: "author_1" });

  const isSuccess = isRecSuccess || isFavRecIdsSuccess;
  const isError = isRecError || isFavRecIdsError;
  const isLoading = isRecipesLoading || isRecipesFetching;
  const isFetching = isFavRecIdsLoading || isFavRecIdsFetching;

  const changeFilter: ChangeFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  const removeFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);
  const toggleFiltersPanel = useCallback(() => {
    setIsFiltersPanelOpen(prev => !prev);
  }, [isFiltersPanelOpen, setIsFiltersPanelOpen]);

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
  ), [filters, changeFilter]);

  return (
    <section className={styles.page}>
      <div className={styles.body}>
        <header className={styles.bodyHeader}>
          <h1 className={styles.bodyTitle}>Откройте для себя новые рецепты</h1>
          <p className={styles.bodyDescription}>Ознакомьтесь с нашей коллекцией рецептов, присланных пользователями. Найдите свое новое кулинарное вдохновение!</p>

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
          favoriteRecipesIds={favoriteRecipesIds}
          isSuccess={isSuccess}
          isError={isError}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </section>
  );
}
