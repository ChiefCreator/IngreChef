

import styles from "./Fieldset.module.scss";

interface FieldsetProps {
  className?: string;
  children: React.ReactNode;
  title: string;
}

export default function Fieldset({ className = "", children, title }: FieldsetProps) {
  return (
    <fieldset className={`${styles.fieldset} ${className}`}>
      <header className={styles.fieldsetHead}>
        <h4 className={styles.fieldsetTitle}>{title}</h4>
      </header>

      <div className={styles.fieldsetBody}>{children}</div>
    </fieldset>
  );
}