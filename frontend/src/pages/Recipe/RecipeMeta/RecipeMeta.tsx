import styles from "./RecipeMeta.module.scss";

interface RecipeMetaProps {
  className?: string;
  icon: React.ReactNode;
  label: string;
  selectedValue?: string;
}

export default function RecipeMeta({ className = "", icon, label, selectedValue }: RecipeMetaProps) {
  return (
    <div className={`${styles.meta} ${className}`}>
      <div className={styles.metaIconWrapper}>{icon}</div>

      <span className={styles.metaLabel}>{label}</span>

      {selectedValue && <span className={styles.metaSelectedValue}>{selectedValue}</span>}
    </div>
  );
}