import styles from "./StepSkeleton.module.scss";
import Skeleton from "react-loading-skeleton";

export default function StepSkeleton({ count = 6 }: { count?: number }) {
  return Array(count).fill(0).map((_, i) => (
    <div className={styles.step} key={i}>
      <div className={styles.stepHead}>
        <h4 className={styles.stepTitle}>
          <Skeleton />
        </h4>
      </div>

      <p className={styles.stepDescription}>
        <Skeleton count={3} />
      </p>
    </div>
  ))
}