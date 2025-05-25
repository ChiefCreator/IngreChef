import Positioner from "../Positioner/Positioner";
import Portal from "../Portal/Portal";
import Option from "./Option/Option";

import type { PositionerProps } from "../Positioner/Positioner";

import styles from "./DropdownSelect.module.scss";

export type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  options?: Option[];

  positionerProps: PositionerProps;

  isSelected: (option: Option) => boolean;
  onSelect: (option: Option) => void;
};

export default function DropdownSelect({ options, positionerProps, isSelected, onSelect }: SelectProps) {
  
  return (
    <Portal>
      <Positioner {...positionerProps}>
        <div className={styles.dropdown}>
          <ul className={styles.list}>
            {options?.map((option) => (
              <li key={option.value}>
                <Option
                  label={option.label}
                  value={option.value}
                  isSelected={isSelected(option)}
                  onSelect={() => onSelect(option)}
                />
              </li>
            ))}
          </ul>
        </div>
      </Positioner>
    </Portal>
  )
}