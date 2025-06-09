import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../app/hooks";
import { selectUserId } from "../../../features/auth/authSlice";
import { useUpdateProfileMutation } from "../../../features/api/userApi/userApi";
import { useRequestEmailChangeMutation } from "../../../features/api/authApi/authApi";

import InputField from "../../../components/InputField/InputField";

import { schema, type FormData } from "./schema";
import type { Profile, User } from "../../../features/api/userApi/userApiTypes";

import styles from "./MyDetailsForm.module.scss";
import Button from "../../../components/Button/Button";

interface MyDetailsFormProps {
  data?: User;
}

const formId = "details-form";

export default React.memo(function MyDetailsForm({ data }: MyDetailsFormProps) {
  const userId = useAppSelector(selectUserId);
  const navigate = useNavigate();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
    },
    resolver: zodResolver(schema),
  });
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const [updateUserProfile] = useUpdateProfileMutation();
  const [requestChangeEmail, { isSuccess: isChangeEmailSuccess, isError: isChangeEmailError }] = useRequestEmailChangeMutation();


  const onSubmit = async (formData: FormData) => {
    if (!data?.profile) return;

    const { name, email } = formData;
    const updatedProfileFields: Partial<Profile> = {};

    if (name !== data.profile.name) {
      updatedProfileFields.name = name;
    }

    if (email !== data.email) {
      setPendingEmail(email); 
      await requestChangeEmail({ newEmail: email });
    }

    if (Object.keys(updatedProfileFields).length === 0) return;

    await updateUserProfile({ userId, data: updatedProfileFields });
  }

  useEffect(() => {
    if (!data) return;

    reset({
      name: data.profile?.name,
      email: data.email,
    });
  }, [data, reset]);
  useEffect(() => {
    if (isChangeEmailSuccess && pendingEmail) {
      navigate("/auth/email-confirmation-request", { state: { email: pendingEmail } });
    }
  }, [pendingEmail, isChangeEmailSuccess, isChangeEmailError]);

  return (
    <form className={styles.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles.inputGroup}>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => 
            <InputField
              label="Ваше имя"
              error={errors.name?.message}
              inputProps={{
                className: styles.inputName,
                placeholder: "Введите имя",
                ...field,
              }}
            />}
        />
        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field }) => 
             <InputField
              label="Ваш email-адрес"
              error={errors.email?.message}
              inputProps={{
                className: styles.inputName,
                placeholder: "Введите email-адрес",
                ...field,
              }}
            />
          }
        />
      </fieldset>

      <Button className={styles.buttonSend} type="submit" form={formId}>Сохранить</Button>
    </form>
  );
})