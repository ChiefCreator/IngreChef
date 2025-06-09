import { useEffect, useCallback, useState } from "react";

import SearchWithOffer from "../SearchWithOffer/SearchWithOffer";

import type { Option } from "../DropdownSelect/DropdownSelect";
import type { Ingredient } from "../../types/ingredientTypes";

import styles from "./SearchIngredients.module.scss";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectOptionsIngredients, addIngredient } from "../../features/ingredients/ingredientsSlice";

interface SearchIngredientsProps {
  selectedValues: Option["value"][];

  onSelectIngredient: (values: Option["value"][]) => void;
}

export default function SearchIngredients({ selectedValues, onSelectIngredient }: SearchIngredientsProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [transformedIngredients, setTransformedIngredients] = useState<Option[]>([]);

  const ingredients = useAppSelector(selectOptionsIngredients);

  const dispatch = useAppDispatch();

  const addNewIngredient = useCallback((option: Option) => {
    const ingredient: Ingredient = { id: String(option.value), title: option.label };
    dispatch(addIngredient(ingredient));
  }, [addIngredient, useAppDispatch]);
  const onChange = useCallback((value: Option["value"]) => {
    setQuery(value as string);
  }, [setQuery]);
  const onSelect = useCallback((values: Option["value"][]) => {
    onSelectIngredient(values);
    
    setQuery("");
    setDebouncedQuery("");
  }, [setQuery, setDebouncedQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);
  useEffect(() => {
    if (debouncedQuery.length > 0 && ingredients) {
      setTransformedIngredients(ingredients.filter(ingredient => ingredient.label.toLowerCase().startsWith(debouncedQuery.toLowerCase())));
    } else {
      setTransformedIngredients((prev) => (prev.length > 0 ? [] : prev));
    }
}, [debouncedQuery, ingredients]);

  return (
    <div className={styles.searchIngredients}>
      <SearchWithOffer
        options={ingredients}
        offeredOptions={transformedIngredients}
        selectedValues={selectedValues}

        inputProps={{
          placeholder: "Введите ингредиент",
          value: query,
          onChange: onChange,
        }}

        onSelect={onSelect}
        addNewOption={addNewIngredient}
      />
    </div>
  );
}