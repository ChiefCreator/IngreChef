import Skeleton from 'react-loading-skeleton';

import styles from "./RecipeMetaSkeleton.module.scss";

interface RecipeMetaSkeletonProps {
  count?: number;
}

export default function RecipeMetaSkeleton({ count = 5 }: RecipeMetaSkeletonProps) {
  return Array(count).fill(0).map((_, i) => (
    <div className={styles.meta} key={i}>
      <span className={styles.metaLabel}>Loading</span>
      <Skeleton className={styles.metaSkeleton} />
    </div>
  ))
}