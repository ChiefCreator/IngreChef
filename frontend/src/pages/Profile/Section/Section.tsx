import React from "react";

import styles from "./Section.module.scss";

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default React.memo(function Section({ title, description, children }: SectionProps) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </header>

      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
})