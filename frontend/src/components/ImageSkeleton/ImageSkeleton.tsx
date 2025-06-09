import Skeleton from 'react-loading-skeleton';

import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';


import styles from "./ImageSkeleton.module.scss";

type Icon = { className?: string; } & LucideProps;

interface ImageSkeletonProps {
  Icon: ComponentType<Icon>;
  size?: string;
}

export default function ImageSkeleton({ Icon, size = "50%" }: ImageSkeletonProps) {
  return (
    <div className={styles.skeleton}>
      <Skeleton containerClassName={styles.skeletonItem} className={styles.skeletonItem} />
      <Icon className={styles.skeletonIcon} size={size} />
    </div>
  );
}