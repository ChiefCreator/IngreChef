import React from "react";

import Search from "./Search/Search";
import FilterButton from "./FilterButton.tsx/FilterButton";
import FilterItem from "./FilterItem/FilterItem";
import RemoveFilter from "./RemoveFilter/RemoveFilter";

import type { FilterItemProps } from "./FilterItem/FilterItem";
import type { ChangeFilter } from "../../types/filtersTypes";

import styles from "./SearchPanel.module.scss";

interface SerachPanelProps {
  filterItemsData: FilterItemProps[];
  className?: string;
  placeholder?: string;
  isToggleFilters?: boolean;
  isFiltersPanelOpen?: boolean;

  changeFilter: ChangeFilter;
  removeFilters?: () => void;
  toggleFiltersPanel: () => void;
}

export default React.memo(function SearchPanel({ filterItemsData, className = "", placeholder = "Поиск...", isToggleFilters = true, isFiltersPanelOpen = false, changeFilter, removeFilters, toggleFiltersPanel }: SerachPanelProps) {

  return (
    <div className={`${styles.searchPanel} ${className}`}>
      <div className={styles.searchPanelSearching}>
        <Search className={styles.searchPanelSearch} placeholder={placeholder} onChange={(value) => changeFilter("titleStartsWith", value)} />

        {isToggleFilters && <FilterButton className={styles.searchPanelFilterButton} isActive={isFiltersPanelOpen} onClick={toggleFiltersPanel} />}
      </div>

      <div
        className={`
          ${styles.filters}
          ${isToggleFilters ? styles.filtersTogglePanel : ""}
          ${isFiltersPanelOpen ? styles.filtersTogglePanelOpen : ""}`
        }>
        <div className={styles.filtersContainer}>
          <div className={styles.filtersList}>
            {filterItemsData.map(data => <FilterItem key={data.id} {...data} changeFilter={changeFilter} removeFilter={() => changeFilter(data.id, undefined)} />)}
            <RemoveFilter onClick={removeFilters!} />
          </div>
        </div>
      </div>
    </div>
  );
})
