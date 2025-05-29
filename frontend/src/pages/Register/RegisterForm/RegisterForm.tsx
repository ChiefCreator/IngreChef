import { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegisterMutation } from "../../../features/api/authApi/authApi.ts";

import InputField from "../../../components/InputField/InputField";
import Checkbox from "../../../components/Checkbox/Checkbox";
import ButtonSend from "../../../components/ButtonSend/ButtonSend";
import Link from "../../../components/Link/Link";
import Portal from "../../../components/Portal/Portal.tsx";
import Notification from "../../../components/Notification/Notification.tsx";

import type { RegisterFormData } from "./schema";
import type { NotificationData } from "../../../components/Notification/Notification";
import type { LoadingStatus } from "../../../components/ButtonSend/ButtonSend.tsx";
import { isApiError } from "../../../types/queryTypes.ts";

import { schema } from "./schema";
import styles from "./RegisterForm.module.scss";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData>({
    type: null,
    title: null,
    message: null,
  });
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const navigate = useNavigate();
  const { control, handleSubmit, reset, clearErrors, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
    resolver: zodResolver(schema),
  });

  const [register, { isLoading, isSuccess, isError }] = useRegisterMutation();

  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, [setIsNotificationOpen]);
  const updateButtonStatus = useCallback((status: LoadingStatus) => {
    setLoadingStatus(status);
  }, [loadingStatus]);

  const handleRegister = async (data: RegisterFormData) => {
    if (loadingStatus !== "idle") return;

    const response = await register(data);

    if (!response.error) {
      setNotificationData({
        type: "success",
        title: "Регистрация выполнена",
        message: "Вы успешно зарегистрировали аккаунт",
      });

      navigate("/auth/confirm-email", { state: { email: data.email } });

      reset();
      clearErrors();
    } else {
      const error = response.error;
      
      if (isApiError(error)) {
        setNotificationData({
          type: "error",
          title: "Не удалось зарегистрироваться",
          message: error.data.message,
        });
      } else {
        setNotificationData({
          type: "error",
          title: "Не удалось зарегистрироваться",
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
      <form className={`${styles.form}`} onSubmit={handleSubmit(handleRegister)}>
        <header className={styles.formHeader}>
          <h2 className={styles.formTitle}>Создать аккаунт</h2>
          <span className={styles.formSubTitle}>Уже есть аккаунт? Войдите, чтобы продолжить! <Link className={styles.formSubTitleLink} to="/auth/login">Войти</Link>.</span>
        </header>
  
        <div className={styles.formBody}>
          <fieldset className={styles.formGroup}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => 
                <InputField
                  label="Ваше имя"
                  error={errors?.name?.message}  
                  inputProps={{
                    value: field.value,
                    placeholder: "Введите имя",
                    name: field.name,
                    error: errors?.name?.message,
                    ref: field.ref,
                    onChange: field.onChange,
                  }}
                />
              }
            />
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
          <fieldset className={styles.formCheckboxWrapper}>
            <Controller
              name="terms"
              control={control}
              rules={{ required: true }}
              render={({ field }) => 
                <Checkbox
                  label={
                    <span>
                      Регистрируясь, вы создаете учетную запись IngreChef и соглашаетесь с <span>Условиями использования</span> и <span>Политикой конфиденциальности</span> IngreChef.
                    </span>
                  }
                  isChecked={field.value}
                  id={field.name}
                  name={field.name}
                  error={errors?.terms?.message}
  
                  onChange={field.onChange}
                />}
            />
          </fieldset>
        </div>
  
        <ButtonSend
          className={styles.formButton}
          status={loadingStatus}
          setStatus={updateButtonStatus}
        >
          Зарегистрироваться
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