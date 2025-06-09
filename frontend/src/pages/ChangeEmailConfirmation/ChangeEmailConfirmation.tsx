import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import { useConfirmEmailChangeQuery } from "../../features/api/authApi/authApi";
import { setUser, setAccessToken, setAuth } from "../../features/auth/authSlice";

import Button from "../../components/Button/Button";
import Skeleton from "react-loading-skeleton";

import styles from "./ChangeEmailConfirmation.module.scss";
import successImgSrc from "./../../assets/images/success-email-confirm.svg";
import errorImgSrc from "./../../assets/images/error-email-confirmation.svg";

export default function ChangeEmailConfirmation() {
  const { activationCode } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data, isLoading, isSuccess, isError } = useConfirmEmailChangeQuery(activationCode!);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data!.user));
      dispatch(setAccessToken(data!.accessToken));
      dispatch(setAuth(true));
    }
  }, [data, isSuccess]);

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.panelHead}>
          <div className={styles.panelImgWrapper}>
            {isSuccess && <img className={styles.panelImg} src={successImgSrc}></img>}
            {isError && <img className={styles.panelImg} src={errorImgSrc}></img>}
            {isLoading && <Skeleton className={styles.panelImgSkeleton} />}
          </div>

          {isSuccess && <h1 className={styles.panelTitle}>Email-адрес успешно изменен</h1>}
          {isError && <h1 className={styles.panelTitle}>Ошибка изменения email-адреса</h1>}
          {isLoading && <h1 className={styles.panelTitle}><Skeleton /></h1>}
        </header>

        <div className={styles.panelBody}>
          {isSuccess && (
            <Button
              className={styles.panelButton}
              variant="primary"
              onClick={() => navigate("/")}
            >
              Кликни здесь, чтобы попасть в приложение
            </Button>
          )}
          {isError && (
            <Button
              className={styles.panelButtonError}
              variant="primary"
              onClick={() => navigate("/auth/register")}
            >
              Вернуться на панель регистрации
            </Button>
          )}
          {isLoading && <Skeleton className={styles.panelButton} />}
        </div>
      </div>
    </div>
  );
}