import IngredientSkeleton from "./IngredientSkeleton/IngredientSkeleton";

import styles from "./Ingredients.module.scss";

interface IngredientsProps {
  ingredients?: string[];

  isLoading?: boolean;
}

export default function Ingredients({ ingredients, isLoading }: IngredientsProps) {
  return (
    <ul className={styles.ingredientsList}>
      {ingredients?.map((ingredient, i) => (
        <li className={styles.ingredientsListItemWrapper} key={i}>
          <span className={styles.ingredientsListItem}>{ingredient}</span>
        </li>
      ))}

      {isLoading && <IngredientSkeleton count={10} />}
    </ul>
  );
}