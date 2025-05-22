import { useState, useRef } from "react";
import type { RefCallBack } from "react-hook-form";

import { Eye, EyeOff } from "lucide-react";

import styles from "./Input.module.scss";

export interface InputProps {
  type?: "base" | "password";
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

export default function Input({ type = "base" , className = "", id, value = "", placeholder = "Введите", name, error, ref, onChange }: InputProps) {
  const [isFocesed, setIsFocused] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const inputEl = useRef<HTMLInputElement>(null);
  const controlsEl = useRef<HTMLDivElement>(null);

  const isTypePassword = type === "password";
    
  const handleFocus = () => {
    setIsFocused(true);
  }
  const handleBlur = () => {
    setIsFocused(false);
  }
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (controlsEl.current && controlsEl.current.contains(event.target as Node)) return;

    inputEl?.current?.focus();
  }
  const togglePassword = () => {
    setIsPasswordShow(prev => !prev);
  }

  return (
    <div
      className={`${styles.input} ${isFocesed ? styles.inputFocused : ""} ${error ? styles.inputError : ""} ${className}`}
      id={id}
      onClick={handleClick}
    >
      <input
        className={styles.input__item}
        value={value}
        placeholder={placeholder}
        name={name}
        type={isTypePassword && isPasswordShow ? "password" : "text"}

        onChange={(e) => onChange?.(e.target.value as string)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputEl}
      ></input>

      {isTypePassword && (
        <div className={styles.inputControls} ref={controlsEl}>
          <button className={styles.passwordToggle} type="button" onClick={togglePassword}>
            {isPasswordShow ?
              <Eye className={styles.passwordToggleIcon} size={15} /> :
              <EyeOff className={styles.passwordToggleIcon} size={15} />
            }
          </button>
        </div>
      )}
    </div>
  );
}