import React from "react";

import SelectedItems from "./SelectedItems/SelectedItems";
import Input from "../Input/Input";
import DropdownSelect from "../DropdownSelect/DropdownSelect";

import { v4 as uuidv4 } from 'uuid';

import type { InputProps } from "../Input/Input";
import type { Option } from "../DropdownSelect/DropdownSelect";

import styles from "./SearchWithOffer.module.scss";
import { useCallback, useRef } from "react";

interface SearchWithOfferProps {
  data?: Option[];
  selectedData?: Option[];

  inputProps: InputProps;

  onSelect: () => void;
  onSetData: (options: Option[]) => void;
}

export default React.memo(function SearchWithOffer({ data, selectedData = [], inputProps, onSelect, onSetData }: SearchWithOfferProps) {
  const { value, placeholder, name, onChange } = inputProps || {};
  const inputRef = useRef<HTMLInputElement>(null);

  const isOfferData = !!data?.length; 

  const selectItem = useCallback((ingredient: Option) => {
    if (isSelected(ingredient)) {
      onSetData(selectedData.filter((i) => i.value !== ingredient.value));
    } else {
      onSetData([...selectedData, ingredient]);
    }

    onSelect?.();
  }, [selectedData, onSetData]);
  const isSelected = useCallback((option: Option) => {
    return selectedData.some(v => v.label.toLocaleLowerCase() === option.label.toLocaleLowerCase());
  }, [selectedData]);
  const deleteSelectedItem = useCallback((value: string | number) => {
    onSetData(selectedData.filter(item => item.value !== value));
  }, [selectedData, onSetData]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      
      const target = e.target as HTMLInputElement;
      const option = { value: uuidv4(), label: target.value };

      if (!isSelected(option)) {
        onSetData([...selectedData, option]);
      }

      onSelect?.();
    }
  };

  return (
    <div className={styles.search} ref={inputRef}>
      <SelectedItems
        selectedItems={selectedData}
        deleteSelectedItem={deleteSelectedItem}
      />

      <Input
        className={styles.searchInput}
        value={value}
        placeholder={placeholder}
        name={name}

        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      
      <DropdownSelect
        isOpen={isOfferData}
        options={data}
        positionerProps={{
          triggerRef: inputRef,
          offsetY: 6,
          matchTriggerWidth: true,
        }}
        
        isSelected={isSelected}
        onSelect={selectItem}
      />
    </div>
  );
})