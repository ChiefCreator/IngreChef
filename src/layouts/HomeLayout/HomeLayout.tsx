import { Outlet } from "react-router-dom";

import Container from "../../components/Container/Container";
import Sidebar from "./../../components/Sidebar/Sidebar";

import styles from "./HomeLayout.module.scss";

export default function HomeLayout() {

  return (
    <div className={styles.layout}>
      <Container>
        <div className={styles.layoutMainContent}>
          <Sidebar className={styles.layoutSidebar} />
    
            <div className={styles.layoutContent}>
              <Outlet />
            </div>
        </div>
      </Container>
    </div>
  );
}