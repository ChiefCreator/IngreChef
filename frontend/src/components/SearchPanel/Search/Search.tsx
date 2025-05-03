import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import styles from "./Search.module.scss";

interface SearchProps {
  className?: string;
  placeholder?: string;

  onChange?: (value: string) => void;
}

export default function Search({ className = "", placeholder = "", onChange }: SearchProps) {
  const [isFocesed, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  }
  const handleBlur = () => {
    setIsFocused(false);
  }

  return (
    <div className={`${styles.search} ${className} ${isFocesed ? styles.searchFocused : ""}`}>
      <div className={styles.searchContainer}>
        <FontAwesomeIcon className={styles.searchIcon} icon={faMagnifyingGlass} />

        <input
          className={styles.input}
          placeholder={placeholder}

          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => onChange?.(e.target.value)}
        ></input>
      </div>
    </div>
  );
}