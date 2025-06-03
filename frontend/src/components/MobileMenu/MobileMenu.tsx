import { motion, useAnimate, AnimatePresence } from "motion/react";

import Container from "../Container/Container";
import Portal from "../Portal/Portal";

import styles from "./MobileMenu.module.scss";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MobileMenu({ isOpen }: MobileMenuProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            className={styles.menu}
            initial={{ left: "100%" }}
            exit={{ left: "100%" }}
            animate={{ left: 0 }}
            transition={{ ease: "easeOut" }}
          >
            <Container>
              <div className={styles.menuContainer}>
      
              </div>
            </Container>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}