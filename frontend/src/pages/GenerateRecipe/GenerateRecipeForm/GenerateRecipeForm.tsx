import { useForm, Controller } from "react-hook-form";

import Fieldset from "./Fieldset/Fieldset";
import Textarea from "../../../components/Textarea/Textarea";
import Select from "../../../components/Select/Select";
import RangeSlider from "../../../components/RangeSlider/RangeSlider";
import SearchIngredients from "./SearchIngredients/SearchIngredients";
import Button from "../../../components/Button/Button";

import { recipeDifficultyOptions, recipeCategoryOptions, recipeCuisineOptions } from "../../../data/selectedRecipeData";

import type { Option } from "../../../components/Select/Select";

import styles from "./GenerateRecipeForm.module.scss";

interface RecipeFormData {
  description: string;
  ingredients: Option[];
  cookingTime: number | null;
  category: Option | null;
  difficulty: Option | null;
  cuisine: Option | null;
};

export default function GenerateRecipeForm() {
  const { control, handleSubmit, clearErrors, reset, watch, formState: { errors } } = useForm<RecipeFormData>({
    defaultValues: {
      description: "",
      ingredients: [],
      cookingTime: 15,
      category: null,
      difficulty: null,
      cuisine: null,
    },
  });

  const values = watch();

  const onSubmit = (data: RecipeFormData) => {
    console.log(data)
  }

  return (
    <>
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
                    selectedIngredients={field.value}
                    onSelectIngredient={(options: Option[]) => {
                      field.onChange(options);
                    }}
                  />
                }
              />
            </Fieldset>
          </div>

          <Button
            className={styles.buttonGenerate}
            type="submit"
          >Сгенерировать рецепт</Button>
        </div>
      </form>
    </>
  );
}