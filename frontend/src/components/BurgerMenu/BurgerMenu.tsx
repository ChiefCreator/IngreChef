import { motion, useAnimate, AnimationSequence } from "motion/react";

import styles from "./BurgerMenu.module.scss";
import { useEffect, useRef } from "react";

interface BurgerMenu {
  isOpen: boolean;
  toggle: () => void;
}

export default function BurgerMenu({ isOpen, toggle }: BurgerMenu) {
  const [scope, animate] = useAnimate();
  const linesRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const lines = scope.current?.querySelectorAll(`.${styles.menuLine}`);
    if (!lines) return;

    linesRef.current = Array.from(lines) as HTMLSpanElement[];
  }, []);

  useEffect(() => {
    const [topLine, bottomLine] = linesRef.current;

    if (!topLine || !bottomLine) return;

    const openSequence: AnimationSequence = [
      [topLine, { top: "50%" }],
      [bottomLine, { top: "50%" }, { at: 0 }],
      [topLine, { rotate: "45deg" }],
      [bottomLine, { width: "100%", rotate: "-45deg" }, { at: "<" }],
    ]

    const closeSequence: AnimationSequence = [
      [topLine, { rotate: 0 }],
      [bottomLine, { width: "50%", rotate: 0 }, { at: "<" }],
      [topLine, { top: "33.3%" }],
      [bottomLine, { top: "66.6%" }, { at: "<" }],
    ]

    animate(isOpen ? openSequence : closeSequence, { defaultTransition: { ease: "easeOut" } });
  }, [isOpen, animate])

  return (
    <button className={styles.menu} onClick={toggle} ref={scope}>
      <div className={styles.menuContainer}>
        <motion.span
          className={styles.menuLine}
          initial={{
            top: "33.3%",
            rotate: 0,
            width: "100%"
          }}
        />
        <motion.span
          className={styles.menuLine}
          initial={{
            top: "66.6%",
            rotate: 0,
            width: "50%"
          }}       
        />
      </div>
    </button>
  );
}