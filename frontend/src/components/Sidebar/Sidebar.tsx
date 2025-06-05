import { useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectUserId } from "../../features/auth/authSlice";
import { useGetCookBooksQuery } from "../../features/api/cookbooksApi/cookbooksApi";

import Logo from "./../Logo/Logo";
import Menu from "./Menu/Menu";
import ButtonToggle from "./ButtonToggle/ButtonToggle";
import HideElement from "./HideElement/HideElement";
import { ChefHat, BookMarked, Compass, LayoutList, CookingPot } from "lucide-react";

import styles from "./Sidebar.module.scss";

interface SidebarProps {
  className?: string;
  isDesktop: boolean;
}

export interface MenuItemData {
  id: string;
  type: "link" | "buttonOpenDropdown" | "control";
  pathname?: string;
  index?: boolean;
  title: string;
  icon: React.ReactNode;
  children?: MenuItemData[];
  isChildrenLoading?: boolean;
  defaultContent?: string;
}

export default function Sidebar({ className = "", isDesktop }: SidebarProps) {
  const userId = useAppSelector(selectUserId);
  const [openMenuPath, setOpenMenuPath] = useState([] as string []);
  const [isOpen, setIsOpen] = useState(true);
  const [isButtonToggleVisible, setIsButtonToggleVisible] = useState(false);

  const { data: cookbooks, isLoading: isCookbooksLoading } = useGetCookBooksQuery({ userId });

  const menuData_1 = useMemo<MenuItemData[]>(() => [
    {
      id: "item-1",
      type: "link",
      pathname: "/",
      index: true,
      title: "Мои рецепты",
      icon: <ChefHat size={16} />,
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
      children: cookbooks?.map(({ id, name }) => ({
        id,
        type: "link",
        title: name,
        pathname: `/cookbooks/${id}`,
        icon: <BookMarked size={16} />,
      })),
      isChildrenLoading: isCookbooksLoading,
      defaultContent: "Список книг пуст. Добавьте новую!",
    },
    {
      id: "item-7",
      type: "link",
      title: "Генерация рецептов",
      pathname: "/generate-recipe",
      icon: <CookingPot size={16} />,
    },
  ], [cookbooks]);
  const menuData_2 = useMemo<MenuItemData[]>(() =>[
    {
      id: "item-99",
      type: "link",
      pathname: "/discover",
      title: "Лента",
      icon: <Compass size={16} />,
    },
  ], []);

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

  if (!isDesktop) return null;

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""} ${className}`}
      onMouseEnter={() => setIsButtonToggleVisible(true)}
      onMouseLeave={() => setIsButtonToggleVisible(false)}
    >
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarContent}>
          <HideElement isOpen={isOpen}>
            <Logo className={`${styles.sidebarLogo} ${styles.hideElementByHeight}`} />
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
