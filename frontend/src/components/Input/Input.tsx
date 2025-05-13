import { useState } from "react";
import type { RefCallBack } from "react-hook-form";

import styles from "./Input.module.scss";

export interface InputProps {
  className?: string;
  id?: string;
  value?: string;
  placeholder?: string;
  name?: string;

  error?: string;
  ref?: RefCallBack;
  
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export default function Input({ className = "", id, value = "", placeholder = "Введите", name, error, onChange }: InputProps) {
  const [isFocesed, setIsFocused] = useState(false);
    
  const handleFocus = () => {
    setIsFocused(true);
  }
  const handleBlur = () => {
    setIsFocused(false);
  }

  return (
    <div
      className={`${styles.input} ${isFocesed ? styles.inputFocused : ""} ${error ? styles.inputError : ""} ${className}`}
      id={id}
    >
      <input
        className={styles.input__item}
        value={value}
        placeholder={placeholder}
        name={name}

        onChange={(e) => onChange?.(e.target.value as string)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      ></input>
    </div>
  );
}