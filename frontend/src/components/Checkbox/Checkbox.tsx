import { useRef, useState } from "react";
import styles from "./Checkbox.module.scss";

import { Check } from "lucide-react";

import type { RefCallBack } from "react-hook-form";

export interface CheckboxProps {
  className?: string;
  isChecked: boolean;
  label: React.ReactNode;
  id?: string;
  name?: string;

  error?: string;
  ref?: RefCallBack;
  
  onChange?: (value: boolean) => void;
  onBlur?: () => void;
}

export default function Checkbox({ className = "", isChecked, label, id, name, error, ref, onChange, onBlur }: CheckboxProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    onChange?.(!isChecked);
  }

  return (
    <div
      className={`${className} ${styles.checkbox} ${isChecked ? styles.checkboxChecked : ""} ${error ? styles.checkboxError : ""}`}
    >
      <button className={styles.button} type="button" ref={buttonRef}>
        {isChecked && <Check className={styles.buttonIcon} size={18} />}

        <input
          className={`${styles.buttonInput}`}
          id={id}
          name={name}
          type="checkbox"
          checked={isChecked}
          onChange={toggle}
        ></input>
      </button>

      <label className={styles.label} htmlFor={id}>{label}</label>
    </div>
  );
}