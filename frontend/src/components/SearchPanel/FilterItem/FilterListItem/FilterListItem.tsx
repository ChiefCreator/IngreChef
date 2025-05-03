import { useState, useEffect, useRef } from "react";
import { Popover } from '@base-ui-components/react/popover';

import type { FilterListItemProps } from "../FilterItem";
import type { Difficulty, Cuisine, Category } from "../../../../types/recipeTypes";
import type { ChangeFilterWithoutKey } from "../../../../types/filtersTypes";

import RemoveFilter from "../../RemoveFilter/RemoveFilter";

import baseStyles from "./../FilterItem.module.scss";
import styles from "./FilterListItem.module.scss";

export default function FilterListItem({ id, label, icon, removeFilter, options, selectedValue, onSelect }: FilterListItemProps<Difficulty | Cuisine | Category>) {
  const [open, setOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find(option => option.value === selectedValue);
  const selectedOptionValue = selectedOption?.value;
  const selectedLabel = selectedOption?.label;
  const isShowRemoveFilterPanel = Boolean(selectedLabel);

  const handleSelect: ChangeFilterWithoutKey = (value) => {
    onSelect?.(value);
    setOpen(false);
  }
  const handleRemoveFilter = () => {
    removeFilter?.()
    setOpen(false);
  }
  const handleOutsideClick = (event: MouseEvent) => {
    if (filterTriggerRef.current && !filterTriggerRef.current.contains(event.target as Node) && !popupRef?.current?.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const dropdownList = (
    <ul className={styles.list}>
      {options.map(({ label, value, icon }) => (
        <li key={value}>
          <button
            className={`${styles.option} ${selectedOptionValue === value ? styles.optionActive : ""}`}
            type="button"
            data-value={value}
            onClick={() => handleSelect(value)}
          >
            {icon}
            <span className={styles.optionTitle}>{label}</span>
          </button>
        </li>
      ))} 
    </ul>
  );

  const removeFilterPanel = (
    <div className={baseStyles.removeFilterPanel}>
      <RemoveFilter className={baseStyles.removeFilterPanelButton} onClick={handleRemoveFilter} />
    </div>
  );

  return (
    <div className={baseStyles.filterItem}>
      <Popover.Root open={open}>
        <Popover.Trigger className={baseStyles.button} ref={filterTriggerRef} onClick={() => setOpen(prev => !prev)}>
          {icon}

          <span className={baseStyles.buttonLabel}>{label}</span>

          {selectedLabel && <span className={baseStyles.buttonSelectedValue}>{selectedLabel}</span>}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner align="start" sideOffset={8}>
            <Popover.Popup className={baseStyles.popup} ref={popupRef}>
              {dropdownList}

              {isShowRemoveFilterPanel && removeFilterPanel}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}