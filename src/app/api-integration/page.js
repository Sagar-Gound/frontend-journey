import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { apiTopics } from './data';

export default function ApiIntegrationPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>API & Backend Integration</h1>
        <p className={styles.subtitle}>
          Mastering the bridge between the client and the server. Learn advanced network control, 
          authentication security, optimistic UI updates, and the difference between Client vs Server state.
        </p>
      </header>

      <div className={styles.grid}>
        {apiTopics.map((topic) => (
          <Link href={`/api-integration/${topic.slug}`} key={topic.slug} style={{ textDecoration: 'none' }}>
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
