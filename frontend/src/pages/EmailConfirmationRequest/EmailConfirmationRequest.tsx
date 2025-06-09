import { useLocation } from "react-router-dom";
import { useCallback } from "react";

import Button from "../../components/Button/Button";
import Link from "../../components/Link/Link";

import styles from "./EmailConfirmationRequest.module.scss";
import imgSrc from "./../../assets/images/confirm-email.svg";

export default function ConfirmEmail() {
  const { state } = useLocation();
  const email = state.email as string;

  const buttonClick = useCallback(() => {
    window.location.href = `mailto:${email}`;
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.panelHead}>
          <img className={styles.panelImg} src={imgSrc}></img>

          <h1 className={styles.panelTitle}>Пожалуйста подтвердите свой email-адрес</h1>

          <span className={styles.panelDescription}>Проверьте свой email <Link to={`mailto:${email}`} isExternal={true} className={styles.panelDescriptionEmail}>{email}</Link> для получения ссылки на активацию учетной записи.</span>
        </header>

        <div className={styles.panelBody}>
          <Button
            className={styles.panelButton}
            variant="primary"
            onClick={buttonClick}
          >
            Перейти в мой email
          </Button>
        </div>
      </div>
    </div>
  );
}