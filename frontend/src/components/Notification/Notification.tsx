import ButtonClose from "../ButtonClose/ButtonClose";
import { X, Check } from "lucide-react";

import styles from "./Notification.module.scss";
import { useEffect } from "react";

type NotificationType = "success" | "error";

export interface NotificationData {
  type: NotificationType | null;
  title: string | null;
  message?: string | null;
}

interface NotificationProps extends NotificationData {
  isOpen: boolean;
  onClose: () => void | null;
}

export default function Notification({ isOpen, type, title, message, onClose }: NotificationProps) {
  const isSuccess = type === "success";
  const isError = type === "error";
  const existTime = 4000;

  if (!isOpen) return null;

  useEffect(() => {
    setTimeout(() => onClose(), existTime);
  }, []);
    
  return (
    <div className={styles.notification}>
      <div className={styles.notificationContainer}>
        <header className={styles.notificationHead}>
          <div className={styles.iconWrapper}>
            {isSuccess && <Check size={15} className={styles.icon} />}
            {isError && <X size={15} className={styles.icon} />}
          </div>

          <h4 className={styles.notificationTitle}>{title}</h4>

          <ButtonClose className={styles.notificationClose} iconSize={12} onClick={onClose} />
        </header>

        {message && <p className={styles.notificationMessage}>{message}</p>}
      </div>
    </div>
  );
}