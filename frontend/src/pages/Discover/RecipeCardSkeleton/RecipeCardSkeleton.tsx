import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ChefHat } from 'lucide-react';

import styles from "./RecipeCardSkeleton.module.scss";
import "react-loading-skeleton/dist/skeleton.css";

interface RecipeCardSkeletonProps {
  count: number;
}

export default function RecipeCardSkeleton({ count = 1 }: RecipeCardSkeletonProps) {
  return Array(count).fill(0).map((_, i) => (
    <SkeletonTheme baseColor="var(--color-neutral-main--dark)" highlightColor="var(--color-neutral-main--darken)">
    <div className={styles.card} key={i}>
      <div className={styles.cardImgWrapper}>
        <div className={styles.illustration}>
          <Skeleton containerClassName={styles.illustrationSkeleton} className={styles.illustrationSkeleton} />
          <ChefHat className={styles.illustrationIcon} size={"50%"} />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <Skeleton containerClassName={styles.bodyTitle} />
  
          <Skeleton count={2} containerClassName={styles.bodyDescription} inline={true} />

          <Skeleton containerClassName={styles.bodyTimeAgo} />
        </div>
      </div>
    </div>
    </SkeletonTheme>
  ))
}