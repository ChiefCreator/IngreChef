import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useCallback, useState } from "react";
import { v4 } from "uuid";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUserId } from "../../../features/auth/authSlice";
import { useUpdateProfileMutation } from "../../../features/api/userApi/userApi";
import { addIngredient, selectIngredients } from "../../../features/ingredients/ingredientsSlice";

import Portal from "../../../components/Portal/Portal";
import Notification from "../../../components/Notification/Notification";
import ControlField from "../../../components/ControlField/ControlField";
import InputField from "../../../components/InputField/InputField";
import SelectField from "../../../components/SelectField/SelectField";
import SearchIngredients from "../../../components/SearchIngredients/SearchIngredients";

import { isApiError } from "../../../types/queryTypes";
import { genderData } from "../../../data/genderData";
import { cookingLevelsData } from "../../../data/cookingLevelsData";
import { schema, type FormData } from "./schema";
import type { ProfileSettings } from "../../../features/api/userApi/userApiTypes";
import type { Option } from "../../../components/DropdownSelect/DropdownSelect";
import type { Ingredient } from "../../../types/ingredientTypes";
import type { NotificationData } from "../../../components/Notification/Notification";

import styles from "./ProfileForm.module.scss";
import Button from "../../../components/Button/Button";

const formId = "profile-form";

interface ProfileFormProps {
  data?: ProfileSettings;
}

export default React.memo(function ProfileForm({ data }: ProfileFormProps) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);
  const ingredients = useAppSelector(selectIngredients);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData>({ type: null, title: null, message: null });
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [updateUserProfile] = useUpdateProfileMutation();

  const onSubmit = async (formData: FormData) => {
    const transformedData: FormData = {
      ...formData,
      allergies: ingredients.filter(ingredient => formData.allergies?.includes(ingredient.id)).map(ingredient => ingredient.title),
    }

    function getUpdatedFields<T>(original: T, incoming: Partial<T>): Partial<T> {
      const updated: Partial<T> = {};

      for (const key of Object.keys(incoming) as (keyof T)[]) {
        const newValue = incoming[key];
        if (newValue !== undefined && newValue !== original[key]) {
          updated[key] = newValue;
        }
      }
      return updated;
    }
    
    const updatedFields = getUpdatedFields<ProfileSettings>(data ?? {}, transformedData);

    if (Object.keys(updatedFields).length === 0) return;

    const response = await updateUserProfile({ userId, data: updatedFields });

    if (response.error) {
      const error = response.error;

      setNotificationData({
        type: "error",
        title: "Не удалось обновить настройки профиля",
        message: isApiError(error) ? error.data.message : error.message,
      });
    } else {
      setNotificationData({
        type: "success",
        title: "Настройки профиля обновлены",
      });
    }

    setIsNotificationOpen(true);
  }
  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, [setIsNotificationOpen]);

  useEffect(() => {
    if (!data || !ingredients) return;

    const allergies = data.allergies?.map(ingredientTitle => {
      const id = ingredients.find(i => i.title === ingredientTitle)?.id;

      if (id) {
        return id;
      } else {
        const id = v4();
        const ingredient: Ingredient = { id, title: ingredientTitle };

        dispatch(addIngredient(ingredient));

        return id;
      }
    });

    reset({
      gender: data.gender ?? undefined,
      age: data.age,
      weight: data.weight,
      height: data.height,
      cookingLevel: data.cookingLevel ?? undefined,
      allergies,
    });
  }, [data, ingredients, reset]);

  return (
    <>
      <form className={styles.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
        <fieldset className={styles.inputGroup}>
          <Controller
            name="gender"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectField
                label="Какой у вас пол?"
                selectProps={{
                  options: genderData,
                  placeholder: "Выберите пол",
                  selectedValue: field.value,
                  onChange: field.onChange,
                }}
              />
            )}
          />
          <Controller
            name="age"
            control={control}
            rules={{ required: true }}
            render={({ field }) => 
              <InputField
                label="Какой у вас возраст?"
                error={errors.age?.message}
                inputProps={{
                  type: "number",
                  className: styles.inputName,
                  placeholder: "Введите возраст",
                  ...field,
                }}
              />}
          />
          <Controller
            name="weight"
            control={control}
            rules={{ required: true }}
            render={({ field }) => 
              <InputField
                label="Какой у вас вес?"
                error={errors.weight?.message}
                inputProps={{
                  type: "number",
                  className: styles.inputName,
                  placeholder: "Введите вес",
                  ...field,
                }}
              />}
          />
          <Controller
            name="height"
            control={control}
            rules={{ required: true }}
            render={({ field }) => 
              <InputField
                label="Ваш рост"
                error={errors.height?.message}
                inputProps={{
                  type: "number",
                  className: styles.inputName,
                  placeholder: "Введите рост",
                  ...field,
                }}
              />}
          />
          <Controller
            name="cookingLevel"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectField
                label="Какой у вас уровень готовки?"
                selectProps={{
                  options: cookingLevelsData,
                  placeholder: "Выберите уровень готовки",
                  selectedValue: field.value,
                  onChange: field.onChange,
                }}
              />
            )}
          />
          <Controller
            name="allergies"
            control={control}
            render={({ field }) => 
              <ControlField label="На что у вас аллергия?">
                <SearchIngredients
                  selectedValues={field.value ?? []}
                  onSelectIngredient={(values: Option["value"][]) => {
                    field.onChange(values);
                  }}
                />
              </ControlField>
            }
          />
        </fieldset>
  
        <Button className={styles.buttonSend} type="submit" form={formId}>Сохранить</Button>
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
})