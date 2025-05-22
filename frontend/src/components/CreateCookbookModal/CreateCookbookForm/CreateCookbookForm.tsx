import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';

import { selectUserId } from "../../../features/auth/authSlice";
import { useAppSelector } from "../../../app/hooks";

import InputField from "../../InputField/InputField";

import { useCreateCookbookMutation } from '../../../features/api/cookbooksApi/cookbooksApi';
import { createCookbookSchema } from './createCookbookSchema';

import { getRandomColorPalette } from '../../../lib/dataUtils';

import styles from "./CreateCookbookForm.module.scss";

interface CreateCookbookFormProps {
  formId: string;
  closeModal: () => void;
}
interface FormData {
  cookbookName: string;
}

export default function CreateCookbookForm({ formId, closeModal }: CreateCookbookFormProps) {
  const userId = useAppSelector(selectUserId);
  const { control, reset, handleSubmit, formState: { errors }, } = useForm<FormData>({
    resolver: zodResolver(createCookbookSchema),
  })

  const [createCookbook] = useCreateCookbookMutation();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createCookbook({
      userId,
      cookbookId: crypto.randomUUID(),
      name: data.cookbookName,
      colorPalette: getRandomColorPalette()
    });
    reset();

    closeModal?.();
  };

  return (
    <form className={styles.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="cookbookName"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <InputField
            label="Название книги"
            error={errors.cookbookName?.message}
            inputProps={{
              ...field,
              id: "cookbook-title",
              placeholder: "Введите название книги",
            }}
          />
        )}
      />
    </form>
  );
}
