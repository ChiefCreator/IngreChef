import Portal from "../Portal/Portal";
import Backdrop from "../Backdrop/Backdrop";

import styles from "./Modal.module.scss";
import { useDisableScroll } from "../../app/hooks";

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  isBackdrop?: boolean;

  onClose: () => void;
}

export default function Modal({ children, isOpen, isBackdrop = true, onClose }: ModalProps) {
  useDisableScroll(isOpen);

  if (!isOpen) return null;

  return (
    <Portal>
      {isBackdrop && <Backdrop isActive={isOpen} onClick={onClose} />}

      <div className={styles.modal}>
        {children}
      </div>
    </Portal>
  );
}