import RegisterForm from "./RegisterForm/RegisterForm";

import styles from "./Register.module.scss";

export default function Register() {
  return (
    <div className={styles.page}>
      <RegisterForm />
    </div>
  );
}