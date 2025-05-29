import { useNavigate } from "react-router-dom";

import { useSelectGeneratedRecipeMutation } from "../../../../features/api/recipesApi/recipesApi";

import styles from "./SelectRecipeCard.module.scss";
import { useAppSelector } from "../../../../app/hooks";
import { selectUserId } from "../../../../features/auth/authSlice";

interface SelectRecipeCardProps {
  id: string;
  title: string;
  description: string;
}

export default function SelectRecipeCard({ id, title, description }: SelectRecipeCardProps) {
  const userId = useAppSelector(selectUserId);
  const navigate = useNavigate();
  const [selectGeneratedRecipe] = useSelectGeneratedRecipeMutation();

  const handleClick = async () => {
    const response = await selectGeneratedRecipe({ userId, recipeId: id });

    if (response.data) {
      navigate(`/recipes/${id}`);
    }
  }

  return (
    <button className={styles.card} id={id} type="button" onClick={handleClick}>
      <h1 className={styles.cardTitle}>{title}</h1>

      <p className={styles.cardDescription}>{description}</p>
    </button>
  );
}