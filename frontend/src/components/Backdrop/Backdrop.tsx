import { motion, AnimatePresence } from "motion/react";

import styles from "./Backdrop.module.scss";

interface BackdropProps {
  isActive: boolean;
  onClick?: () => void;
}

export default function Backdrop({ isActive, onClick }: BackdropProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={styles.backdrop}
          onClick={onClick}

          initial={{ opacity: 0 }}
          exit={{
            opacity: 0,
          }}
          animate={{ opacity: .5 }}
          transition={{
            ease: "easeOut",
            duration: .4
          }}
        />
      )}
    </AnimatePresence>
  );
}