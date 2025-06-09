import { useCallback, useState } from "react";

import { useGetCookBooksQuery } from "../../features/api/cookbooksApi/cookbooksApi";
import { selectUserId } from "../../features/auth/authSlice";
import { useAppSelector, useMediaQuery } from "../../app/hooks";

import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import CookbookCardsPanel from "./CookbookCardsPanel/CookbookCardsPanel";
import CreateCookbookModal from "../../components/CreateCookbookModal/CreateCookbookModal";
import { Plus } from "lucide-react";

import styles from "./Cookbooks.module.scss";

export default function Cookbooks() {
  const userId = useAppSelector(selectUserId);
  const [isCreateCookbookModalOpen, setIsCreateCookbookModalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const isMobile = useMediaQuery("(hover: none)");

  const { data: cookbooks, isSuccess, isError, isLoading, isFetching } = useGetCookBooksQuery({ userId }, { skip: !userId });

  const openCookbookModal = useCallback(() => {
    setIsCreateCookbookModalOpen(true);
  }, [setIsCreateCookbookModalOpen]);
  const toggleCookbookModal = useCallback((isOpen?: boolean) => {
    if (isOpen === undefined) setIsCreateCookbookModalOpen(prev => !prev);
    else {
      setIsCreateCookbookModalOpen(isOpen);
    }
  }, [setIsCreateCookbookModalOpen]);

  const buttonOpenCookbookModal = (
    <Button
      variant="primary"
      className={styles.buttonOpenModal}
      icon={<Plus size={16} />}
      onClick={openCookbookModal}
    >
      Добавить кулинарную книгу
    </Button>
  );

  return (
    <section className={styles.page}>
      {isDesktop && (
        <Header
          className={styles.header}
          title="Кулинарные книги"
          controls={[buttonOpenCookbookModal]}
        />
      )}

      {!isDesktop && buttonOpenCookbookModal}

      <CreateCookbookModal
        isOpen={isCreateCookbookModalOpen}
        isMobile={isMobile}
        toggle={toggleCookbookModal}
      />

    <div className={styles.body}>
      <CookbookCardsPanel
        data={cookbooks}
        isSuccess={isSuccess}
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        openCookbookModal={openCookbookModal}
      />
    </div>
  </section>
  );
}