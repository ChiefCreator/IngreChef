import { useCallback, useState } from "react";

import { useGetCookBooksQuery } from "../../features/api/cookbooksApi/cookbooksApi";
import { selectUserId } from "../../features/auth/authSlice";
import { useAppSelector } from "../../app/hooks";

import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import CookbookCardsPanel from "./CookbookCardsPanel/CookbookCardsPanel";
import CreateCookbookModal from "../../components/CreateCookbookModal/CreateCookbookModal";
import { Plus } from "lucide-react";

import styles from "./Cookbooks.module.scss";

export default function Cookbooks() {
  const userId = useAppSelector(selectUserId);
  const [isCreateCookbookModalOpen, setIsCreateCookbookModalOpen] = useState(false);

  const { data: cookbooks, isSuccess, isError, isLoading, isFetching } = useGetCookBooksQuery({ userId }, { skip: !userId });

  const openCookbookModal = useCallback(() => {
    setIsCreateCookbookModalOpen(true);
  }, [setIsCreateCookbookModalOpen]);
  const closeCookbookModal = useCallback(() => {
    setIsCreateCookbookModalOpen(false);
  }, [setIsCreateCookbookModalOpen]);

  return (
    <section className={styles.page}>
      <Header
        className={styles.header}
        title="Кулинарные книги"
        controls={[
          <Button
            variant="primary"
            className={styles.recipiesButtonLine}
            icon={<Plus size={16} />}
            onClick={openCookbookModal}
          >
            Добавить кулинарную книгу
          </Button>
        ]}
      />

      <CreateCookbookModal
        isOpen={isCreateCookbookModalOpen}
        close={closeCookbookModal}
      />
    <div className={styles.body}>
      <CookbookCardsPanel
        data={cookbooks}
        isSuccess={isSuccess}
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </div>
  </section>
  );
}