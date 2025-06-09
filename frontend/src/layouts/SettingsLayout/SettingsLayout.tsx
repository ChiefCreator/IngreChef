import { Outlet } from "react-router-dom";
import Container from "../../components/Container/Container";
import NavigateButtons from "./NavigateButtons/NavigateButtons";

import styles from "./SettingsLayout.module.scss";

export default function SettingsLayout() {

  return (
    <section className={styles.layout}>
      <Container className={styles.layoutContainer}>
        <h1 className={styles.layoutTitle}>Настройки</h1>

        <NavigateButtons className={styles.layoutNavigateButtons} />

        <div className={styles.page}>
          <Outlet />
        </div>
      </Container>
    </section>
  );
}
