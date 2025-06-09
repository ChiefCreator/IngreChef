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
  ref?: React.RefObject<HTMLDivElement | null>;

  toggle?: (isOpen?: boolean) => void;
  isSelected: (option: string | number) => boolean;
  onSelect: (option: string | number) => void;
};

export default function DropdownSelect({ isOpen, options, positionerProps, ref, toggle, isSelected, onSelect }: SelectProps) {
  
  return (
    <Dropdown positionerProps={positionerProps} isOpen={isOpen} toggle={toggle}>
      <div className={styles.dropdown} ref={ref}>
        <ul className={styles.list}>
          {options?.map((option) => (
            <li key={option.value}>
              <Option
                label={option.label}
                value={option.value}
                isSelected={isSelected(option.value)}
                onSelect={() => onSelect(option.value)}
              />
            </li>
          ))}
        </ul>
      </div>
    </Dropdown>
  )
}