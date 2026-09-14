import { useEffect, useState } from "react";
import AIAssistant from "./AIAssistant";

// ======================================================
// RENDER BACKEND URL
// ======================================================
const API =
  "https://ai-research-tracker-backend-m64v.onrender.com";

function App() {
  // ======================================================
  // LOGIN STATE
  // ======================================================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================================================
  // DASHBOARD DATA
  // ======================================================
  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);

  const [projectLoading, setProjectLoading] = useState(false);
  const [publicationLoading, setPublicationLoading] = useState(false);

  // ======================================================
  // CREATE PROJECT FORM
  // ======================================================
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("Active");

  // ======================================================
  // CREATE PUBLICATION FORM
  // ======================================================
  const [publicationTitle, setPublicationTitle] = useState("");
  const [publicationAuthors, setPublicationAuthors] =
    useState("");
  const [publicationJournal, setPublicationJournal] =
    useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [publicationDoi, setPublicationDoi] = useState("");
  const [publicationProjectId, setPublicationProjectId] =
    useState("");

  // ======================================================
  // MESSAGE
  // ======================================================
  const [message, setMessage] = useState("");

  // ======================================================
  // LOGIN
  // ======================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginError("");
    setMessage("");

    if (!username.trim() || !password.trim()) {
      setLoginError(
        "Please enter username and password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/auth/login?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed."
        );
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      setToken(data.access_token);
      setPassword("");
      setLoginError("");
    } catch (error) {
      console.error("Login error:", error);

      setLoginError(
        "Cannot connect to backend. Please check the server and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================
  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setToken(null);
    setProjects([]);
    setPublications([]);

    setUsername("");
    setPassword("");
  };

  // ======================================================
  // FETCH PROJECTS
  // ======================================================
  const fetchProjects = async () => {
    if (!token) return;

    setProjectLoading(true);

    try {
      const response = await fetch(
        `${API}/projects`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load projects."
        );
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Project fetch error:",
        error
      );

      setMessage(
        "Could not load projects from backend."
      );
    } finally {
      setProjectLoading(false);
    }
  };

  // ======================================================
  // FETCH PUBLICATIONS
  // ======================================================
  const fetchPublications = async () => {
    if (!token) return;

    setPublicationLoading(true);

    try {
      const response = await fetch(
        `${API}/publications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to load publications."
        );
      }

      setPublications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Publication fetch error:",
        error
      );

      setMessage(
        "Could not load publications from backend."
      );
    } finally {
      setPublicationLoading(false);
    }
  };

  // ======================================================
  // LOAD DASHBOARD DATA
  // ======================================================
  useEffect(() => {
    if (!token) return;

    fetchProjects();
    fetchPublications();
  }, [token]);

  // ======================================================
  // CREATE PROJECT
  // ======================================================
  const handleCreateProject = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!projectTitle.trim()) {
      setMessage("Please enter a project title.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: projectTitle,
            description: projectDescription,
            status: projectStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Project creation failed."
        );
      }

      setMessage(
        "Project created successfully."
      );

      setProjectTitle("");
      setProjectDescription("");
      setProjectStatus("Active");

      fetchProjects();
    } catch (error) {
      console.error(
        "Create project error:",
        error
      );

      setMessage(
        error.message ||
          "Could not create project."
      );
    }
  };

  // ======================================================
  // CREATE PUBLICATION
  // ======================================================
  const handleCreatePublication = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!publicationTitle.trim()) {
      setMessage(
        "Please enter a publication title."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API}/publications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: publicationTitle,
            authors: publicationAuthors,
            journal: publicationJournal,
            publication_year:
              publicationYear
                ? Number(publicationYear)
                : null,
            doi: publicationDoi,
            project_id:
              publicationProjectId
                ? Number(publicationProjectId)
                : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Publication creation failed."
        );
      }

      setMessage(
        "Publication created successfully."
      );

      setPublicationTitle("");
      setPublicationAuthors("");
      setPublicationJournal("");
      setPublicationYear("");
      setPublicationDoi("");
      setPublicationProjectId("");

      fetchPublications();
    } catch (error) {
      console.error(
        "Create publication error:",
        error
      );

      setMessage(
        error.message ||
          "Could not create publication."
      );
    }
  };

  // ======================================================
  // LOGIN SCREEN
  // ======================================================
  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <div style={styles.logo}>
              AI
            </div>

            <p style={styles.eyebrow}>
              RESEARCH MANAGEMENT SYSTEM
            </p>

            <h1 style={styles.loginTitle}>
              AI-Assisted Research
              <br />
              Project & Publication Tracker
            </h1>

            <p style={styles.loginDescription}>
              Securely manage research projects,
              publications, and research activities.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label style={styles.label}>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              style={styles.input}
            />

            <label
              style={{
                ...styles.label,
                marginTop: "16px",
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              style={styles.input}
            />

            {loginError && (
              <div style={styles.errorCard}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={styles.loginButton}
            >
              {loading
                ? "Connecting..."
                : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ======================================================
  // DASHBOARD
  // ======================================================
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.topBar}>
        <div>
          <p style={styles.eyebrow}>
            AI-ASSISTED RESEARCH PLATFORM
          </p>

          <h1 style={styles.heading}>
            Research Dashboard
          </h1>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </header>

      <main style={styles.main}>
        {/* MESSAGE */}
        {message && (
          <div style={styles.messageCard}>
            {message}
          </div>
        )}

        {/* STATISTICS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>
              PROJECTS
            </p>

            <h2 style={styles.statNumber}>
              {projects.length}
            </h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>
              PUBLICATIONS
            </p>

            <h2 style={styles.statNumber}>
              {publications.length}
            </h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>
              API STATUS
            </p>

            <h2 style={styles.statusNumber}>
              Connected
            </h2>
          </div>
        </div>

        {/* CREATE PROJECT */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Create Research Project
          </h2>

          <form
            onSubmit={handleCreateProject}
            style={styles.form}
          >
            <input
              type="text"
              value={projectTitle}
              onChange={(e) =>
                setProjectTitle(e.target.value)
              }
              placeholder="Project title"
              style={styles.input}
            />

            <textarea
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(
                  e.target.value
                )
              }
              placeholder="Project description"
              rows="4"
              style={styles.textarea}
            />

            <select
              value={projectStatus}
              onChange={(e) =>
                setProjectStatus(e.target.value)
              }
              style={styles.input}
            >
              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

            <button
              type="submit"
              style={styles.primaryButton}
            >
              Create Project
            </button>
          </form>
        </section>

        {/* PROJECTS */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Research Projects
            </h2>

            <button
              onClick={fetchProjects}
              style={styles.secondaryButton}
            >
              Refresh
            </button>
          </div>

          {projectLoading ? (
            <p style={styles.emptyText}>
              Loading projects...
            </p>
          ) : projects.length === 0 ? (
            <p style={styles.emptyText}>
              No projects available.
            </p>
          ) : (
            <div style={styles.listGrid}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={styles.itemCard}
                >
                  <h3>
                    {project.title}
                  </h3>

                  <p>
                    {project.description ||
                      "No description"}
                  </p>

                  <span style={styles.badge}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CREATE PUBLICATION */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Create Publication
          </h2>

          <form
            onSubmit={handleCreatePublication}
            style={styles.form}
          >
            <input
              type="text"
              value={publicationTitle}
              onChange={(e) =>
                setPublicationTitle(
                  e.target.value
                )
              }
              placeholder="Publication title"
              style={styles.input}
            />

            <input
              type="text"
              value={publicationAuthors}
              onChange={(e) =>
                setPublicationAuthors(
                  e.target.value
                )
              }
              placeholder="Authors"
              style={styles.input}
            />

            <input
              type="text"
              value={publicationJournal}
              onChange={(e) =>
                setPublicationJournal(
                  e.target.value
                )
              }
              placeholder="Journal name"
              style={styles.input}
            />

            <input
              type="number"
              value={publicationYear}
              onChange={(e) =>
                setPublicationYear(
                  e.target.value
                )
              }
              placeholder="Publication year"
              style={styles.input}
            />

            <input
              type="text"
              value={publicationDoi}
              onChange={(e) =>
                setPublicationDoi(
                  e.target.value
                )
              }
              placeholder="DOI link"
              style={styles.input}
            />

            <select
              value={publicationProjectId}
              onChange={(e) =>
                setPublicationProjectId(
                  e.target.value
                )
              }
              style={styles.input}
            >
              <option value="">
                Select project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.title}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={styles.primaryButton}
            >
              Create Publication
            </button>
          </form>
        </section>

        {/* PUBLICATIONS */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Publications
            </h2>

            <button
              onClick={fetchPublications}
              style={styles.secondaryButton}
            >
              Refresh
            </button>
          </div>

          {publicationLoading ? (
            <p style={styles.emptyText}>
              Loading publications...
            </p>
          ) : publications.length === 0 ? (
            <p style={styles.emptyText}>
              No publications available.
            </p>
          ) : (
            <div style={styles.listGrid}>
              {publications.map(
                (publication) => (
                  <div
                    key={publication.id}
                    style={styles.itemCard}
                  >
                    <h3>
                      {publication.title}
                    </h3>

                    <p>
                      <strong>Authors:</strong>{" "}
                      {publication.authors ||
                        "Not specified"}
                    </p>

                    <p>
                      <strong>Journal:</strong>{" "}
                      {publication.journal ||
                        "Not specified"}
                    </p>

                    <p>
                      <strong>Year:</strong>{" "}
                      {publication.publication_year ||
                        "Not specified"}
                    </p>

                    {publication.doi && (
                      <p>
                        <strong>DOI:</strong>{" "}
                        {publication.doi}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* AI ASSISTANT */}
        <AIAssistant />
      </main>
    </div>
  );
}

// ======================================================
// STYLES
// ======================================================
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#0f172a",
  },

  topBar: {
    backgroundColor: "white",
    padding: "25px 35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom:
      "1px solid #e2e8f0",
  },

  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "30px",
    boxSizing: "border-box",
  },

  eyebrow: {
    margin: 0,
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  heading: {
    margin: "6px 0 0",
    fontSize: "30px",
  },

  loginCard: {
    width: "100%",
    maxWidth: "520px",
    margin: "80px auto",
    padding: "35px",
    backgroundColor: "white",
    borderRadius: "18px",
    boxSizing: "border-box",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.08)",
  },

  loginHeader: {
    marginBottom: "30px",
  },

  logo: {
    width: "55px",
    height: "55px",
    borderRadius: "14px",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "800",
    marginBottom: "18px",
  },

  loginTitle: {
    margin: "10px 0",
    fontSize: "28px",
    lineHeight: "1.25",
  },

  loginDescription: {
    color: "#64748b",
    lineHeight: "1.6",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "13px",
    boxSizing: "border-box",
    border:
      "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "13px",
    boxSizing: "border-box",
    border:
      "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  },

  loginButton: {
    width: "100%",
    marginTop: "20px",
    padding: "13px",
    border: "none",
    borderRadius: "9px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  logoutButton: {
    padding: "10px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#334155",
    fontWeight: "700",
    cursor: "pointer",
  },

  errorCard: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "9px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "600",
    fontSize: "13px",
  },

  messageCard: {
    marginBottom: "20px",
    padding: "14px",
    borderRadius: "10px",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: "600",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },

  statCard: {
    backgroundColor: "white",
    padding: "23px",
    borderRadius: "14px",
    border:
      "1px solid #e2e8f0",
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  statNumber: {
    margin: "8px 0 0",
    fontSize: "30px",
  },

  statusNumber: {
    margin: "8px 0 0",
    fontSize: "20px",
  },

  section: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "15px",
    border:
      "1px solid #e2e8f0",
    marginBottom: "25px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
  },

  form: {
    display: "grid",
    gap: "12px",
  },

  primaryButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "9px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#334155",
    fontWeight: "700",
    cursor: "pointer",
  },

  listGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "15px",
  },

  itemCard: {
    padding: "18px",
    borderRadius: "12px",
    border:
      "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },

  badge: {
    display: "inline-block",
    marginTop: "8px",
    padding: "6px 10px",
    borderRadius: "20px",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "700",
  },

  emptyText: {
    color: "#64748b",
  },
};

export default App;