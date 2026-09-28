import styles from "./page.module.css";
import Image from "next/image";

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
          <a href="#skills">Core Skills</a>
          <a href="#exercises">Exercises</a>
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
            <button className={styles.primaryCta}>Explore the Path</button>
            <button className={styles.secondaryCta}>View Exercises</button>
          </div>
        </section>

        {/* Introduction Section */}
        <section id="intro" className={styles.introSection}>
          <h2 className={styles.sectionTitle}>What Makes a Senior Engineer?</h2>
          <div className={styles.introContent}>
            <p className={styles.introText}>
              Being a senior engineer isn't just about writing code faster or knowing every framework. It's about <strong>impact, architecture, and leadership</strong>. A senior frontend engineer understands the broader system, makes pragmatic technical trade-offs, and elevates the entire team.
            </p>
            <p className={styles.introText}>
              Through this platform, you will learn and demonstrate proficiency in advanced system design, web performance optimization, accessibility, and modern web architectures. You will move beyond syntax and focus on building scalable, maintainable, and highly performant applications.
            </p>
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
