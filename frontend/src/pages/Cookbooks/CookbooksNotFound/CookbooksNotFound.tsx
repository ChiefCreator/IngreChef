import { ChefHat } from "lucide-react";
import Button from "../../../components/Button/Button";
import EntitiesNotFound from "../../../components/EntitiesNotFound/EntitiesNotFound";

import styles from "./CookbooksNotFound.module.scss";

interface CookbooksNotFoundProps {
  illustrationClassName?: string;
  descriptionClassName?: string;

  buttonOnClick?: () => void;
}

export default function CookbooksNotFound({ illustrationClassName = "", descriptionClassName = "", buttonOnClick }: CookbooksNotFoundProps) {
  const illustration = (
    <div className={`${styles.card} ${illustrationClassName}`}>
      <div className={styles.cardContainer}>
        <div className={styles.content}>
          <div className={styles.contentImgWrapper}>
              <div className={styles.illustration}>
                <ChefHat className={styles.illustrationIcon} size={"50%"} />
              </div>
          </div>
        </div>
  
        <div className={styles.leftPart}></div>
        <div className={styles.pages}></div>
        <div className={styles.backSide}></div>
      </div>
    </div>
  );

  const controls = buttonOnClick ? [
    <Button
      className={styles.containerButton}
      onClick={buttonOnClick}
    >
      Создать кулинарную книгу
    </Button>
  ] : undefined

  return (
    <EntitiesNotFound
      description="Кулинарные книги не найдены. Вы можете создать свою первую кулинарную книгу."
      illustration={illustration}
      controls={controls}

      descriptionClassName={descriptionClassName}
    />
  );
}