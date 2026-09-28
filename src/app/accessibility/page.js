import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { topics } from './data';

export default function AccessibilityCurriculum() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Accessibility (a11y)</h1>
        <p className={styles.subtitle}>
          The often overlooked hallmark of professional engineering. Learn how to build inclusive applications that everyone can use.
        </p>
      </header>

      <div className={styles.grid}>
        {topics.map((topic) => (
          <Link prefetch={false} href={`/accessibility/${topic.slug}`} key={topic.slug} style={{ textDecoration: 'none' }}>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>{topic.title}</h2>
              
              <div className={styles.tagContainer}>
                {topic.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Concept</div>
                <p className={styles.text}>{topic.description}</p>
              </div>

              <div className={styles.insights}>
                <div className={styles.insightsTitle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Senior Insight
                </div>
                <p className={styles.insightsText}>{topic.insights}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
