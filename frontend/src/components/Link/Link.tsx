import { Link as RouterLink } from "react-router-dom";

import styles from "./Link.module.scss";

interface LinkProps {
  className?: string;
  to: string;
  children: React.ReactNode;
  isExternal?: boolean;
}

export default function Link({ className, to, children, isExternal = false }: LinkProps) {
  if (isExternal) {
    return <a className={`${styles.link} ${className}`} href={to}>{children}</a>
  }

  return (
    <RouterLink className={`${styles.link} ${className}`} to={to}>{children}</RouterLink>
  );
}