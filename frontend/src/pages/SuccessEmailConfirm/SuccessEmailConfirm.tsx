import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import { setUserIsActivated } from "../../features/auth/authSlice";
import { useActivateMutation } from "../../features/api/apiSlice";

import Button from "../../components/Button/Button";

import styles from "./SuccessEmailConfirm.module.scss";
import imgSrc from "./../../assets/images/success-email-confirm.svg";

export default function SuccessEmailConfirm() {
  const { activationCode } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activate] = useActivateMutation();

  const buttonClick = useCallback(() => {
    navigate("/");
  }, []);

  useEffect(() => {
    const activateEmail = async () => {
      const res = await activate({ activationCode: activationCode! });

      if (!res.error) {
        dispatch(setUserIsActivated(true));
      }
    }
    
    activateEmail();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.panelHead}>
          <img className={styles.panelImg} src={imgSrc}></img>

          <h1 className={styles.panelTitle}>Email-адрес успешно подтвержден!</h1>
        </header>

        <div className={styles.panelBody}>
          <Button
            className={styles.panelButton}
            variant="primary"
            onClick={buttonClick}
          >
            Кликни здесь, чтобы попасть в приложение
          </Button>
        </div>
      </div>
    </div>
  );
}