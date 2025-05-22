import LoginForm from "./LoginForm/LoginForm";

import styles from "./Login.module.scss";

export default function Login() {
  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  );
}