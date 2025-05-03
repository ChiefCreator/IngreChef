import { useState, useEffect, useRef } from "react";
import { Popover } from '@base-ui-components/react/popover';
import { Slider } from "@base-ui-components/react/slider";

import RemoveFilter from "../../RemoveFilter/RemoveFilter";

import type { FilterRangeItemProps } from "../FilterItem";

import baseStyles from "./../FilterItem.module.scss";
import styles from "./FilterRangeItem.module.scss";

export default function FilterRangeItem({ id, label, icon, removeFilter, min, max, currentValue, defaultFrom = min, defaultTo = max, onComplete }: FilterRangeItemProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<{ from: number, to: number }>({ from: defaultFrom, to: defaultTo });
  const filterTriggerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  
  const handleChange = (newValue: number[]) => {
    setValue({ from: newValue[0], to: newValue[1] });
  };

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
    <Slider.Root
      className={styles.range}
      min={min}
      max={max}
      value={[defaultFrom, defaultTo]}
      largeStep={1}
      minStepsBetweenValues={5}

      onValueChange={handleChange}
      onValueCommitted={() => onComplete?.(value)}
    >
      <Slider.Control className={styles.rangeControl}>
        <Slider.Track className={styles.rangeTrack}>
          <Slider.Indicator className={styles.rangeIndicator} />
          <Slider.Thumb className={styles.rangeThumb} />
          <Slider.Thumb className={styles.rangeThumb} />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>

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