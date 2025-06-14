import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useGetCookBooksQuery, useLazyGetCookBookQuery, useAddRecipeToCookbookMutation, useRemoveRecipeFromCookbookMutation } from "../../features/api/cookbooksApi/cookbooksApi";
import { selectUserId } from "../../features/auth/authSlice";
import { useAppSelector, useMediaQuery, useInfiniteScroll } from "../../app/hooks";

import { Compass, Plus, Rocket, ListCheck, Clock, Heart, BookX, BookMarked } from "lucide-react";

import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import SearchPanel from "../../components/SearchPanel/SearchPanel";
import MyRecipeCardsPanel from "../MyRecipes/MyRecipeCardsPanel/MyRecipeCardsPanel";
import CreateCookbookModal from "../../components/CreateCookbookModal/CreateCookbookModal";

import type { RecipeCardOfMyRecipesOptions, Category, Difficulty } from "../../types/recipeTypes";
import type { ChangeFilter, Filter } from "../../types/filtersTypes";
import type { FilterListItemProps, FilterItemProps } from "../../components/SearchPanel/FilterItem/FilterItem";

import styles from "./Cookbook.module.scss";

export default function Cookbook() {
  const userId = useAppSelector(selectUserId);
  const { cookbookId } = useParams();
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const isMobile = useMediaQuery("(hover: none)");

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<Filter>({});
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [isCreateCookbookModalOpen, setIsCreateCookbookModalOpen] = useState(false);

  const [trigger, { data, isSuccess, isError, isLoading, isFetching }] = useLazyGetCookBookQuery();
  const { data: cookbooks } = useGetCookBooksQuery({ userId }, { skip: !userId });

  const [removeRecipeFromCookbook] = useRemoveRecipeFromCookbookMutation();
  const [addRecipeToCookbook] = useAddRecipeToCookbookMutation();

  useInfiniteScroll({
    hasMore: !!cursor,
    isLoading: isFetching,
    loadMore: () => {
      trigger({ cookbookId, userId, pagination: { cursor }, filters });
    },
  });

  const cookbook = data?.cookbook;
  const recipes = cookbook?.recipes;

  const changeFilter = useCallback<ChangeFilter>((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);
  const removeFilters = useCallback(() => {
    setFilters({});
  }, []);
  const toggleFiltersPanel = useCallback(() => {
    setIsFiltersPanelOpen((prev) => !prev);
  }, [isFiltersPanelOpen, setIsFiltersPanelOpen]);
  const openCookbookModal = useCallback(() => {
    setIsCreateCookbookModalOpen(true);
  }, [setIsCreateCookbookModalOpen]);
  const toggleCookbookModal = useCallback((isOpen?: boolean) => {
    if (isOpen === undefined) setIsCreateCookbookModalOpen(prev => !prev);
    else {
      setIsCreateCookbookModalOpen(isOpen);
    }
  }, [setIsCreateCookbookModalOpen]);

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
                onClick: openCookbookModal,
              },
            ],
          }
        },
        {
          id: "delete",
          type: "button",
          label: "Удалить из кулинарной книги",
          icon: <BookX size={16} />,
          onClick: () => {
            cookbookId && removeRecipeFromCookbook({ userId, cookbookId, recipeId })
          },
        },
      ],
    }
  }), [recipes, cookbooks, removeRecipeFromCookbook, addRecipeToCookbook]);

  const filterItemsData = useMemo<FilterItemProps[]>(
    () => [
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
    ],
    [filters]
  );

  useEffect(() => {
    setCursor(undefined);
    trigger({ cookbookId, userId, pagination: { cursor: undefined }, filters });
  }, [filters]);
  useEffect(() => {
    if (data?.cookbook?.recipes) {
      setCursor(data.nextRecipeCursor || undefined);
    }
  }, [data]);

  const headerControls = isDesktop ?
    [
      <Button variant="outline" className={styles.recipiesButtonLine} icon={<Compass size={16} />}>
        Лента
      </Button>,
      <Button variant="primary" className={styles.recipiesButtonLine} icon={<Plus size={16} />}>
        Добавить рецепт
      </Button>,
    ] : [];

  return (
    <section className={styles.page}>
      <Header
        className={styles.header}
        title={cookbook?.name}
        controls={headerControls}
      />
      <div className={styles.body}>
        <header className={styles.bodyHeader}>
          <SearchPanel className={styles.bodySearchPanel} filterItemsData={filterItemsData} placeholder="Поиск по названию..." isFiltersPanelOpen={isFiltersPanelOpen} changeFilter={changeFilter} removeFilters={removeFilters} toggleFiltersPanel={toggleFiltersPanel} />
        </header>

        <MyRecipeCardsPanel
          recipes={recipes}
          cardsMenuOptions={recipeCardsMenuOptions}
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
