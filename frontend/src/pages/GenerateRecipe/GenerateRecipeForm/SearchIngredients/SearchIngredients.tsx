import { useEffect, useCallback, useState, useMemo } from "react";

import { useGetIngredientsQuery } from "../../../../features/api/ingredientsApi/ingredientsApi";

import SearchWithOffer from "../../../../components/SearchWithOffer/SearchWithOffer";

import type { Option } from "../../../../components/DropdownSelect/DropdownSelect";

import styles from "./SearchIngredients.module.scss";

interface SearchIngredientsProps {
  selectedIngredients: Option[];

  onSelectIngredient: (options: Option[]) => void;
}

export default function SearchIngredients({ selectedIngredients, onSelectIngredient }: SearchIngredientsProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [transformedIngredients, setTransformedIngredients] = useState<Option[]>([]);
  const { data: ingredients } = useGetIngredientsQuery({ query: debouncedQuery }, { skip: debouncedQuery.length < 1 });
  const options = useMemo<Option[]>(() => (ingredients ?? []).map(({ id, title }) => ({ value: id, label: title })), [ingredients]);

  const onChange = useCallback((value: string) => {
    setQuery(value);
  }, [setQuery]);
  const onSelect = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, [setQuery, setDebouncedQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);
  useEffect(() => {
  if (debouncedQuery.length > 0 && ingredients) {
    setTransformedIngredients(options);
  } else {
    setTransformedIngredients([]);
  }
}, [debouncedQuery, options]);

  return (
    <div className={styles.searchIngredients}>
      <SearchWithOffer
        data={transformedIngredients}
        selectedData={selectedIngredients}

        inputProps={{
          placeholder: "Введите ингредиент",
          value: query,
          onChange: onChange,
        }}

        onSelect={onSelect}
        onSetData={onSelectIngredient}
      />
    </div>
  );
}