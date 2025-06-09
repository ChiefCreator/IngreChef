import styles from "./HideElement.module.scss";

interface HideElementProps {
  className?: string;
  isOpen: boolean;
  children: React.ReactNode;
}

export default function HideElement({ className = "", isOpen, children }: HideElementProps) {
  

  return (
    <div className={`${styles.hideElement} ${className} ${isOpen ? styles.hideElementOpen : ""}`}>
      <div className={styles.hideElementContainer}>
        {children}
      </div>
    </div>
  );
}