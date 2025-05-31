import { useForm, Controller } from "react-hook-form";

import { useGenerateRecipeMutation } from "../../../features/api/recipesApi/recipesApi";

import Fieldset from "./Fieldset/Fieldset";
import Textarea from "../../../components/Textarea/Textarea";
import Select from "../../../components/Select/Select";
import RangeSlider from "../../../components/RangeSlider/RangeSlider";
import SearchIngredients from "./SearchIngredients/SearchIngredients";
import ButtonSend from "../../../components/ButtonSend/ButtonSend";

import { recipeDifficultyOptions, recipeCategoryOptions, recipeCuisineOptions } from "../../../data/selectedRecipeData";

import type { Option } from "../../../components/Select/Select";
import type { Category, Difficulty, Cuisine, Recipe } from "../../../types/recipeTypes";
import type { LoadingStatus } from "../../../components/ButtonSend/ButtonSend";

import styles from "./GenerateRecipeForm.module.scss";
import { useAppSelector } from "../../../app/hooks";
import { selectUserId } from "../../../features/auth/authSlice";
import { useCallback, useEffect, useState } from "react";

interface RecipeFormData {
  description?: string;
  ingredients?: Option[];
  cookingTime?: number;
  category?: Option;
  difficulty?: Option;
  cuisine?: Option;
};

interface GenerateRecipeFormData {
  description?: string;
  ingredients?: string[];
  cookingTime?: number;
  category?: Category;
  difficulty?: Difficulty;
  cuisine?: Cuisine;
}

const transformFormData = (data: RecipeFormData): GenerateRecipeFormData => {
  return {
    ...data,
    ingredients: data?.ingredients?.map(i => i.label),
    category: data.category?.value as Category,
    difficulty: data.difficulty?.value as Difficulty,
    cuisine: data.cuisine?.value as Cuisine,
  }
}

interface GenerateRecipeFormProps {
  onSuccessSubmit: (recipes: Recipe[]) => void;
};

export default function GenerateRecipeForm({ onSuccessSubmit }: GenerateRecipeFormProps) {
  const userId = useAppSelector(selectUserId);
  const { control, handleSubmit, clearErrors, reset, watch, formState: { errors } } = useForm<RecipeFormData>({
    defaultValues: {
      description: "",
      ingredients: [],
      cookingTime: 15,
      category: undefined,
      difficulty: undefined,
      cuisine: undefined,
    },
  });
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const [generateRecipes, { isLoading, isSuccess, isError }] = useGenerateRecipeMutation();
  const values = watch();

  const updateButtonStatus = useCallback((status: LoadingStatus) => {
    setLoadingStatus(status);
  }, [loadingStatus]);
  const onSubmit = async (data: RecipeFormData) => {
    if (loadingStatus !== "idle") return;

    const transformedData = transformFormData(data);
    const generateRecipeParams = { ...transformedData, authorId: userId };

    const generateRecipeResponse = await generateRecipes(generateRecipeParams);
    const generatedRecipes = generateRecipeResponse?.data;

    if (generatedRecipes) {
      onSuccessSubmit(generatedRecipes);
      
      reset();
      clearErrors();
    } else {

    }
  }

  useEffect(() => {
    setLoadingStatus(isLoading ? "loading" : isSuccess ? "success" : isError ? "error" : "idle")
  }, [isLoading, isSuccess, isError]);

  return (
    <form className={`${styles.form}`} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formBody}>
        <div className={styles.formFieldsets}>
          <Fieldset title="Вдохновите шеф-повара на то, какие вкусы вам нравятся или что вы хотели бы приготовить">
            <Controller
              name="description"
              control={control}
              render={({ field }) => 
                <Textarea
                  value={field.value}
                  placeholder={`Например, мороженое "Веллингтон с говядиной" или "Страччателла"...`}
                  name={field.name}
                  error={errors?.description?.message}  
                  ref={field.ref}
                  onChange={field.onChange}
                />
              }
            />
          </Fieldset>
          <Fieldset title="Какое блюдо вы хотите приготовить?">
            <Controller
              name="category"
              control={control}
              render={({ field }) => 
                <Select
                  selectedOption={field.value}
                  name={field.name}
                  options={recipeCategoryOptions}
                  placeholder={"Выберите категорию"}
                  onChange={field.onChange}
                />
              }
            />
          </Fieldset>
          <Fieldset title="Какой уровень сложности следует выбрать?">
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => 
                <Select
                  selectedOption={field.value}
                  name={field.name}
                  options={recipeDifficultyOptions}
                  placeholder={"Выберите сложность"}
                  onChange={field.onChange}
                />
              }
            />
          </Fieldset>
          <Fieldset title="Какую кухню вы предпочитаете?">
            <Controller
              name="cuisine"
              control={control}
              render={({ field }) => 
                <Select
                  selectedOption={field.value}
                  name={field.name}
                  options={recipeCuisineOptions}
                  placeholder={"Выберите кухню"}
                  onChange={field.onChange}
                />
              }
            />
          </Fieldset>
          <Fieldset title="Сколько у вас есть времени?" className={styles.cookingTimeFielset}>
            <Controller
              name="cookingTime"
              control={control}
              render={({ field }) => 
                <RangeSlider
                  min={0}
                  max={600}
                  value={field.value!}
                  onChange={field.onChange}
                />
              }
            />
            <span className={styles.cookingTimeFielsetVal}>{values.cookingTime || 0} мин.</span>
          </Fieldset>
          <Fieldset title="Какие ингредиенты у вас есть?" className={styles.cookingTimeFielset}>
            <Controller
              name="ingredients"
              control={control}
              render={({ field }) => 
                <SearchIngredients
                  selectedIngredients={field.value ?? []}
                  onSelectIngredient={(options: Option[]) => {
                    field.onChange(options);
                  }}
                />
              }
            />
          </Fieldset>
        </div>

        <ButtonSend
          className={styles.buttonGenerate}
          status={loadingStatus}
          setStatus={updateButtonStatus}
          titleProps={{
            loading: "Генерация...",
            success: "Генерация завершена",
            error: "Ошибка генерации"
          }}
        >Сгенерировать рецепт</ButtonSend>
      </div>
    </form>
  );
}