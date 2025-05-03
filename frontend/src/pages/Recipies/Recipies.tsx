import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button/Button";
import Search from "../../components/SearchPanel/Search/Search";
import FilterButton from "../../components/SearchPanel/FilterButton.tsx/FilterButton";

import styles from "./Recipies.module.scss";

export default function Recipies() {
  const navigate = useNavigate();

  return (
    <section className={styles.recipies}>
      <header className={styles.header}>
        <h2 className={styles.headerTitle}>Мои рецепты</h2>

        <div className={styles.headerControls}>
          <Button
            type="outline"
            className={styles.recipiesButtonLine}
            icon={<FontAwesomeIcon icon={faCompass} />}
          >
            Лента
          </Button>

          <Button
            type="primary"
            className={styles.recipiesButtonLine}
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Добавить рецепт
          </Button>
        </div>
      </header>

      <div className={styles.searchPanel}>
        <div className={styles.searchPanelSearching}>
          <Search
            className={styles.searchPanelSearch}
            placeholder="Поиск по названию, ингредиентам..."
          />
  
          <FilterButton
            className={styles.searchPanelFilterButton}
          />
        </div>
      </div>
    </section>
  );
}