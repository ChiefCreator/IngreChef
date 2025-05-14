import Skeleton from "react-loading-skeleton";

import styles from "./MenuItemSkeleton.module.scss";

interface MenuItemProps {
  count?: number;
}

export default function MenuItemSkeleton({ count = 3 }: MenuItemProps) {

  return Array(count).fill(0).map((_, i) => (
    <div className={styles.menuItem} key={i}>
      <Skeleton containerClassName={styles.menuItemBg} className={styles.menuItemBg} />

      <span className={styles.menuItemTitle}>Loading</span>
    </div>
  ))
}
