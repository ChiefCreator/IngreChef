import styles from "./HideElement.module.scss";

interface HideElementProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export default function HideElement({ isOpen, children }: HideElementProps) {
  

  return (
    <div className={`${styles.hideElement} ${isOpen ? styles.hideElementOpen : ""}`}>
      <div className={styles.hideElementContainer}>
        {children}
      </div>
    </div>
  );
}