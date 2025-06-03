import { Ref } from "react";

import { Link } from "react-router-dom";
import styles from "./NavigationItem.module.scss";

interface NavigationItemProps {
  className?: string;
  ref: Ref<HTMLAnchorElement> | undefined;
  id: string;
  title: string;
  icon: React.ReactNode;
  to: string;
  isActive: boolean;

  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function NavigationItem({ className, ref, id, title, icon, to, isActive, onClick }: NavigationItemProps) {

  return (
    <Link className={`${styles.item} ${className} ${isActive ? styles.itemActive : ""}`} to={to} onClick={onClick} id={id} ref={ref}>
      {icon}

      <span className={styles.itemTitle}>{title}</span>
    </Link>
  );
}