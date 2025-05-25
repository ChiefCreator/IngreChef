import ButtonClose from "../../ButtonClose/ButtonClose";

import type { Option } from "../../DropdownSelect/DropdownSelect";

import styles from "./SelectedItems.module.scss";

interface SelectedItems {
  selectedItems: Option[];

  deleteSelectedItem: (value: string | number) => void;
}

export default function SelectedItems({ selectedItems, deleteSelectedItem }: SelectedItems) {
  return (
    <div className={styles.selectedItems}>
      <ul className={styles.selectedItemsList}>
        {selectedItems?.map(({ value, label }) => (
          <li key={value}>
            <div className={styles.item}>
              <span className={styles.itemTitle}>{label}</span>

              <ButtonClose
                className={styles.itemButtonClose}
                iconSize={16}
                onClick={() => deleteSelectedItem(value)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}