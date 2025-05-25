import { useState, useEffect, useRef } from "react";
import { Popover } from '@base-ui-components/react/popover';

import RemoveFilter from "../../RemoveFilter/RemoveFilter";
import RangeSlider from "../../../RangeSlider/RangeSlider";

import type { FilterRangeItemProps } from "../FilterItem";

import baseStyles from "./../FilterItem.module.scss";
import styles from "./FilterRangeItem.module.scss";

export default function FilterRangeItem({ id, label, icon, removeFilter, min, max, currentValue, defaultFrom = min, defaultTo = max, onComplete }: FilterRangeItemProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<{ from: number, to: number }>({ from: defaultFrom, to: defaultTo });
  const filterTriggerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  
  const handleChange = (newValue: number | number[]) => {
    if (typeof newValue === "number") return;

    setValue({ from: newValue[0], to: newValue[1] });
  };
  const onCompleteCallback = (value: number | number[]) => {
    if (typeof value === "number") return;

    onComplete?.(value);
  }

  const isShowRemoveFilterPanel = Boolean(currentValue);
  const selectedLabel = currentValue && `${currentValue?.from} - ${currentValue?.to} мин.`;

  const handleRemoveFilter = () => {
    removeFilter?.();
    setValue({ from: min, to: max });
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

  const removeFilterPanel = (
    <div className={styles.removeFilterPanel}>
      <RemoveFilter className={styles.removeFilterPanelButton} onClick={handleRemoveFilter} />
    </div>
  );

  const dropdown = (
    <div className={styles.dropdownRange}>
    <RangeSlider
      className={styles.dropdownRangeSlider}
      min={min}
      max={max}
      defaultValue={[defaultFrom, defaultTo]}
      value={[value.from, value.to]}
      onChange={handleChange}
      onComplete={onCompleteCallback}
    />

    <span className={styles.dropdownRangeValue}>{value.from} - {value.to} мин.</span>
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
            <Popover.Popup className={styles.popup} ref={popupRef}>
              {dropdown}

              {isShowRemoveFilterPanel && removeFilterPanel}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}