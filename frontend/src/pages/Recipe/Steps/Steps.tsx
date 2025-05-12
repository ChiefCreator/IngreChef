import { useState } from "react";

import StepSkeleton from "./StepSkeleton/StepSkeleton";
import { Check } from "lucide-react";

import type { Recipe } from "../../../types/recipeTypes";

import styles from "./Steps.module.scss";

interface StepsProps {
  className?: string;
  steps?: Recipe["steps"];
  isLoading?: boolean;
}
interface StepProps {
  title: string;
  time: number;
  description: string;

  index: number;
  isPassed: boolean;
  toggleIsPassed: () => void;
}

function Step({ title, description, time, index, isPassed, toggleIsPassed }: StepProps) {
  return (
    <div 
      className={`${styles.step} ${isPassed ? styles.stepPassed : ""}`}
      onClick={toggleIsPassed}
    >
      <div className={styles.stepHead}>
        <h4 className={styles.stepTitle}>Шаг {index}: {title}</h4>

        <Check className={`${styles.stepCheck} ${isPassed ? styles.stepCheckActive : ""}`} size={18} />
      </div>

      <p className={styles.stepDescription}>{description}</p>
    </div>
  )
}

export default function Steps({ className = "", steps, isLoading }: StepsProps) {
  const [passedSteps, setPassedSteps] = useState<number[]>([]);

  const toggleIsPassed = (index: number) => {
    if (passedSteps.includes(index)) {
      setPassedSteps(passedSteps.filter(i => i !== index));
    } else {
      setPassedSteps([...passedSteps, index]);
    }
  }

  return (
    <div className={`${styles.steps} ${className}`}>
      {steps?.map((step, i) => <Step {...step} key={i} index={i + 1} isPassed={passedSteps.includes(i)} toggleIsPassed={() => toggleIsPassed(i)} />)}

      {isLoading && <StepSkeleton count={6} />}
    </div>
  )
}