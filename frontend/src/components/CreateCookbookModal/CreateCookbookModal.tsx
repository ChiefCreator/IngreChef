import { Dialog } from '@base-ui-components/react/dialog';
import ButtonClose from '../ButtonClose/ButtonClose';
import CreateCookbookForm from './CreateCookbookForm/CreateCookbookForm';
import Button from '../Button/Button';

import styles from "./CreateCookbookModal.module.scss";

interface CreateCookbookModalProps {
  isOpen: boolean;

  close: () => void;
}

export default function CreateCookbookModal({ isOpen, close }: CreateCookbookModalProps) {
  const formId = "form-create-cookbook";

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.modal}>
          <div className={styles.modalContainer}>
            <header className={styles.modalHeader}>
              <div className={styles.modalTitleWrapper}>
                <h4 className={styles.modalTitle}>Создание кулинарной книги</h4>
                <p className={styles.modalDescription}>Собирайте рецепты и готовьте вместе с друзьями и семьей.</p>
              </div>

              <ButtonClose className={styles.modalClose} onClick={close} />
            </header>

            <div className={styles.modalBody}>
              <CreateCookbookForm formId={formId} closeModal={close} />
            </div>

            <footer className={styles.modalFooter}>
              <Button className={styles.modalButtonCreate} variant="primary" type="submit" form={formId}>Создать</Button>
            </footer>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
