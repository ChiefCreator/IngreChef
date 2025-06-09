import React, { useState, ReactNode } from "react";

import TabButtons from "./TabButtons/TabButtons";

import styles from "./Tabs.module.scss";

export interface Tab {
  id: string;
  title: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default React.memo(function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.tabs}>
      <TabButtons
        className={styles.tabButtons}
        tabs={tabs}
        activeIndex={activeIndex}
        setActiveIndex={(i) => setActiveIndex(i)}
      />

      <div className={styles.content}>{tabs[activeIndex].content}</div>
    </div>
  );
});
