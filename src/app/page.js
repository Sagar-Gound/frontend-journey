import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}></span>
          Frontend Journey
        </div>
        <div className={styles.navLinks}>
          <a href="#intro">Introduction</a>
          <a href="#knowledge-base">Knowledge Base</a>
          <a href="#skills">Core Skills</a>
        </div>
        <a href="#start" className={styles.navCta}>Start Learning</a>
      </nav>

      {/* Hero Section */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            🚀 Your Path to Seniority
          </div>
          <h1 className={styles.title}>
            Master the <span className={styles.gradientText}>Frontend</span>, Engineer the <span className={styles.gradientText}>Future</span>.
          </h1>
          <p className={styles.subtitle}>
            A comprehensive guide and exercise platform to help you transition from a capable developer to a high-impact Senior Frontend Engineer.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/modern-architecture" className={styles.primaryCta} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              Explore Architecture
            </Link>
            <Link href="/react-fundamentals" className={styles.secondaryCta} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              React Fundamentals
            </Link>
          </div>
        </section>

        {/* Introduction Section */}
        <section id="intro" className={styles.introSection}>
          <h2 className={styles.sectionTitle}>What Makes a Senior Engineer?</h2>
          <div className={styles.introContent}>
            <p className={styles.introText}>
              Being a senior engineer isn&apos;t just about writing code faster or knowing every framework. It&apos;s about <strong>impact, architecture, and leadership</strong>. A senior frontend engineer understands the broader system, makes pragmatic technical trade-offs, and elevates the entire team.
            </p>
            <p className={styles.introText}>
              Through this platform, you will learn and demonstrate proficiency in advanced system design, web performance optimization, accessibility, and modern web architectures. You will move beyond syntax and focus on building scalable, maintainable, and highly performant applications.
            </p>
          </div>
        </section>

        {/* Knowledge Base Section */}
        <section id="knowledge-base" className={styles.features}>
          <h2 className={styles.sectionTitle}>Interactive Knowledge Base</h2>
          <p className={styles.introText} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Deep dive into our interactive learning modules. Each path contains implementation code, live demonstrations, and senior-level insights.
          </p>
          <div className={styles.grid}>
            <Link href="/react-fundamentals" style={{ textDecoration: 'none' }}>
              <div className={styles.card} style={{ borderColor: 'rgba(97, 218, 251, 0.3)', transition: 'all 0.3s ease' }}>
                <div className={styles.cardIcon}>⚛️</div>
                <h3 style={{ color: '#61dafb' }}>React Fundamentals</h3>
                <p>Master core concepts, rendering behaviors, and optimization techniques for scaling large data sets.</p>
                <div style={{ marginTop: '1.5rem', color: '#61dafb', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Start Learning <span>→</span>
                </div>
              </div>
            </Link>
            
            <Link href="/modern-architecture" style={{ textDecoration: 'none' }}>
              <div className={styles.card} style={{ borderColor: 'rgba(16, 185, 129, 0.3)', transition: 'all 0.3s ease' }}>
                <div className={styles.cardIcon}>🏗️</div>
                <h3 style={{ color: '#10b981' }}>Modern Architecture</h3>
                <p>Design scalable, maintainable applications using feature-based folders, SRP, and headless components.</p>
                <div style={{ marginTop: '1.5rem', color: '#10b981', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Start Learning <span>→</span>
                </div>
              </div>
            </Link>

            <Link href="/state-management" style={{ textDecoration: 'none' }}>
              <div className={styles.card} style={{ borderColor: 'rgba(59, 130, 246, 0.3)', transition: 'all 0.3s ease' }}>
                <div className={styles.cardIcon}>🧠</div>
                <h3 style={{ color: '#3b82f6' }}>State Management</h3>
                <p>Learn exactly which tier of state to use (Zustand, React Query, Context) and when NOT to use Redux.</p>
                <div style={{ marginTop: '1.5rem', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Start Learning <span>→</span>
                </div>
              </div>
            </Link>

            <Link href="/api-integration" style={{ textDecoration: 'none' }}>
              <div className={styles.card} style={{ borderColor: 'rgba(245, 158, 11, 0.3)', transition: 'all 0.3s ease' }}>
                <div className={styles.cardIcon}>🔌</div>
                <h3 style={{ color: '#f59e0b' }}>API & Backend</h3>
                <p>Master network control, JWTs, optimistic updates, real-time WebSockets, and CORS.</p>
                <div style={{ marginTop: '1.5rem', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Start Learning <span>→</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className={styles.features}>
          <h2 className={styles.sectionTitle}>Core Competencies</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🏗️</div>
              <h3>Architecture & Design</h3>
              <p>State management, rendering patterns (SSR, SSG, CSR), component design, and scalable frontend architectures.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⚡</div>
              <h3>Web Performance</h3>
              <p>Master Core Web Vitals, critical rendering path, bundle optimization, and memory profiling.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🛡️</div>
              <h3>Testing & Quality</h3>
              <p>Establish robust testing strategies (unit, integration, E2E), CI/CD pipelines, and zero-downtime deployments.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>♿</div>
              <h3>Accessibility (A11y)</h3>
              <p>Build applications for everyone. Master WCAG guidelines, semantic HTML, ARIA, and keyboard navigation.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Frontend Journey. Open source career guide.</p>
      </footer>
    </div>
  );
}
