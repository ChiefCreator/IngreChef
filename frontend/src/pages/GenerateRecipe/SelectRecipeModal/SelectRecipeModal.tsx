import Modal from "../../../components/Modal/Modal";
import MobilePopup from "../../../components/MobilePopup/MobilePopup";
import ButtonClose from "../../../components/ButtonClose/ButtonClose";
import SelectRecipeCard from "./SelectRecipeCard/SelectRecipeCard";

import type { Recipe } from "../../../types/recipeTypes";
import styles from "./SelectRecipeModal.module.scss";

interface SelectRecipeModalProps {
  recipes: Recipe[];
  isOpen: boolean;
  isMobile: boolean;

  toggle: (isOpen?: boolean) => void;
}

export default function SelectRecipeModal({ recipes, isOpen, isMobile, toggle }: SelectRecipeModalProps) {
  const content = (
    <div className={styles.modal}>
      <header className={styles.head}>
        <h3 className={styles.headTitle}>Выберите рецепт</h3>

        {!isMobile && <ButtonClose onClick={() => toggle()} />}
      </header>

      <div className={styles.body}>
        <div className={styles.recipesList}>
          {recipes.map(({ id, title, description, imageUrl }) => (
            <SelectRecipeCard key={id} id={id} title={title} description={description} imgSrc={imageUrl} />
          ))}
        </div>

        <button className={styles.notFoundButton} onClick={() => toggle()}>
          Ничего не выбрали? Попробуйте еще раз
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && (
        <MobilePopup isOpen={isOpen} toggle={toggle}>{content}</MobilePopup>
      )}

      {!isMobile && <Modal isOpen={isOpen} onClose={() => toggle(false)}>{content}</Modal>}
    </>
  );
}