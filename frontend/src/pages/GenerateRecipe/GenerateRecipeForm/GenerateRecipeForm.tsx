import { useForm, Controller } from "react-hook-form";

import Fieldset from "./Fieldset/Fieldset";
import Textarea from "../../../components/Textarea/Textarea";
import Select from "../../../components/Select/Select";

import { recipeDifficultyOptions, recipeCategoryOptions, recipeCuisineOptions } from "../../../data/selectedRecipeData";

import type { Option } from "../../../components/Select/Select";

import styles from "./GenerateRecipeForm.module.scss";

interface RecipeFormData {
  description: string;
  ingredients: string[];
  cookingTime: number | null;
  category: Option | null;
  difficulty: Option | null;
  cuisine: Option | null;
};

export default function GenerateRecipeForm() {
  const { control, handleSubmit, clearErrors, reset, formState: { errors } } = useForm<RecipeFormData>({
    defaultValues: {
      description: "",
      ingredients: [],
      cookingTime: null,
      category: null,
      difficulty: null,
      cuisine: null,
    },
  });

  return (
    <>
      <form className={`${styles.form}`}>
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
          </div>
        </div>
      </form>
    </>
  );
}