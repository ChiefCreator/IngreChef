import styles from "./Button.module.scss";

interface ButtonProps {
  variant?: "primary" | "outline" | "text" | "ghost";
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;

  type?: "button" | "submit" | "reset";
  form?: string;
  
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({ variant = "primary", className = "", children, icon, type = "button", form, onClick }: ButtonProps) {
  const variantStyle = variant;

  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      data-style={variantStyle}
      form={form}

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