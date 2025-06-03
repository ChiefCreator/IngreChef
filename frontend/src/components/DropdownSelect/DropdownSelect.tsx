import Dropdown from "../Dropdown/Dropdown";
import Option from "./Option/Option";

import type { PositionerProps } from "../Positioner/Positioner";

import styles from "./DropdownSelect.module.scss";

export type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  isOpen: boolean;
  options?: Option[];

  positionerProps: PositionerProps;

  toggle: (isOpen?: boolean) => void;
  isSelected: (option: Option) => boolean;
  onSelect: (option: Option) => void;
};

export default function DropdownSelect({ isOpen, options, positionerProps, toggle, isSelected, onSelect }: SelectProps) {
  
  return (
    <Dropdown positionerProps={positionerProps} isOpen={isOpen} toggle={toggle}>
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
    </Dropdown>
  )
}