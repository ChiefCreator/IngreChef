import Skeleton from 'react-loading-skeleton';
import { ChefHat } from 'lucide-react';

import styles from "./CookbookCardSkeleton.module.scss";
import "react-loading-skeleton/dist/skeleton.css";

interface CookbookCardSkeletonProps {
  count?: number;
}

export default function CookbookCardSkeleton({ count = 1 }: CookbookCardSkeletonProps) {
  return Array(count).fill(0).map((_, i) => (
    <div className={styles.card} key={i}>
      <div className={styles.cardContainer}>
        <Skeleton containerClassName={styles.cardSkeleton} className={styles.cardSkeleton} />
        <div className={styles.content}>
          <div className={styles.contentImgWrapper}>
            <div className={styles.illustration}>
              <ChefHat className={styles.illustrationIcon} size={"50%"} />
            </div>
          </div>


        </div>

        <div className={styles.leftPart}></div>
        <div className={styles.pages}></div>
        <div className={styles.backSide}></div>
      </div>
    </div>
  ))
}