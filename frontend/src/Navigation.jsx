function Navigation({ username, userRole, onLogout }) {
  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSide}>
        <div style={styles.logo}>
          AI
        </div>

        <div>
          <div style={styles.title}>
            Research Tracker
          </div>

          <div style={styles.subtitle}>
            AI-Assisted Research Management
          </div>
        </div>
      </div>

      <div style={styles.menu}>

        <button
  style={styles.menuButton}
  onClick={() =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
>
  Dashboard
</button>

<button
  style={styles.menuButton}
  onClick={() =>
    document
      .getElementById("projects-section")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
>
  Projects
</button>

<button
  style={styles.menuButton}
  onClick={() =>
    document
      .getElementById("publications-section")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
>
  Publications
</button>

        <button style={styles.menuButton}>
          Analytics
        </button>
        <button
  style={styles.menuButton}
  onClick={() =>
    document
      .getElementById("ai-assistant-section")
      ?.scrollIntoView({
        behavior: "smooth",
      })
  }
>
  AI Assistant
</button>

        {userRole === "Admin" && (
  <button
    style={styles.menuButton}
    onClick={() =>
      document
        .getElementById("users-section")
        ?.scrollIntoView({
          behavior: "smooth",
        })
    }
  >
    Users
  </button>
)}

        <div style={styles.userArea}>
          <span style={styles.username}>
            {username}
          </span>

          <span style={styles.role}>
            {userRole || "User"}
          </span>
        </div>

        <button
          style={styles.logoutButton}
          onClick={onLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 25px",
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  leftSide: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    fontSize: "17px",
  },

  title: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#172033",
  },

  subtitle: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "2px",
  },

  menu: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  menuButton: {
    padding: "9px 12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "transparent",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "600",
  },

  userArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: "8px",
    marginRight: "5px",
  },

  username: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#172033",
  },

  role: {
    fontSize: "11px",
    color: "#64748b",
  },

  logoutButton: {
    padding: "9px 14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#172033",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },
};

export default Navigation;