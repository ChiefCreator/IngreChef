import styles from "./EntitiesNotFound.module.scss"

interface EntitiesNotFoundProps {
  illustration?: React.ReactNode;
  description?: string;
  controls?: React.ReactNode[];
}

export default function EntitiesNotFound({ illustration, description, controls }: EntitiesNotFoundProps) {

  return (
    <div className={styles.container}>
      {illustration}

      {description && <p className={styles.containerText}>{description}</p>}

      {controls?.length && (
        <div className={styles.controls}>
          {controls.map(control => control)}
        </div>
      )}
    </div>
  );
}