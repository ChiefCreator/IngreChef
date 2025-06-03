import { useState, useRef, useEffect, useCallback } from "react";
import Positioner from "../Positioner/Positioner";
import Portal from "../Portal/Portal";
import DropdownSelect from "../DropdownSelect/DropdownSelect";

import Option from "../DropdownSelect/Option/Option";
import { ChevronDown } from "lucide-react";

import styles from "./Select.module.scss";

export type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  options?: Option[];
  selectedOption?: Option | Option[];
  name?: string;
  placeholder?: string;
  multiple?: boolean;

  onChange: (value?: Option | Option[]) => void;
};

export default function Select({ options, selectedOption, name, onChange, placeholder = "Выберите...", multiple = false }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerElRef = useRef<HTMLButtonElement>(null);

  const isSelected = (option: Option) => {
    if (multiple && Array.isArray(selectedOption)) {
      return selectedOption.some(v => v.value === option.value);
    }

    return (selectedOption as Option)?.value === option.value;
  };
  const displayValue = () => {
    if (multiple && Array.isArray(selectedOption)) {
      return selectedOption.map(v => v.label).join(", ");
    }

    return (selectedOption as Option)?.label || null;
  };
  const handleClear = () => {
    onChange(multiple ? [] : undefined);
  };
  const toggleDropdown = useCallback((isOpen?: boolean) => {
    if (typeof isOpen === "undefined") {
      setIsOpen(prev => !prev);
    } else {
      setIsOpen(isOpen);
    }
  }, [setIsOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();

    setIsOpen(prev => !prev);
  }
  const handleSelect = (option: Option) => {
    if (multiple) {
      if (!Array.isArray(selectedOption)) return;

      if (isSelected(option)) {
        onChange(selectedOption.filter(v => v.value !== option.value));
      } else {
        onChange([...selectedOption, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handlerClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handlerClickOutside);

    return () => document.removeEventListener("click", handlerClickOutside);
  }, []);

  return (
    <div className={`${styles.select} ${isOpen ? styles.selectActive : ""}`} ref={selectRef}>
      <button className={styles.trigger} type="button" onClick={handleTriggerClick} ref={triggerElRef}>
        <span className={styles.triggerSelectedValue}>
          {displayValue() || placeholder}
        </span>

        <ChevronDown className={styles.triggerArrow} size={14} />

        <input className={styles.triggerInput} name={name}></input>
      </button>

      
        <DropdownSelect
          isOpen={isOpen}
          toggle={toggleDropdown}
          options={options}
          positionerProps={{
            triggerRef: triggerElRef,
            offsetY: 6,
            matchTriggerWidth: true,
          }}

          isSelected={isSelected}
          onSelect={handleSelect}
        />
    </div>
  );
}