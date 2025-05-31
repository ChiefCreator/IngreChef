import Modal, { ModalProps } from "../../../components/Modal/Modal";
import ButtonClose from "../../../components/ButtonClose/ButtonClose";
import SelectRecipeCard from "./SelectRecipeCard/SelectRecipeCard";

import type { Recipe } from "../../../types/recipeTypes";
import styles from "./SelectRecipeModal.module.scss";

interface SelectRecipeModalProps extends Omit<ModalProps, "children"> {
  recipes: Recipe[];
}

export default function SelectRecipeModal({ recipes, isOpen, isBackdrop = true, onClose }: SelectRecipeModalProps) {
  return (
    <Modal isOpen={isOpen} isBackdrop={isBackdrop} onClose={onClose}>
      <div className={styles.modal}>
        <header className={styles.head}>
          <h3 className={styles.headTitle}>Выберите рецепт</h3>

          <ButtonClose onClick={onClose} />
        </header>

        <div className={styles.body}>
          <div className={styles.recipesList}>
            {recipes.map(({ id, title, description, imageUrl }) => (
              <SelectRecipeCard key={id} id={id} title={title} description={description} imgSrc={imageUrl} />
            ))}
          </div>

          <button className={styles.notFoundButton} onClick={onClose}>
            Ничего не выбрали? Попробуйте еще раз
          </button>
        </div>
      </div>
    </Modal>
  );
}