import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';


import styles from "./NoImage.module.scss";

type Icon = { className?: string; } & LucideProps;

interface NoImageProps {
  className?: string;
  Icon: ComponentType<Icon>;
  size?: string;
}

export default function NoImage({ className = "", Icon, size = "50%" }: NoImageProps) {
  return (
    <div className={`${styles.noImage} ${className}`}>
      <Icon className={styles.noImageIcon} size={size} />
    </div>
  );
}