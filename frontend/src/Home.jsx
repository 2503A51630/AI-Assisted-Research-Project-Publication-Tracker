function Home({ onLogin }) {
  return (
    <div style={styles.page}>

      {/* Navigation bar */}
      <nav style={styles.navbar}>

        <div style={styles.logoArea}>
          <div style={styles.logo}>AI</div>

          <div>
            <div style={styles.brandName}>
              Research Tracker
            </div>

            <div style={styles.brandTagline}>
              Research Project & Publication Management
            </div>
          </div>
        </div>

        <button
          style={styles.loginButton}
          onClick={onLogin}
        >
          Login
        </button>

      </nav>

      {/* Main hero section */}
      <main>

        <section style={styles.hero}>

          <div style={styles.heroContent}>

            <p style={styles.badge}>
              AI-ASSISTED RESEARCH MANAGEMENT
            </p>

            <h1 style={styles.heroTitle}>
              Manage your research projects and publications in one place.
            </h1>

            <p style={styles.heroText}>
              Track research projects, manage publications,
              monitor progress, and organize research information
              through one simple platform.
            </p>

            <div style={styles.heroButtons}>

              <button
                style={styles.primaryButton}
                onClick={onLogin}
              >
                Get Started
              </button>

              <button
                style={styles.secondaryButton}
                onClick={onLogin}
              >
                Sign In
              </button>

            </div>

          </div>

          {/* Preview card */}
          <div style={styles.heroCard}>

            <div style={styles.cardTitle}>
              Research Overview
            </div>

            <div style={styles.miniStats}>

              <div style={styles.miniCard}>
                <strong>Projects</strong>
                <span>Track research work</span>
              </div>

              <div style={styles.miniCard}>
                <strong>Publications</strong>
                <span>Manage research papers</span>
              </div>

              <div style={styles.miniCard}>
                <strong>Analytics</strong>
                <span>View research insights</span>
              </div>

              <div style={styles.miniCard}>
                <strong>AI Assistant</strong>
                <span>AI-powered support</span>
              </div>

            </div>

          </div>

        </section>

        {/* Features */}
        <section style={styles.features}>

          <h2>
            Everything you need for research tracking
          </h2>

          <div style={styles.featureGrid}>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📁</div>

              <h3>
                Project Management
              </h3>

              <p>
                Create, update, search, and monitor research projects.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📚</div>

              <h3>
                Publication Management
              </h3>

              <p>
                Manage publication details, authors, journals,
                DOI, and publication year.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>

              <h3>
                Analytics
              </h3>

              <p>
                View useful information about your research activity.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🤖</div>

              <h3>
                AI Assistance
              </h3>

              <p>
                Use AI-supported features to assist research-related work.
              </p>
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          AI-Assisted Research Project & Publication Tracker
        </p>
      </footer>

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    color: "#172033",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 7%",
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  brandName: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  brandTagline: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "3px",
  },

  loginButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  hero: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "80px 7%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "50px",
    flexWrap: "wrap",
  },

  heroContent: {
    maxWidth: "620px",
  },

  badge: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#2563eb",
    backgroundColor: "#dbeafe",
    padding: "8px 12px",
    borderRadius: "20px",
  },

  heroTitle: {
    fontSize: "48px",
    lineHeight: "1.1",
    margin: "20px 0",
  },

  heroText: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#64748b",
  },

  heroButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "30px",
  },

  primaryButton: {
    padding: "13px 24px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "13px 24px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#334155",
    fontWeight: "bold",
    cursor: "pointer",
  },

  heroCard: {
    width: "360px",
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "18px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  miniStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  miniCard: {
    padding: "18px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
  },

  features: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px 7% 80px",
    textAlign: "center",
  },

  featureGrid: {
    marginTop: "30px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    textAlign: "left",
  },

  featureCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
  },

  featureIcon: {
    fontSize: "28px",
  },

  footer: {
    padding: "25px",
    textAlign: "center",
    backgroundColor: "#172033",
    color: "white",
  },

};


export default Home;