import React, { useEffect, useState } from "react";

import SelectedItems from "./SelectedItems/SelectedItems";
import Input from "../Input/Input";
import DropdownSelect from "../DropdownSelect/DropdownSelect";

import { v4 as uuidv4 } from 'uuid';

import type { InputProps } from "../Input/Input";
import type { Option } from "../DropdownSelect/DropdownSelect";

import styles from "./SearchWithOffer.module.scss";
import { useCallback, useRef } from "react";
import { useMediaQuery } from "../../app/hooks";

interface SearchWithOfferProps {
  options?: Option[];
  offeredOptions?: Option[];
  selectedValues?: Option["value"][];

  inputProps: InputProps;

  onSelect: (labels: Option["value"][]) => void;
  addNewOption?: (option: Option) => void;
}

export default React.memo(function SearchWithOffer({ options, offeredOptions, selectedValues = [], inputProps, onSelect, addNewOption }: SearchWithOfferProps) {
  const isMobile = useMediaQuery("(hover: none)");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = selectedValues.map(v => ({ value: v, label: options?.find(d => d.value === v)?.label })) as Option[];

  const selectItem = useCallback((value: Option["value"]) => {
    if (isSelected(value)) {
      onSelect(selectedValues.filter(v => v !== value));
    } else {
      onSelect([...selectedValues, value]);
    }
  }, [selectedValues, onSelect]);
  const isSelected = useCallback((value: Option["value"]) => {
    return selectedValues.some(v => v === value);
  }, [selectedValues]);
  const deleteSelectedItem = useCallback((value: Option["value"]) => {
    onSelect(selectedValues.filter(v => v !== value));
  }, [selectedValues, onSelect]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      
      const target = e.target as HTMLInputElement;

      const value = uuidv4();
      const option = { value, label: target.value };

      if (!isSelected(value)) {
        addNewOption?.(option);
        setTimeout(() => onSelect([...selectedValues, value]), 0)
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobile) return;

      setIsDropdownOpen(false);
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, []);
  useEffect(() => {
    if (isMobile) return;

    setIsDropdownOpen(!!offeredOptions?.length);
  }, [offeredOptions, isMobile]);

  return (
    <div className={styles.search} ref={inputRef}>
      {!!selectedOptions.length && (
        <SelectedItems
          selectedItems={selectedOptions}
          deleteSelectedItem={deleteSelectedItem}
        />
      )}

      <Input
        className={styles.searchInput}
        {...inputProps}
        onKeyDown={onKeyDown}
      />

      {!isMobile && (
        <DropdownSelect
          isOpen={isDropdownOpen}
          options={offeredOptions}
          positionerProps={{
            triggerRef: inputRef,
            offsetY: 6,
            matchTriggerWidth: true,
          }}
          
          isSelected={isSelected}
          onSelect={selectItem}
        />
      )}
    </div>
  );
})