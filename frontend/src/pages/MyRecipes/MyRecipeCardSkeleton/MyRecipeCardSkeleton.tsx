import Skeleton from 'react-loading-skeleton';
import ImageSkeleton from '../../../components/ImageSkeleton/ImageSkeleton';
import { ChefHat } from 'lucide-react';

import styles from "./MyRecipeCardSkeleton.module.scss";
import "react-loading-skeleton/dist/skeleton.css";

interface MyRecipeCardSkeletonProps {
  count?: number;
}

export default function MyRecipeCardSkeleton({ count = 1 }: MyRecipeCardSkeletonProps) {
  return Array(count).fill(0).map((_, i) => (
    <div className={styles.card} key={i}>
      <div className={styles.cardImgWrapper}>
        <ImageSkeleton Icon={ChefHat} />
      </div>
  
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <Skeleton containerClassName={styles.title} />
        </div>
      </div>
    </div>
  ))
}