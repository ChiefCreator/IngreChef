import styles from "./Button.module.scss";

interface ButtonProps {
  type?: "primary" | "outline" | "text" | "ghost";
  className?: string;

  children?: React.ReactNode;
  icon?: React.ReactNode;
  
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({ type = "primary", className = "", children, icon, onClick }: ButtonProps) {
  const typeStyle = type;

  return (
    <button
      className={`${styles.button} ${className}`}
      type="button"
      data-style={typeStyle}

      onClick={onClick}
    >
      {icon && 
        <div className={styles.buttonIconWrapper}>{icon}</div>
      }
      {children && 
        <div className={styles.buttonTitleWrapper}>{children}</div>
      }

    </button>
  );
}