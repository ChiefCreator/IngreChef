import { motion, AnimatePresence, AnimationSequence, useAnimate } from "motion/react";
import React, { useRef, useState } from "react";

import { useDisableScroll } from "../../app/hooks";

import Positioner from "../Positioner/Positioner";
import Portal from "../Portal/Portal";
import Backdrop from "../Backdrop/Backdrop";

import type { PositionerProps } from "../Positioner/Positioner";

import styles from "./Dropdown.module.scss";
import { useMediaQuery } from "../../app/hooks";
import { useEffect } from "react";

type DropdownProps = {
  isOpen: boolean;
  positionerProps: PositionerProps;
  children: React.ReactNode;
  isAbsolute?: boolean;

  toggle?: (isOpen?: boolean) => void;
};

const staticVariants = {
  close: {
    height: 0
  },
  open: {
    height: "auto"
  }
}

export default React.memo(function Dropdown({ isOpen, positionerProps, children, isAbsolute = true, toggle }: DropdownProps) {
  const isMobile = useMediaQuery("(hover: none)");
  useDisableScroll(isOpen && isMobile);
  const [scope, animate] = useAnimate();
  const [isMounted, setIsMounted] = useState(isOpen);

  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState<number | null>(null);
  const yStart = useRef<number>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    toggle?.(false);
    setDragY(null);
  };
  const animateOnOpen = () => {
    if (!rootRef.current || !layoutRef.current || !scope.current) return;

    const sequence: AnimationSequence = [
      [rootRef.current, { padding: 20 }],
      [layoutRef.current, { borderRadius: 20, overflow: "hidden" }, { at: "<" }],
      [scope.current, { transform: "translateY(0)" }, { at: "<" }]
    ];

    return animate(sequence, { defaultTransition: { ease: "easeOut", duration: .25 } });
  }
  const animateOnClose = () => {
    if (!rootRef.current || !layoutRef.current || !scope.current) return;

    const sequence: AnimationSequence = [
      [scope.current, { transform: "translateY(100%)" }, { at: "<" }],
      [layoutRef.current, { borderRadius: 0, overflow: "visible" }, { at: "<" }],
      [rootRef.current, { padding: 0 }, { at: "<" }],
    ];

    return animate(sequence, { defaultTransition: { ease: "easeOut", duration: .25 } });
  }

  const handlePointerDown = (e: React.TouchEvent) => {
    yStart.current = e.touches[0].clientY;

    setIsDragging(true);
  };
  const handlePointerMove = (e: React.TouchEvent) => {
    if (!isDragging || yStart.current === null) return;
  
    const deltaY = e.touches[0].clientY - yStart.current;

    if (deltaY > 0) {
      setDragY(deltaY);
    }

    animate(scope.current, { transform: `translateY(${deltaY}px)` }, { ease: "linear", duration: 0 });
  };
  const handlePointerUp = () => {
    const dropdownHeightQuarter = scope.current ? scope.current.offsetHeight / 4 : 50;

    if (dragY && dragY > dropdownHeightQuarter) {
      closeMenu();
    } else {
      animateOnOpen();
    }

    setIsDragging(false);
    yStart.current = null;
  };

  // isMobile
  useEffect(() => {
    rootRef.current = document.getElementById("root") as HTMLDivElement;
    layoutRef.current = document.getElementById("home-layout") as HTMLDivElement;
  }, []);
  useEffect(() => {
    if (!isAbsolute || !isMobile) return;

    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isAbsolute || !isMobile) return;

    if (isOpen) {
      setTimeout(() => animateOnOpen(), 100);
    } else {
      if (!scope.current) return;

      animateOnClose()?.then(() => setIsMounted(false));
    }
  }, [isOpen, scope, animate]);

  if (!isAbsolute) {
    return (
      <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`${styles.dropdown} ${!isAbsolute ? styles.dropdownStatic : ""}`}
          initial={"close"}
          animate={"open"}
          exit={"close"}
          variants={staticVariants}
          transition={{
            ease: "easeOut",
            duration: .25
          }}
        >
          {children}
        </motion.div>
      )}
      </AnimatePresence>
    );
  }

  if (!isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <Portal>
            <Positioner {...positionerProps}>
              <motion.div
                className={styles.dropdown}
                ref={scope}
      
                initial={{ opacity: 0, transform: "translateY(20px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                exit={{ opacity: 0, transform: "translateY(20px)" }}
                transition={{ ease: "easeOut", duration: 0.25 }}
              >
                <div className={styles.dropdownContainer}>
                  {isMobile && <div className={styles.dropdownTrigger}></div>}
      
                  <div className={styles.dropdownContent}>{children}</div>
                </div>
              </motion.div>
            </Positioner>
          </Portal>
        )}
      </AnimatePresence>
    )
  }

  if (!isMounted) return null;

  return (
    <Portal>
      {isMobile && <Backdrop isActive={isOpen} onClick={() => toggle?.(false)} />}
    
      <Positioner {...positionerProps}>
        <div
          className={styles.dropdown}
          ref={scope}

          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <div className={styles.dropdownContainer}>
            {isMobile && <div className={styles.dropdownTrigger}></div>}

            <div className={styles.dropdownContent}>{children}</div>
          </div>
        </div>
      </Positioner>
    </Portal>
  )
})