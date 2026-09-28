import Link from 'next/link';
import { notFound } from 'next/navigation';
import { topics } from '../data';
import styles from './page.module.css';

export function generateStaticParams() {
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export default async function SecurityTopicPage({ params }) {
  const { slug } = await params;
  const topic = topics.find(t => t.slug === slug);
  
  if (!topic) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Link href="/security" className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Web Security
        </Link>
        
        <header className={styles.header}>
          <h1 className={styles.title}>{topic.title}</h1>
          <p className={styles.description}>{topic.description}</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Implementation Example
            </div>
            <pre className={styles.codeBlock}>
              <code>{topic.code || "// Example code coming soon..."}</code>
            </pre>
          </div>
        </div>

        <div className={styles.insights}>
          <div className={styles.insightsTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Senior Insight
          </div>
          <p className={styles.insightsText}>{topic.insights}</p>
        </div>
      </div>
    </div>
  );
}
