import { useAppSelector } from "../../app/hooks";
import { selectUserId } from "../../features/auth/authSlice";
import { useGetUserQuery } from "../../features/api/userApi/userApi";

import Section from "./Section/Section";
import MyDetailsForm from "./MyDetailsForm/MyDetailsForm";

import styles from "./Profile.module.scss";
import ProfileForm from "./ProfileForm/ProfileForm";

export default function Profile() {
  const userId = useAppSelector(selectUserId);
  const { data } = useGetUserQuery({ userId, include: ["profile"] });

  return (
    <div className={styles.page}>
      <Section
        title="Мои данные"
        description="Управляйте данными своего профиля"
      >
        <MyDetailsForm data={data} />
      </Section>

      <Section
        title="Настройки профиля"
        description="Управляйте настройками своего профиля"
      >
        <ProfileForm data={data?.profile} />
      </Section>
    </div>
  );
}