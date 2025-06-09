import styles from "./EntitiesNotFound.module.scss"

interface EntitiesNotFoundProps {
  illustration?: React.ReactNode;
  description?: string;
  controls?: React.ReactNode[];

  descriptionClassName?: string;
}

export default function EntitiesNotFound({ illustration, description, controls, descriptionClassName }: EntitiesNotFoundProps) {

  return (
    <div className={styles.container}>
      {illustration}

      {description && <p className={`${styles.containerText} ${descriptionClassName}`}>{description}</p>}

      {controls?.length && (
        <div className={styles.controls}>
          {controls.map((control, i) => (
            <div key={i}>
              {control}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}