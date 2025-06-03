import { Outlet } from "react-router-dom";

import Container from "../../components/Container/Container";

import styles from "./AuthLayout.module.scss";

export default function AuthLayout() {

  return (
    <div className={styles.layout}>
      <Container>
        <div className={styles.layoutContainer}>
          <div className={styles.layoutContent}>
            <Outlet />
          </div>
        </div>
      </Container>
    </div>
  );
}