import Container from "../Container/Container";
import Logo from "../Logo/Logo";
import BurgerMenu from "../BurgerMenu/BurgerMenu";

import styles from "./MobileHeader.module.scss";

interface MobileHeaderProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function MobileHeader({ isOpen, toggle }: MobileHeaderProps) {

  return (
    <header className={`${styles.header}`}>
      <Container>
        <div className={styles.headerContainer}>
          <Logo className={styles.headerLogo} />

          <BurgerMenu isOpen={isOpen} toggle={toggle} />
        </div>
      </Container>
    </header>
  );
}