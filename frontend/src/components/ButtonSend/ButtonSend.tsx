import { useState, useRef, useEffect } from "react";

import styles from "./ButtonSend.module.scss";

export type LoadingStatus = "loading" | "success" | "error" | "idle";

interface ButtonSendProps {
  className?: string;
  children: React.ReactNode;
  status: LoadingStatus;
  titleProps?: {
    loading: string;
    success: string;
    error: string;
  }

  setStatus: (status: LoadingStatus) => void;
}

export default function ButtonSend({ className = "", children, status, titleProps, setStatus }: ButtonSendProps) {
  const [title, setTitle] = useState(children);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRectRef = useRef<DOMRect>(undefined);
  const titleRectRef = useRef<DOMRect>(undefined);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";


  function calcTitleOffset(buttonRect: DOMRect | undefined, titleRect: DOMRect | undefined, offset: number) {
    if (!buttonRect || !titleRect) return 0;

    return buttonRect.left - titleRect.left + window.scrollX + offset;
  }

  useEffect(() => {
    buttonRectRef.current = buttonRef?.current?.getBoundingClientRect();
    titleRectRef.current = titleRef?.current?.getBoundingClientRect();
  }, []);
  useEffect(() => {
    switch(status) {
      case "loading": {
        setTitle(titleProps?.["loading"] ?? "Отправка...");

        titleRef.current!.style.transform = `translate(${calcTitleOffset(buttonRectRef.current, titleRectRef.current, 10)}px, 0)`;

        break;
      }
      case "success": {
        setTitle(titleProps?.["success"] ?? "Успешно");
        
        setTimeout(() => {
          setTitle(children);
          setStatus("idle");

          titleRef.current!.style.transform = "translate(0, 0)";
        }, 1000);

        break;
      }
      case "error": {
        setTitle(titleProps?.["error"] ?? "Ошибка");
        
        setTimeout(() => {
          setTitle(children);
          setStatus("idle");

          titleRef.current!.style.transform = "translate(0, 0)";
        }, 1000);

        break;
      }
    }
  }, [status, setTitle]);

  return (
    <button className={`${styles.button} ${className}`} type="submit" ref={buttonRef}>
      <div className={styles.buttonTitleWrapper}>
        <span className={styles.buttonTitle} ref={titleRef}>{title}</span>
        <span className={styles.buttonHiddenDefaultTitle}>{children}</span>
      </div>
      <span className={styles.buttonHiddenDefaultTitle}>{children}</span>

      <div className={styles.buttonState}>
        {isLoading && 
        <span className={styles.loader}>
          <svg className={styles.loaderIcon} viewBox="22 22 44 44" xmlns="http://www.w3.org/2000/svg"><circle cx="44" cy="44" r="20.2"></circle></svg>
        </span>}

        {isSuccess && 
        <div className={styles.success}>
          <svg className={styles.successIcon} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 511.985 511.985"><path d="M500.088 83.681c-15.841-15.862-41.564-15.852-57.426 0L184.205 342.148 69.332 227.276c-15.862-15.862-41.574-15.862-57.436 0-15.862 15.862-15.862 41.574 0 57.436l143.585 143.585c7.926 7.926 18.319 11.899 28.713 11.899 10.394 0 20.797-3.963 28.723-11.899l287.171-287.181c15.862-15.851 15.862-41.574 0-57.435z"></path></svg>
        </div>}

        {isError && 
        <div className={styles.error}>
          <svg className={styles.errorIcon} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 329.269 329"><path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.266 21.266 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.273 21.273 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0"></path></svg>
        </div>}
      </div>
    </button>
  );
}