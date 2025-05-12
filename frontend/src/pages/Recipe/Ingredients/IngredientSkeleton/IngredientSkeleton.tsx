import Skeleton from "react-loading-skeleton";

import styles from "./IngredientSkeleton.module.scss";

export default function IngredientSkeleton({ count = 10 }: { count?: number }) {
  return Array(count).fill(0).map((_, i) => (
    <span className={styles.ingredient}><Skeleton /></span>
  ));
}