import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

export default function Portal({ children, containerId = "portal-root" }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", containerId);
      document.body.appendChild(container);
    }

    elementRef.current = container;
    setMounted(true);
  }, [containerId]);

  return mounted && elementRef.current ? createPortal(children, elementRef.current) : null;
};
