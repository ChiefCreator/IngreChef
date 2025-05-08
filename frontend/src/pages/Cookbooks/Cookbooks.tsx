import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import CookbookCardsPanel from "./CookbookCardsPanel/CookbookCardsPanel";
import { Plus } from "lucide-react";

import { useGetCookBooksQuery } from "../../features/api/apiSlice";

import styles from "./Cookbooks.module.scss";

export default function Cookbooks() {
  const { data: cookbooks, isSuccess, isError, isLoading, isFetching } = useGetCookBooksQuery({ userId: "author_1" });

  console.log(cookbooks)

  return (
    <section className={styles.page}>
      <Header
        className={styles.header}
        title="Кулинарные книги"
        controls={[
          <Button
            type="primary"
            className={styles.recipiesButtonLine}
            icon={<Plus size={16} />}
          >
            Добавить кулинарную книгу
          </Button>
        ]}
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