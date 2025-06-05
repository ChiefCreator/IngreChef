import Modal from '../Modal/Modal';
import MobilePopup from '../MobilePopup/MobilePopup';
import ButtonClose from '../ButtonClose/ButtonClose';
import CreateCookbookForm from './CreateCookbookForm/CreateCookbookForm';
import Button from '../Button/Button';

import styles from "./CreateCookbookModal.module.scss";

interface CreateCookbookModalProps {
  isOpen: boolean;
  isMobile: boolean;

  toggle: (isOpen?: boolean) => void;
}

export default function CreateCookbookModal({ isOpen, isMobile, toggle }: CreateCookbookModalProps) {
  const formId = "form-create-cookbook";

  const content = (
    <div className={styles.modalContainer}>
      <header className={styles.modalHeader}>
        <div className={styles.modalTitleWrapper}>
          <h4 className={styles.modalTitle}>Создание кулинарной книги</h4>
          <p className={styles.modalDescription}>Собирайте рецепты и готовьте вместе с друзьями и семьей.</p>
        </div>

        {!isMobile && <ButtonClose className={styles.modalClose} onClick={() => toggle(false)} />}
      </header>

      <div className={styles.modalBody}>
        <CreateCookbookForm formId={formId} closeModal={() => toggle(false)} />
      </div>

      <footer className={styles.modalFooter}>
        <Button className={styles.modalButtonCreate} variant="primary" type="submit" form={formId}>Создать</Button>
      </footer>
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
