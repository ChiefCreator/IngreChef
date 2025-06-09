import styles from "./ControlField.module.scss";


interface InputFieldProps {
  label: string;
  error?: string;
  controlId?: string;
  children: React.ReactNode;
}

export default function ControlField({ label, error, controlId, children }: InputFieldProps) {

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={controlId}>{label}</label>

      {children}

      {error && <span className={styles.fieldErrorText}>{error}</span>}
    </div>
  );
}
