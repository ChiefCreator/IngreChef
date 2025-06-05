import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import EntitiesNotFound from "../EntitiesNotFound/EntitiesNotFound";
import NoRecipeImage from "../NoRecipeImage/NoRecipeImage";

import styles from "./RecipesNotFound.module.scss";

export default function RecipesNotFound() {
  const navigate = useNavigate();

  const illustration = (
    <div className={styles.illustration}>
      <NoRecipeImage />
    </div>
  );

  return (
    <EntitiesNotFound
      description="Рецепты не найдены. Вы можете сгенерировать ваш новый рецепт."
      illustration={illustration}
      controls={[
        <Button
          onClick={() => navigate("/generate-recipe")}
        >
          Сгенерировать рецепт
        </Button>
      ]}
    />
  );
}