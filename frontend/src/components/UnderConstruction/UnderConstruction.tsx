import styles from "./UnderConstruction.module.scss";
import soon from "./../../assets/images/soon.svg";

export default function UnderConstruction() {
  return (
    <div className={styles.underConstruction}>
      <img className={styles.underConstructionImg} src={soon} alt="Soon" />

      <h2 className={styles.underConstructionTitle}>Раздел в разработке</h2>
        
      <p className={styles.underConstructionDescription}>Мы активно работаем над этим разделом. Пожалуйста, загляните позже!</p>
    </div>
  );
}