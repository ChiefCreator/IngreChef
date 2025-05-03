import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "./ButtonToggle.module.scss";

interface ButtonToggleProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ButtonToggle({ isOpen, setIsOpen }: ButtonToggleProps) {
  return (
    <button className={`${styles.buttonToggle} ${isOpen ? styles.buttonToggleOpen : ""}`} type="button" onClick={() => setIsOpen(prev => !prev)}>
      <span className={styles.buttonToggleRect}></span>
  
      <FontAwesomeIcon className={styles.buttonToggleArrow} icon={faChevronLeft} />
    </button>
  );
}