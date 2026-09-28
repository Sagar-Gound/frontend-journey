import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { stateTopics } from './data';

export default function StateManagementPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Modern State Management</h1>
        <p className={styles.subtitle}>
          Knowing <strong>when NOT to use Redux or Context</strong> is a major modern skill.
          Learn which type of state belongs where, and the industry standard tools for each tier.
        </p>
      </header>

      <div className={styles.grid}>
        {stateTopics.map((topic) => (
          <Link href={`/state-management/${topic.slug}`} key={topic.slug} style={{ textDecoration: 'none' }}>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>{topic.title}</h2>
              
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Concept</div>
                <p className={styles.text}>{topic.description}</p>
              </div>

              <div className={styles.insights} style={{ marginTop: 'auto' }}>
                <div className={styles.insightsTitle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Click to see implementation & insights
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
