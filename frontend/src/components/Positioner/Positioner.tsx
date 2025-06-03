import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

import stylesPositioner from "./Positioner.module.scss";

type Origin = {
  vertical: "top" | "center" | "bottom";
  horizontal: "left" | "center" | "right";
};

export interface PositionerProps {
  triggerRef?: React.RefObject<HTMLElement | null> | null;
  anchorOrigin?: Origin;
  transformOrigin?: Origin;
  offsetX?: number;
  offsetY?: number;
  matchTriggerWidth?: boolean;
  position?: {
    left?: number;
    top?: number;
  }
  children?: React.ReactNode;
}

const getOffset = (origin: Origin, size: { width: number; height: number }): { top: number; left: number } => {
  let top = 0;
  let left = 0;

  switch (origin.vertical) {
    case "top":
      top = 0;
      break;
    case "center":
      top = size.height / 2;
      break;
    case "bottom":
      top = size.height;
      break;
  }

  switch (origin.horizontal) {
    case "left":
      left = 0;
      break;
    case "center":
      left = size.width / 2;
      break;
    case "right":
      left = size.width;
      break;
  }

  return { top, left };
};

export default function Positioner({ triggerRef, anchorOrigin = { vertical: "bottom", horizontal: "left" }, transformOrigin = { vertical: "top", horizontal: "left" }, offsetX = 0, offsetY = 0, matchTriggerWidth = false, position, children }: PositionerProps) {
  const [styles, setStyles] = useState<React.CSSProperties>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const calculateStyles = (): React.CSSProperties => {
    const trigger = triggerRef?.current;
    const content = contentRef.current;

    if (!trigger || !content) return {};

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    if (position) {
      return {
        position: "absolute",
        top: position.top,
        left: position.left,
        width: matchTriggerWidth ? triggerRect.width : undefined,
        zIndex: 1000,
      };
    }

    const anchorOffset = getOffset(anchorOrigin, {
      width: triggerRect.width,
      height: triggerRect.height,
    });

    const transformOffset = getOffset(transformOrigin, {
      width: contentRect.width,
      height: contentRect.height,
    });

    const top = triggerRect.top + anchorOffset.top - transformOffset.top + offsetY + window.scrollY;
    const left = triggerRect.left + anchorOffset.left - transformOffset.left + offsetX + window.scrollX;

    return {
      position: "absolute",
      top,
      left,
      width: matchTriggerWidth ? triggerRect.width : undefined,
      zIndex: 1000,
    };
  }
  const updateStyles = useCallback(() => {
    setStyles(calculateStyles());
  }, [setStyles]);

  useLayoutEffect(() => {
    updateStyles();

    window.addEventListener("resize", updateStyles);

    return () => {
      window.removeEventListener("resize", updateStyles);
    };
  }, [updateStyles]);

  return (
    <div className={stylesPositioner.positioner} ref={contentRef} style={styles}>
      {children}
    </div>
  );
};