import { useState } from "react";
import type { RefCallBack } from "react-hook-form";

import styles from "./Textarea.module.scss";

export interface TextareaProps {
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

export default function Textarea({ className = "", id, value = "", placeholder = "Введите", name, error, ref, onChange }: TextareaProps) {
  const [isFocesed, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  }
  const handleBlur = () => {
    setIsFocused(false);
  }

  return (
    <div
      className={`${styles.textarea} ${isFocesed ? styles.textareaFocused : ""} ${error ? styles.textareaError : ""} ${className}`}
      id={id}
    >
      <textarea
        className={styles.textarea__item}
        value={value}
        placeholder={placeholder}
        name={name}

        onChange={(e) => onChange?.(e.target.value as string)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
      ></textarea>
    </div>
  );
}