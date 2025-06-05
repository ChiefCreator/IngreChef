import { AnimationSequence, useAnimate } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

import { useDisableScroll } from "../../app/hooks";

import Positioner from "../Positioner/Positioner";
import Portal from "../Portal/Portal";
import Backdrop from "../Backdrop/Backdrop";

import styles from "./MobilePopup.module.scss";

interface MobilePopupProps {
  isOpen: boolean;
  children: React.ReactNode;
  
  toggle?: (isOpen?: boolean) => void;
}

export default function MobilePopup({ isOpen, children, toggle }: MobilePopupProps) {
  useDisableScroll(isOpen);
  const [scope, animate] = useAnimate();
  const [isMounted, setIsMounted] = useState(isOpen);

  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState<number | null>(null);
  const yStart = useRef<number>(null);

  const closeMenu = () => {
    toggle?.(false);
    setDragY(null);
  };
  const animateOnOpen = () => {
    if (!scope.current) return;

    const sequence: AnimationSequence = [
      [scope.current, { transform: "translateY(0)" }, { at: "<" }]
    ];

    return animate(sequence, { defaultTransition: { ease: "easeOut", duration: .25 } });
  }
  const animateOnClose = () => {
    if (!scope.current) return;

    const sequence: AnimationSequence = [
      [scope.current, { transform: "translateY(100%)" }, { at: "<" }],
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

      animate(scope.current, { transform: `translateY(${deltaY}px)` }, { ease: "linear", duration: 0 });
    }
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

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      
      setTimeout(() => animateOnOpen(), 100);
    } else {
      if (!scope.current) return;

      animateOnClose()?.then(() => setIsMounted(false));
    }
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <Portal>
      <Backdrop isActive={isOpen} onClick={() => toggle?.(false)} />
    
      <Positioner>
        <div
          className={styles.dropdown}
          ref={scope}

          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <div className={styles.dropdownContainer}>
            <div className={styles.dropdownTrigger}></div>

            <div className={styles.dropdownContent}>{children}</div>
          </div>
        </div>
      </Positioner>
    </Portal>
  );
}