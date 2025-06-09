import { useState, useRef } from "react";
import type { RefCallBack } from "react-hook-form";

import { Eye, EyeOff } from "lucide-react";

import styles from "./Input.module.scss";

export interface InputProps {
  type?: "text" | "password" | "number";
  className?: string;
  id?: string;
  value?: string | number;
  placeholder?: string;
  name?: string;

  error?: string;
  ref?: RefCallBack;
  
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({ type = "text" , className = "", id, value = "", placeholder = "Введите", name, error, onChange, onKeyDown }: InputProps) {
  const [isFocesed, setIsFocused] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const inputEl = useRef<HTMLInputElement>(null);
  const controlsEl = useRef<HTMLDivElement>(null);

  const isTypePassword = type === "password";
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      onChange?.(+e.target.value)
    } else {
      onChange?.(e.target.value as string)
    }
  }
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
        type={(isTypePassword && isPasswordShow) ? "text" : type}

        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
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