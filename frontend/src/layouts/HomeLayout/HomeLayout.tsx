import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "../../app/hooks";

import Container from "../../components/Container/Container";
import Sidebar from "./../../components/Sidebar/Sidebar";
import NavigationMobileMenu from "../../components/NavigationMobileMenu/NavigationMobileMenu";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import MobileMenu from "../../components/MobileMenu/MobileMenu";

import styles from "./HomeLayout.module.scss";

export default function HomeLayout() {
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, [setIsMobileMenuOpen]);
  
  return (
    <div className={styles.layout} id="home-layout">
      {!isDesktop && (
        <>
          <MobileHeader isOpen={isMobileMenuOpen} toggle={toggle} />
          <MobileMenu isOpen={isMobileMenuOpen} />
        </>
      )}

      <Container>
        <div className={styles.layoutMainContent}>
          <Sidebar className={styles.layoutSidebar} isDesktop={isDesktop} />
    
            <div className={styles.layoutContent}>
              <Outlet />
            </div>
        </div>
      </Container>

      <NavigationMobileMenu />
    </div>
  );
}