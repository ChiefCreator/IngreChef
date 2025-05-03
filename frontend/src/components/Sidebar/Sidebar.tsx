import { useEffect, useState } from "react";

import Logo from "./../Logo/Logo";
import Menu from "./Menu/Menu";
import ButtonToggle from "./ButtonToggle/ButtonToggle";
import HideElement from "./HideElement/HideElement";
import { ChefHat, ShoppingCart, BookMarked, Compass, Heart, LayoutList, CookingPot } from "lucide-react";

import styles from "./Sidebar.module.scss";

interface SidebarProps {
  className?: string;
}

export interface MenuItemData {
  id: string;
  type: "link" | "buttonOpenDropdown" | "control";
  pathname?: string;
  index?: boolean;
  title: string;
  icon: React.ReactNode;
  children?: MenuItemData[];
  defaultTitle?: string;
}

const menuData_1: MenuItemData[] = [
  {
    id: "item-1",
    type: "link",
    pathname: "/",
    index: true,
    title: "Мои рецепты",
    icon: <ChefHat size={16} />,
  },
  {
    id: "item-2",
    type: "link",
    pathname: "/recipes-list",
    index: true,
    title: "Список рецептов",
    icon: <ChefHat size={16} />,
  },
  {
    id: "item-3",
    type: "link",
    title: "Список покупок",
    pathname: "/shopping-list",
    icon: <ShoppingCart size={16} />,
  },
  {
    id: "item-4",
    type: "link",
    title: "Кулинарные книги",
    pathname: "/cookbooks",
    icon: <BookMarked size={16} />,
  },
  {
    id: "item-5",
    type: "buttonOpenDropdown",
    title: "Список книг",
    icon: <LayoutList size={16} />,
    children: [],
    defaultTitle: "Список книг пуст. Добавьте новую!",
  },
  {
    id: "item-6",
    type: "link",
    title: "Избранные",
    pathname: "/favorites",
    icon: <Heart size={16} />,
  },
  {
    id: "item-7",
    type: "link",
    title: "Подбор рецептов",
    pathname: "/favorites",
    icon: <CookingPot size={16} />,
  },
];
const menuData_2: MenuItemData[] = [
  {
    id: "item-99",
    type: "link",
    pathname: "/discover",
    title: "Лента",
    icon: <Compass size={16} />,
  },
];

export default function Sidebar({ className = "" }: SidebarProps) {
  const [openMenuPath, setOpenMenuPath] = useState([] as string []);
  const [isLogoTitleExist, setIsLogoTitleExist] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isButtonToggleVisible, setIsButtonToggleVisible] = useState(false);

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (target.closest(`.${styles.button}`)) return;

    setOpenMenuPath([]);
  }

  useEffect(() => {
    if (!isOpen) {
      setOpenMenuPath([]);

      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""} ${className}`}
      onMouseEnter={() => setIsButtonToggleVisible(true)}
      onMouseLeave={() => setIsButtonToggleVisible(false)}
    >
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarContent}>
          <HideElement isOpen={isOpen}>
            <Logo className={`${styles.sidebarLogo} ${styles.hideElementByHeight}`} isTitle={isLogoTitleExist} />
          </HideElement>

          <nav className={styles.sidebarNavigation}>
            <div className={styles.sidebarNavigationBlock}>
              <HideElement isOpen={isOpen}>
                <label className={styles.sidebarNavigationLabel}>Моя секция</label>
              </HideElement>
              
              <Menu
                isSidebarOpen={isOpen}
                data={menuData_1}
                openPath={openMenuPath}
                setOpenPath={setOpenMenuPath}
              />  
            </div>  

            <div className={styles.sidebarNavigationBlock}>
            <HideElement isOpen={isOpen}>
              <label className={styles.sidebarNavigationLabel}>Дополнительно</label>
            </HideElement>

              <Menu
                isSidebarOpen={isOpen}
                data={menuData_2}
                openPath={openMenuPath}
                setOpenPath={setOpenMenuPath}
              />   
            </div>
          </nav>
        </div>

        {isButtonToggleVisible && <ButtonToggle isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </aside>
  );
}
