import Link from 'next/link';
import { notFound } from 'next/navigation';
import { stateTopics } from '../data';
import { LiveRenderer } from '../LiveComponents';
import styles from './page.module.css';

export function generateStaticParams() {
  return stateTopics.map((topic) => ({
    slug: topic.slug,
  }));
}

export default async function StateTopicPage({ params }) {
  const { slug } = await params;
  const topic = stateTopics.find(t => t.slug === slug);
  
  if (!topic) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Link href="/state-management" className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to State Management
        </Link>
        
        <header className={styles.header}>
          <h1 className={styles.title}>{topic.title}</h1>
          <p className={styles.description}>{topic.description}</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Implementation Code
            </div>
            <pre className={styles.codeBlock}>
              <code>{topic.code}</code>
            </pre>
          </div>
          
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              Interactive Demonstration
            </div>
            <div className={styles.outputArea}>
              <LiveRenderer slug={slug} />
            </div>
          </div>
        </div>

        <div className={styles.insights}>
          <div className={styles.insightsTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Senior Engineering Insights
          </div>
          <p className={styles.insightsText}>{topic.insights}</p>
        </div>
      </div>
    </div>
  );
}
