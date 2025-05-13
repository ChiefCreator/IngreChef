import Input from "../Input/Input";
import styles from "./InputField.module.scss";

import type { InputProps } from "../Input/Input";

interface InputFieldProps {
  label: string;
  error?: string;
  inputProps: InputProps;
}

export default function InputField({ label, error, inputProps }: InputFieldProps) {
  const { id } = inputProps;

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>

      <Input className={styles.fieldInput} {...inputProps} error={error} />

      {error && <span className={styles.fieldErrorText}>{error}</span>}
    </div>
  );
}
