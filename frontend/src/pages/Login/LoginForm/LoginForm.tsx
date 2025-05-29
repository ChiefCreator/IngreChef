import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "../../../features/api/authApi/authApi.ts";

import InputField from "../../../components/InputField/InputField";
import Link from "../../../components/Link/Link";
import Portal from "../../../components/Portal/Portal.tsx";
import Notification from "../../../components/Notification/Notification.tsx";
import ButtonSend from "../../../components/ButtonSend/ButtonSend";

import type { FormData } from "./schema.ts";
import type { NotificationData } from "../../../components/Notification/Notification.tsx";
import type { LoadingStatus } from "../../../components/ButtonSend/ButtonSend";
import { isApiError } from "../../../types/queryTypes.ts";

import { schema } from "./schema.ts";
import styles from "./LoginForm.module.scss";
import { useCallback, useState, useEffect } from "react";

export default function LoginForm() {
  const { control, handleSubmit, clearErrors, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData>({
    type: null,
    title: null,
    message: null,
  });
  const [login, { isLoading, isSuccess, isError }] = useLoginMutation();

  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, [setIsNotificationOpen]);
  const updateButtonStatus = useCallback((status: LoadingStatus) => {
    setLoadingStatus(status);
  }, [loadingStatus]);

  const handleLogin = async (data: FormData) => {
    if (loadingStatus !== "idle") return;

    const response = await login(data);

    if (!response.error) {
      navigate("/");

      setNotificationData({
        type: "success",
        title: "Вход выполнен",
        message: "Вы успешно вошли в аккаунт",
      });

      reset();
      clearErrors();
    } else {
      const error = response.error;

      if (isApiError(error)) {
        setNotificationData({
          type: "error",
          title: "Не удалось войти",
          message: error.data.message,
        });
      } else {
        setNotificationData({
          type: "error",
          title: "Не удалось войти",
          message: error.message,
        });
      }
    }

    setIsNotificationOpen(true);
  }

  useEffect(() => {
    setLoadingStatus(isLoading ? "loading" : isSuccess ? "success" : isError ? "error" : "idle")
  }, [isLoading, isSuccess, isError]);

  return (
    <>
      <form className={`${styles.form}`} onSubmit={handleSubmit(handleLogin)}>
        <header className={styles.formHeader}>
          <h2 className={styles.formTitle}>Войти в аккаунт</h2>
          <span className={styles.formSubTitle}>Еще нет аккаунта? Создайте его прямо сейчас и откройте для себя все возможности! <Link className={styles.formSubTitleLink} to="/auth/register">Зарегистрироваться</Link>.</span>
        </header>
  
        <div className={styles.formBody}>
          <fieldset className={styles.formGroup}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => 
                <InputField
                  label="E-mail адрес"
                  error={errors?.email?.message}  
                  inputProps={{
                    value: field.value,
                    placeholder: "Введите e-mail адрес",
                    name: field.name,
                    error: errors?.email?.message,
                    ref: field.ref,
                    onChange: field.onChange,
                  }}
                />
              }
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => 
                <InputField
                  label="Пароль"
                  error={errors?.password?.message}  
                  inputProps={{
                    type: "password",
                    value: field.value,
                    placeholder: "Введите пароль",
                    name: field.name,
                    error: errors?.password?.message,
                    ref: field.ref,
                    onChange: field.onChange,
                  }}
                />
              }
            />
          </fieldset>
        </div>
  
        <ButtonSend
          className={styles.formButton}
          status={loadingStatus}
          setStatus={updateButtonStatus}
        >
          Войти
        </ButtonSend>
      </form>

      <Portal>
        <Notification
          isOpen={isNotificationOpen}
          onClose={closeNotification}
          {...notificationData}
        />
      </Portal>
    </>
  );
}