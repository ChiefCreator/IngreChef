
import styles from "./Header.module.scss";

interface HeaderProps {
  className?: string;
  title?: string;
  controls?: React.ReactNode[];
}

export default function Header({ className, title, controls }: HeaderProps) {
  return (
    <header className={`${styles.header} ${className}`}>
      <h2 className={styles.headerTitle}>{ title }</h2>

      <div className={styles.headerControls}>
        {controls?.map((control, i) => <div className={styles.controlWrapper} key={i}>{control}</div>)}
      </div>
    </header>
  );
}