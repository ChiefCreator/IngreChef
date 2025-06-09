import React, { useState, useRef, useEffect, useCallback } from "react";
import DropdownSelect from "../DropdownSelect/DropdownSelect";

import Option from "../DropdownSelect/Option/Option";
import { ChevronDown } from "lucide-react";

import styles from "./Select.module.scss";

export type Option = {
  label: string;
  value: string | number;
};

export interface SelectProps {
  options?: Option[];
  selectedValue?: string | number;
  name?: string;
  placeholder?: string;
  multiple?: boolean;

  onChange: (value?: Option["value"] | Option["value"][]) => void;
};

export default React.memo(function Select({ options, selectedValue, name, onChange, placeholder = "Выберите...", multiple = false }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerElRef = useRef<HTMLButtonElement>(null);

  const isSelectedValueArray = Array.isArray(selectedValue);

  const isSelected = (value: Option["value"]) => {
    if (multiple && isSelectedValueArray) {
      return selectedValue.some(v => v === value);
    }

    return value === selectedValue;
  };
  const displayLabel = () => {
    if (multiple && isSelectedValueArray) {
      return options?.filter(o => o.value === selectedValue).map(o => o.label).join(", ");
    }

    return options?.find(o => o.value === selectedValue)?.label;
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
  const handleSelect = (value: Option["value"]) => {
    if (multiple) {
      if (!isSelectedValueArray) return;

      if (isSelected(value)) {
        onChange(selectedValue.filter(v => v !== value));
      } else {
        onChange([...selectedValue, value]);
      }
    } else {
      onChange(value);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handlerClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handlerClickOutside);

    return () => document.removeEventListener("click", handlerClickOutside);
  }, []);

  return (
    <div className={`${styles.select} ${isOpen ? styles.selectActive : ""}`}>
      <button className={styles.trigger} type="button" onClick={handleTriggerClick} ref={triggerElRef}>
        <span className={styles.triggerSelectedValue}>
          {displayLabel() || placeholder}
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
          ref={dropdownRef}

          isSelected={isSelected}
          onSelect={handleSelect}
        />
    </div>
  );
})