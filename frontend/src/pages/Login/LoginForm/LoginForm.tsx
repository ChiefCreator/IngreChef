import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "../../../features/api/apiSlice.ts";

import InputField from "../../../components/InputField/InputField";
import Button from "../../../components/Button/Button";
import Link from "../../../components/Link/Link";
import Portal from "../../../components/Portal/Portal.tsx";
import Notification from "../../../components/Notification/Notification.tsx";

import type { FormData } from "./schema.ts";
import type { NotificationData } from "../../../components/Notification/Notification.tsx";
import { isApiError } from "../../../types/queryTypes.ts";

import { schema } from "./schema.ts";
import styles from "./LoginForm.module.scss";
import { useCallback, useState } from "react";

export default function LoginForm() {
  const { control, handleSubmit, clearErrors, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData>({
    type: null,
    title: null,
    message: null,
  });

  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, [setIsNotificationOpen]);

  const handleLogin = async (data: FormData) => {
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
  
        <Button className={styles.formButton} type="submit">
          Войти
        </Button>
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