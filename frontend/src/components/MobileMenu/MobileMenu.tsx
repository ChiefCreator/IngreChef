import { motion, AnimatePresence } from "motion/react";

import Container from "../Container/Container";
import Portal from "../Portal/Portal";
import Tabs from "./Tabs/Tabs";
import Profile from "../../pages/Profile/Profile";
import Preferences from "../../pages/Preferences/Preferences";

import type { Tab } from "./Tabs/Tabs";

import styles from "./MobileMenu.module.scss";
import { useMemo } from "react";
import { useDisableScroll } from "../../app/hooks";

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MobileMenu({ isOpen }: MobileMenuProps) {
  useDisableScroll(isOpen);
  const tabsData = useMemo<Tab[]>(() => [
    {
      id: "profile",
      title: "Профиль",
      content: <Profile />,
    },
    {
      id: "preferences",
      title: "Предпочтения",
      content: <Preferences />,
    }
  ], []);

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
            <Container className={styles.menuContainer}>
              <Tabs tabs={tabsData} />
            </Container>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}