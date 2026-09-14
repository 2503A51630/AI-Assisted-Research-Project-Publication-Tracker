import { useEffect, useMemo, useState } from "react";
import Navigation from "./Navigation";
import AIAssistant from "./AIAssistant";

const API = "http://localhost:8001";

function App() {
  const [showHome, setShowHome] = useState(
    !localStorage.getItem("access_token")
  );

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState("");

  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  const [users, setUsers] = useState([]);

  const [projectSearch, setProjectSearch] = useState("");
  const [publicationSearch, setPublicationSearch] = useState("");

  const [projectPage, setProjectPage] = useState(1);
  const [publicationPage, setPublicationPage] = useState(1);

  const itemsPerPage = 5;

  // -----------------------------------------
  // PROJECT FORM
  // -----------------------------------------

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("Active");

  // -----------------------------------------
  // PUBLICATION FORM
  // -----------------------------------------

  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);

  const [publicationTitle, setPublicationTitle] = useState("");
  const [publicationAuthors, setPublicationAuthors] = useState("");
  const [publicationJournal, setPublicationJournal] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [publicationDoi, setPublicationDoi] = useState("");
  const [publicationProjectId, setPublicationProjectId] = useState("");

  // -----------------------------------------
  // USER FORM
  // -----------------------------------------

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [userFormUsername, setUserFormUsername] = useState("");
  const [userFormEmail, setUserFormEmail] = useState("");
  const [userFormPassword, setUserFormPassword] = useState("");
  const [userFormRole, setUserFormRole] = useState("Researcher");

  // -----------------------------------------
  // GET ROLE FROM JWT
  // -----------------------------------------

  const getRoleFromToken = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return "";
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || "";
    } catch {
      return "";
    }
  };

  // -----------------------------------------
  // GET USERNAME FROM JWT
  // -----------------------------------------

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return "";
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.username || "";
    } catch {
      return "";
    }
  };

  // -----------------------------------------
  // LOGIN
  // -----------------------------------------

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("Logging in...");

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
        if (Array.isArray(data.detail)) {
          setMessage(
            data.detail.map((error) => error.msg).join(", ")
          );
        } else {
          setMessage(data.detail || "Login failed");
        }

        return;
      }

      localStorage.setItem("access_token", data.access_token);

      const role = getRoleFromToken();
      const tokenUsername = getUsernameFromToken();

      setUserRole(role);
      setUsername(tokenUsername || username);
      setPassword("");

      setLoggedIn(true);
      setShowHome(false);
      setMessage("");

      await loadProjects(data.access_token);
      await loadPublications(data.access_token);

      if (role === "Admin") {
        await loadUsers(data.access_token);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Cannot connect to the backend.");
    }
  };

  // -----------------------------------------
  // LOAD PROJECTS
  // -----------------------------------------

  const loadProjects = async (token) => {
    try {
      const response = await fetch(`${API}/projects/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Could not load projects");
        return;
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Projects error:", error);
      setMessage("Could not connect to the projects API.");
    }
  };

  // -----------------------------------------
  // ADD PROJECT
  // -----------------------------------------

  const openAddProjectForm = () => {
    setEditingProject(null);
    setProjectTitle("");
    setProjectDescription("");
    setProjectStatus("Active");
    setMessage("");
    setShowProjectForm(true);
  };

  // -----------------------------------------
  // EDIT PROJECT
  // -----------------------------------------

  const openEditProjectForm = (project) => {
    setEditingProject(project);
    setProjectTitle(project.title || "");
    setProjectDescription(project.description || "");
    setProjectStatus(project.status || "Active");
    setMessage("");
    setShowProjectForm(true);
  };

  // -----------------------------------------
  // CLOSE PROJECT FORM
  // -----------------------------------------

  const closeProjectForm = (clearMessage = true) => {
    setShowProjectForm(false);
    setEditingProject(null);
    setProjectTitle("");
    setProjectDescription("");
    setProjectStatus("Active");

    if (clearMessage) {
      setMessage("");
    }
  };

  // -----------------------------------------
  // SAVE / UPDATE PROJECT
  // -----------------------------------------

  const handleProjectFormSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    setMessage(
      editingProject
        ? "Updating project..."
        : "Saving project..."
    );

    try {
      const url = editingProject
        ? `${API}/projects/${editingProject.id}`
        : `${API}/projects/`;

      const method = editingProject ? "PUT" : "POST";

      const body = {
        title: projectTitle,
        description: projectDescription,
        status: projectStatus,
      };

      if (editingProject) {
        body.owner_id = editingProject.owner_id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail ||
            (editingProject
              ? "Could not update project"
              : "Could not create project")
        );
        return;
      }

      if (editingProject) {
        setProjects((current) =>
          current.map((project) =>
            project.id === data.id ? data : project
          )
        );

        setMessage("Project updated successfully!");
      } else {
        setProjects((current) => [data, ...current]);
        setProjectPage(1);
        setMessage("Project created successfully!");
      }

      closeProjectForm(false);
    } catch (error) {
      console.error("Save project error:", error);
      setMessage("Could not connect to the projects API.");
    }
  };

  // -----------------------------------------
  // DELETE PROJECT
  // -----------------------------------------

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    setMessage("Deleting project...");

    try {
      const response = await fetch(
        `${API}/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Could not delete project"
        );
        return;
      }

      setProjects((current) =>
        current.filter((project) => project.id !== projectId)
      );

      setProjectPage(1);
      setMessage("Project deleted successfully!");
    } catch (error) {
      console.error("Delete project error:", error);
      setMessage("Could not connect to the projects API.");
    }
  };

  // -----------------------------------------
  // LOAD PUBLICATIONS
  // -----------------------------------------

  const loadPublications = async (token) => {
    try {
      const response = await fetch(`${API}/publications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Could not load publications"
        );
        return;
      }

      setPublications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Publications error:", error);
      setMessage("Could not connect to the publications API.");
    }
  };

  // -----------------------------------------
  // ADD PUBLICATION
  // -----------------------------------------

  const openAddPublicationForm = () => {
    setEditingPublication(null);
    setPublicationTitle("");
    setPublicationAuthors("");
    setPublicationJournal("");
    setPublicationYear("");
    setPublicationDoi("");
    setPublicationProjectId("");
    setMessage("");
    setShowPublicationForm(true);
  };

  // -----------------------------------------
  // EDIT PUBLICATION
  // -----------------------------------------

  const openEditPublicationForm = (publication) => {
    setEditingPublication(publication);
    setPublicationTitle(publication.title || "");
    setPublicationAuthors(publication.authors || "");
    setPublicationJournal(publication.journal || "");
    setPublicationYear(
      publication.publication_year || ""
    );
    setPublicationDoi(publication.doi || "");
    setPublicationProjectId(
      publication.project_id || ""
    );
    setMessage("");
    setShowPublicationForm(true);
  };

  // -----------------------------------------
  // CLOSE PUBLICATION FORM
  // -----------------------------------------

  const closePublicationForm = (clearMessage = true) => {
    setShowPublicationForm(false);
    setEditingPublication(null);
    setPublicationTitle("");
    setPublicationAuthors("");
    setPublicationJournal("");
    setPublicationYear("");
    setPublicationDoi("");
    setPublicationProjectId("");

    if (clearMessage) {
      setMessage("");
    }
  };

  // -----------------------------------------
  // SAVE / UPDATE PUBLICATION
  // -----------------------------------------

  const handlePublicationFormSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    setMessage(
      editingPublication
        ? "Updating publication..."
        : "Saving publication..."
    );

    try {
      const url = editingPublication
        ? `${API}/publications/${editingPublication.id}`
        : `${API}/publications/`;

      const method = editingPublication ? "PUT" : "POST";

      const body = {
        title: publicationTitle,
        authors: publicationAuthors || null,
        journal: publicationJournal || null,
        publication_year: publicationYear
          ? Number(publicationYear)
          : null,
        doi: publicationDoi || null,
        project_id: publicationProjectId
          ? Number(publicationProjectId)
          : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail ||
            (editingPublication
              ? "Could not update publication"
              : "Could not create publication")
        );
        return;
      }

      if (editingPublication) {
        setPublications((current) =>
          current.map((publication) =>
            publication.id === data.id
              ? data
              : publication
          )
        );

        setMessage(
          "Publication updated successfully!"
        );
      } else {
        setPublications((current) => [
          data,
          ...current,
        ]);

        setPublicationPage(1);

        setMessage(
          "Publication created successfully!"
        );
      }

      closePublicationForm(false);
    } catch (error) {
      console.error("Save publication error:", error);
      setMessage(
        "Could not connect to the publications API."
      );
    }
  };

  // -----------------------------------------
  // DELETE PUBLICATION
  // -----------------------------------------

  const handleDeletePublication = async (
    publicationId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this publication?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    setMessage("Deleting publication...");

    try {
      const response = await fetch(
        `${API}/publications/${publicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Could not delete publication"
        );
        return;
      }

      setPublications((current) =>
        current.filter(
          (publication) =>
            publication.id !== publicationId
        )
      );

      setPublicationPage(1);
      setMessage("Publication deleted successfully!");
    } catch (error) {
      console.error("Delete publication error:", error);
      setMessage(
        "Could not connect to the publications API."
      );
    }
  };

  // -----------------------------------------
  // LOAD USERS
  // -----------------------------------------

  const loadUsers = async (token) => {
    try {
      const response = await fetch(`${API}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Could not load users");
        return;
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Users error:", error);
      setMessage("Could not connect to the users API.");
    }
  };

  // -----------------------------------------
  // ADD USER
  // -----------------------------------------

  const openAddUserForm = () => {
    setEditingUser(null);
    setUserFormUsername("");
    setUserFormEmail("");
    setUserFormPassword("");
    setUserFormRole("Researcher");
    setMessage("");
    setShowUserForm(true);
  };

  // -----------------------------------------
  // EDIT USER
  // -----------------------------------------

  const openEditUserForm = (user) => {
    setEditingUser(user);
    setUserFormUsername(user.username || "");
    setUserFormEmail(user.email || "");
    setUserFormPassword("");
    setUserFormRole(user.role || "Researcher");
    setMessage("");
    setShowUserForm(true);
  };

  // -----------------------------------------
  // CLOSE USER FORM
  // -----------------------------------------

  const closeUserForm = (clearMessage = true) => {
    setShowUserForm(false);
    setEditingUser(null);
    setUserFormUsername("");
    setUserFormEmail("");
    setUserFormPassword("");
    setUserFormRole("Researcher");

    if (clearMessage) {
      setMessage("");
    }
  };

  // -----------------------------------------
  // SAVE / UPDATE USER
  // -----------------------------------------

  const handleUserFormSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    setMessage(
      editingUser
        ? "Updating user..."
        : "Creating user..."
    );

    try {
      const url = editingUser
        ? `${API}/users/${editingUser.id}`
        : `${API}/users/`;

      const method = editingUser ? "PUT" : "POST";

      const body = {
        username: userFormUsername,
        email: userFormEmail,
        password: userFormPassword,
        role: userFormRole,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail ||
            (editingUser
              ? "Could not update user"
              : "Could not create user")
        );
        return;
      }

      if (editingUser) {
        setUsers((current) =>
          current.map((user) =>
            user.id === data.id ? data : user
          )
        );

        setMessage("User updated successfully!");
      } else {
        setUsers((current) => [data, ...current]);
        setMessage("User created successfully!");
      }

      closeUserForm(false);
    } catch (error) {
      console.error("Save user error:", error);
      setMessage("Could not connect to the users API.");
    }
  };

  // -----------------------------------------
  // CURRENT USER ID
  // -----------------------------------------

  const getCurrentUserId = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);
    } catch {
      return null;
    }
  };

  // -----------------------------------------
  // DELETE USER
  // -----------------------------------------

  const handleDeleteUser = async (userId) => {
    if (userId === getCurrentUserId()) {
      setMessage(
        "You cannot delete the account you are currently using."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("Please login again.");
      return;
    }

    setMessage("Deleting user...");

    try {
      const response = await fetch(
        `${API}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Could not delete user"
        );
        return;
      }

      setUsers((current) =>
        current.filter((user) => user.id !== userId)
      );

      setMessage("User deleted successfully!");
    } catch (error) {
      console.error("Delete user error:", error);
      setMessage("Could not connect to the users API.");
    }
  };

  // -----------------------------------------
  // LOAD SAVED SESSION
  // -----------------------------------------

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    const role = getRoleFromToken();
    const tokenUsername = getUsernameFromToken();

    setUserRole(role);
    setUsername(tokenUsername);
    setLoggedIn(true);
    setShowHome(false);

    loadProjects(token);
    loadPublications(token);

    if (role === "Admin") {
      loadUsers(token);
    }
  }, []);

  // -----------------------------------------
  // SEARCH
  // -----------------------------------------

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      String(project.title || "")
        .toLowerCase()
        .includes(projectSearch.toLowerCase())
    );
  }, [projects, projectSearch]);

  const filteredPublications = useMemo(() => {
    return publications.filter((publication) =>
      `${publication.title || ""} ${
        publication.authors || ""
      } ${publication.journal || ""}`
        .toLowerCase()
        .includes(publicationSearch.toLowerCase())
    );
  }, [publications, publicationSearch]);

  const projectTotalPages = Math.max(
    1,
    Math.ceil(
      filteredProjects.length / itemsPerPage
    )
  );

  const publicationTotalPages = Math.max(
    1,
    Math.ceil(
      filteredPublications.length / itemsPerPage
    )
  );

  const visibleProjects = filteredProjects.slice(
    (projectPage - 1) * itemsPerPage,
    projectPage * itemsPerPage
  );

  const visiblePublications =
    filteredPublications.slice(
      (publicationPage - 1) * itemsPerPage,
      publicationPage * itemsPerPage
    );

  useEffect(() => {
    setProjectPage(1);
  }, [projectSearch]);

  useEffect(() => {
    setPublicationPage(1);
  }, [publicationSearch]);

  const getProjectTitle = (projectId) => {
    const project = projects.find(
      (item) => item.id === projectId
    );

    return project
      ? project.title
      : "No project";
  };

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setLoggedIn(false);
    setShowHome(true);
    setUserRole("");

    setProjects([]);
    setPublications([]);
    setUsers([]);

    setUsername("");
    setPassword("");
    setMessage("");
  };

  // -----------------------------------------
  // HOME
  // -----------------------------------------

  if (showHome && !loggedIn) {
    return (
      <Home
        onLogin={() => setShowHome(false)}
      />
    );
  }

  // -----------------------------------------
  // DASHBOARD
  // -----------------------------------------

  if (loggedIn) {
    return (
      <div style={styles.dashboard}>
        <Navigation
          username={username}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <header style={styles.dashboardHeader}>
          <div>
            <div style={styles.brandSmall}>
              AI RESEARCH TRACKER
            </div>

            <h1 style={styles.dashboardTitle}>
              Research Dashboard
            </h1>

            <p style={styles.welcomeText}>
              Welcome, <strong>{username}</strong>
            </p>

            <span style={styles.roleBadge}>
              {userRole || "User"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </header>

        {/* STATS */}

        <section style={styles.stats}>
          <StatCard
            icon="📁"
            number={projects.length}
            label="Total Projects"
          />

          <StatCard
            icon="📚"
            number={publications.length}
            label="Publications"
          />

          <StatCard
            icon="✅"
            number={
              projects.filter(
                (project) =>
                  project.status === "Completed"
              ).length
            }
            label="Completed"
          />

          {userRole === "Admin" && (
            <StatCard
              icon="👥"
              number={users.length}
              label="Users"
            />
          )}
        </section>

        {/* PROJECTS + PUBLICATIONS */}

        <div style={styles.sectionGrid}>
          {/* PROJECTS */}

          <section
            id="projects-section"
            style={styles.largeCard}
          >
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.sectionEyebrow}>
                  RESEARCH WORK
                </p>

                <h2 style={styles.sectionTitle}>
                  Projects
                </h2>

                <p style={styles.sectionDescription}>
                  Create and manage your research projects.
                </p>
              </div>

              <button
                style={styles.primaryButton}
                onClick={openAddProjectForm}
              >
                + Add Project
              </button>
            </div>

            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search projects..."
              value={projectSearch}
              onChange={(event) =>
                setProjectSearch(event.target.value)
              }
            />

            {filteredProjects.length === 0 ? (
              <EmptyState
                icon="📁"
                title="No projects found"
                text="Create your first research project."
              />
            ) : (
              <div>
                {visibleProjects.map((project) => (
                  <article
                    key={project.id}
                    style={styles.projectCard}
                  >
                    <h3 style={styles.itemTitle}>
                      {project.title}
                    </h3>

                    <span style={styles.statusBadge}>
                      {project.status}
                    </span>

                    <p style={styles.itemDescription}>
                      {project.description ||
                        "No description provided."}
                    </p>

                    <div style={styles.itemActions}>
                      <button
                        onClick={() =>
                          openEditProjectForm(project)
                        }
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteProject(project.id)
                        }
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}

                <Pagination
                  page={projectPage}
                  totalPages={projectTotalPages}
                  onPrevious={() =>
                    setProjectPage(
                      Math.max(1, projectPage - 1)
                    )
                  }
                  onNext={() =>
                    setProjectPage(
                      Math.min(
                        projectTotalPages,
                        projectPage + 1
                      )
                    )
                  }
                />
              </div>
            )}
          </section>

          {/* PUBLICATIONS */}

          <section
            id="publications-section"
            style={styles.largeCard}
          >
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.sectionEyebrow}>
                  RESEARCH OUTPUT
                </p>

                <h2 style={styles.sectionTitle}>
                  Publications
                </h2>

                <p style={styles.sectionDescription}>
                  Manage your papers and publications.
                </p>
              </div>

              <button
                style={styles.primaryButton}
                onClick={openAddPublicationForm}
              >
                + Add Publication
              </button>
            </div>

            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search title, author, or journal..."
              value={publicationSearch}
              onChange={(event) =>
                setPublicationSearch(
                  event.target.value
                )
              }
            />

            {filteredPublications.length === 0 ? (
              <EmptyState
                icon="📚"
                title="No publications found"
                text="Add your first research publication."
              />
            ) : (
              <div>
                {visiblePublications.map(
                  (publication) => (
                    <article
                      key={publication.id}
                      style={styles.projectCard}
                    >
                      <h3 style={styles.itemTitle}>
                        {publication.title}
                      </h3>

                      <p style={styles.detailLine}>
                        <strong>Authors:</strong>{" "}
                        {publication.authors ||
                          "Not provided"}
                      </p>

                      <p style={styles.detailLine}>
                        <strong>Journal:</strong>{" "}
                        {publication.journal ||
                          "Not provided"}
                      </p>

                      <p style={styles.detailLine}>
                        <strong>Year:</strong>{" "}
                        {publication.publication_year ||
                          "Not provided"}
                      </p>

                      <p style={styles.detailLine}>
                        <strong>Project:</strong>{" "}
                        {getProjectTitle(
                          publication.project_id
                        )}
                      </p>

                      {publication.doi && (
                        <p style={styles.detailLine}>
                          <strong>DOI:</strong>{" "}
                          {publication.doi}
                        </p>
                      )}

                      <div style={styles.itemActions}>
                        <button
                          onClick={() =>
                            openEditPublicationForm(
                              publication
                            )
                          }
                          style={styles.editButton}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeletePublication(
                              publication.id
                            )
                          }
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  )
                )}

                <Pagination
                  page={publicationPage}
                  totalPages={publicationTotalPages}
                  onPrevious={() =>
                    setPublicationPage(
                      Math.max(1, publicationPage - 1)
                    )
                  }
                  onNext={() =>
                    setPublicationPage(
                      Math.min(
                        publicationTotalPages,
                        publicationPage + 1
                      )
                    )
                  }
                />
              </div>
            )}
          </section>
        </div>

        {/* USER MANAGEMENT */}

        {userRole === "Admin" && (
          <section
            id="users-section"
            style={styles.largeCard}
          >
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.sectionEyebrow}>
                  ADMINISTRATION
                </p>

                <h2 style={styles.sectionTitle}>
                  User Management
                </h2>

                <p style={styles.sectionDescription}>
                  Manage researchers and administrators.
                </p>
              </div>

              <button
                style={styles.primaryButton}
                onClick={openAddUserForm}
              >
                + Add User
              </button>
            </div>

            {users.length === 0 ? (
              <EmptyState
                title="No users found"
                text="Create your first researcher account."
              />
            ) : (
              users.map((user) => (
                <article
                  key={user.id}
                  style={styles.projectCard}
                >
                  <h3 style={styles.itemTitle}>
                    {user.username}
                  </h3>

                  <p style={styles.detailLine}>
                    <strong>Email:</strong>{" "}
                    {user.email}
                  </p>

                  <p style={styles.detailLine}>
                    <strong>Role:</strong>{" "}
                    <span
                      style={
                        user.role === "Admin"
                          ? styles.adminBadge
                          : styles.researcherBadge
                      }
                    >
                      {user.role}
                    </span>
                  </p>

                  <div style={styles.itemActions}>
                    <button
                      onClick={() =>
                        openEditUserForm(user)
                      }
                      style={styles.editButton}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteUser(user.id)
                      }
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {/* ANALYTICS */}

        <section
          id="analytics-section"
          style={styles.largeCard}
        >
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                RESEARCH INSIGHTS
              </p>

              <h2 style={styles.sectionTitle}>
                Analytics
              </h2>

              <p style={styles.sectionDescription}>
                Overview of your research activity.
              </p>
            </div>
          </div>

          <div style={styles.analyticsGrid}>
            <StatCard
              icon="📁"
              number={projects.length}
              label="Total Projects"
            />

            <StatCard
              icon="🟢"
              number={
                projects.filter(
                  (project) =>
                    project.status === "Active"
                ).length
              }
              label="Active Projects"
            />

            <StatCard
              icon="✅"
              number={
                projects.filter(
                  (project) =>
                    project.status === "Completed"
                ).length
              }
              label="Completed Projects"
            />

            <StatCard
              icon="📚"
              number={publications.length}
              label="Publications"
            />
          </div>
        </section>

        <AIAssistant />

        {/* PROJECT MODAL */}

        {showProjectForm && (
          <Modal>
            <h2 style={styles.modalTitle}>
              {editingProject
                ? "Edit Project"
                : "Add New Project"}
            </h2>

            <form
              onSubmit={handleProjectFormSubmit}
            >
              <label style={styles.label}>
                Project Title
              </label>

              <input
                type="text"
                value={projectTitle}
                onChange={(event) =>
                  setProjectTitle(
                    event.target.value
                  )
                }
                placeholder="Enter project title"
                style={styles.input}
                required
              />

              <label style={styles.label}>
                Description
              </label>

              <textarea
                value={projectDescription}
                onChange={(event) =>
                  setProjectDescription(
                    event.target.value
                  )
                }
                placeholder="Enter project description"
                style={styles.textarea}
                rows="4"
              />

              <label style={styles.label}>
                Status
              </label>

              <select
                value={projectStatus}
                onChange={(event) =>
                  setProjectStatus(
                    event.target.value
                  )
                }
                style={styles.input}
              >
                <option value="Active">
                  Active
                </option>

                <option value="Planning">
                  Planning
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

              <div style={styles.modalButtons}>
                <button
                  type="button"
                  onClick={() =>
                    closeProjectForm()
                  }
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.primaryButton}
                >
                  {editingProject
                    ? "Update Project"
                    : "Save Project"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* PUBLICATION MODAL */}

        {showPublicationForm && (
          <Modal>
            <h2 style={styles.modalTitle}>
              {editingPublication
                ? "Edit Publication"
                : "Add New Publication"}
            </h2>

            <form
              onSubmit={
                handlePublicationFormSubmit
              }
            >
              <label style={styles.label}>
                Publication Title
              </label>

              <input
                type="text"
                value={publicationTitle}
                onChange={(event) =>
                  setPublicationTitle(
                    event.target.value
                  )
                }
                placeholder="Enter publication title"
                style={styles.input}
                required
              />

              <label style={styles.label}>
                Authors
              </label>

              <input
                type="text"
                value={publicationAuthors}
                onChange={(event) =>
                  setPublicationAuthors(
                    event.target.value
                  )
                }
                placeholder="Enter authors"
                style={styles.input}
              />

              <label style={styles.label}>
                Journal
              </label>

              <input
                type="text"
                value={publicationJournal}
                onChange={(event) =>
                  setPublicationJournal(
                    event.target.value
                  )
                }
                placeholder="Enter journal name"
                style={styles.input}
              />

              <label style={styles.label}>
                Publication Year
              </label>

              <input
                type="number"
                value={publicationYear}
                onChange={(event) =>
                  setPublicationYear(
                    event.target.value
                  )
                }
                placeholder="Enter year"
                style={styles.input}
              />

              <label style={styles.label}>
                DOI
              </label>

              <input
                type="text"
                value={publicationDoi}
                onChange={(event) =>
                  setPublicationDoi(
                    event.target.value
                  )
                }
                placeholder="Enter DOI"
                style={styles.input}
              />

              <label style={styles.label}>
                Project
              </label>

              <select
                value={publicationProjectId}
                onChange={(event) =>
                  setPublicationProjectId(
                    event.target.value
                  )
                }
                style={styles.input}
              >
                <option value="">
                  No Project
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

              <div style={styles.modalButtons}>
                <button
                  type="button"
                  onClick={() =>
                    closePublicationForm()
                  }
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.primaryButton}
                >
                  {editingPublication
                    ? "Update Publication"
                    : "Save Publication"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* USER MODAL */}

        {showUserForm && (
          <Modal>
            <h2 style={styles.modalTitle}>
              {editingUser
                ? "Edit User"
                : "Add New User"}
            </h2>

            <form
              onSubmit={handleUserFormSubmit}
            >
              <label style={styles.label}>
                Username
              </label>

              <input
                type="text"
                value={userFormUsername}
                onChange={(event) =>
                  setUserFormUsername(
                    event.target.value
                  )
                }
                placeholder="Enter username"
                style={styles.input}
                required
              />

              <label style={styles.label}>
                Email
              </label>

              <input
                type="email"
                value={userFormEmail}
                onChange={(event) =>
                  setUserFormEmail(
                    event.target.value
                  )
                }
                placeholder="Enter email"
                style={styles.input}
                required
              />

              <label style={styles.label}>
                Password
              </label>

              <input
                type="password"
                value={userFormPassword}
                onChange={(event) =>
                  setUserFormPassword(
                    event.target.value
                  )
                }
                placeholder={
                  editingUser
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                style={styles.input}
                required={!editingUser}
              />

              <label style={styles.label}>
                Role
              </label>

              <select
                value={userFormRole}
                onChange={(event) =>
                  setUserFormRole(
                    event.target.value
                  )
                }
                style={styles.input}
              >
                <option value="Researcher">
                  Researcher
                </option>

                <option value="Admin">
                  Admin
                </option>
              </select>

              <div style={styles.modalButtons}>
                <button
                  type="button"
                  onClick={() =>
                    closeUserForm()
                  }
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.primaryButton}
                >
                  {editingUser
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {message && (
          <div style={styles.messageBar}>
            {message}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------
  // LOGIN PAGE
  // -----------------------------------------

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginLeft}>
        <div style={styles.loginLogo}>
          AI
        </div>

        <p style={styles.loginEyebrow}>
          AI-ASSISTED RESEARCH PLATFORM
        </p>

        <h1 style={styles.loginTitle}>
          Research Tracker
        </h1>

        <p style={styles.loginDescription}>
          Manage research projects, publications,
          users, and research information through
          one secure platform.
        </p>

        <div style={styles.loginFeatures}>
          <FeatureRow
            icon="📁"
            title="Project Management"
            text="Track research projects easily."
          />

          <FeatureRow
            icon="📚"
            title="Publication Management"
            text="Keep publication information organized."
          />

          <FeatureRow
            icon="🤖"
            title="AI Assistance"
            text="Support research activities with AI."
          />
        </div>
      </div>

      <div style={styles.loginRight}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginHeading}>
            Welcome back
          </h2>

          <p style={styles.loginSubtitle}>
            Login to your research dashboard
          </p>

          <form onSubmit={handleLogin}>
            <label style={styles.label}>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              placeholder="Enter username"
              style={styles.input}
              required
            />

            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter password"
              style={styles.input}
              required
            />

            <button
              type="submit"
              style={styles.loginButton}
            >
              Login
            </button>
          </form>

          {message && (
            <p style={styles.errorMessage}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// STAT CARD
// ========================================

function StatCard({ icon, number, label }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>
        {icon}
      </div>

      <div>
        <div style={styles.statNumber}>
          {number}
        </div>

        <div style={styles.statLabel}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ========================================
// FEATURE ROW
// ========================================

function FeatureRow({ icon, title, text }) {
  return (
    <div style={styles.loginFeature}>
      <span>{icon}</span>

      <div>
        <strong>{title}</strong>

        <p>{text}</p>
      </div>
    </div>
  );
}

// ========================================
// EMPTY STATE
// ========================================

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div style={styles.emptyState}>
      {icon && (
        <div style={styles.emptyIcon}>
          {icon}
        </div>
      )}

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

// ========================================
// PAGINATION
// ========================================

function Pagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}) {
  return (
    <div style={styles.pagination}>
      <button
        style={styles.pageButton}
        disabled={page === 1}
        onClick={onPrevious}
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        style={styles.pageButton}
        disabled={page === totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}

// ========================================
// MODAL
// ========================================

function Modal({ children }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        {children}
      </div>
    </div>
  );
}

// ========================================
// HOME COMPONENT
// ========================================

function Home({ onLogin }) {
  return (
    <div style={homeStyles.page}>
      <nav style={homeStyles.navbar}>
        <div style={homeStyles.logoArea}>
          <div style={homeStyles.logo}>
            AI
          </div>

          <div>
            <div style={homeStyles.brandName}>
              Research Tracker
            </div>

            <div style={homeStyles.brandTagline}>
              AI-Assisted Research Management
            </div>
          </div>
        </div>

        <button
          style={homeStyles.navButton}
          onClick={onLogin}
        >
          Login
        </button>
      </nav>

      <main>
        <section style={homeStyles.hero}>
          <div style={homeStyles.heroContent}>
            <div style={homeStyles.badge}>
              AI-ASSISTED RESEARCH PLATFORM
            </div>

            <h1 style={homeStyles.heroTitle}>
              Manage your research journey in one place.
            </h1>

            <p style={homeStyles.heroText}>
              Organize research projects, manage
              publications, monitor progress, and
              access research insights through one
              simple platform.
            </p>

            <div style={homeStyles.heroButtons}>
              <button
                style={homeStyles.primaryButton}
                onClick={onLogin}
              >
                Get Started
              </button>

              <button
                style={homeStyles.secondaryButton}
                onClick={onLogin}
              >
                Sign In
              </button>
            </div>
          </div>

          <div style={homeStyles.previewCard}>
            <div style={homeStyles.previewHeader}>
              <span>
                Research Overview
              </span>

              <span style={homeStyles.liveDot}>
                ●
              </span>
            </div>

            <div style={homeStyles.previewLine} />

            <div style={homeStyles.previewStats}>
              <PreviewStat
                title="Projects"
                text="Organize your work"
              />

              <PreviewStat
                title="Publications"
                text="Track your papers"
              />

              <PreviewStat
                title="Analytics"
                text="Understand progress"
              />

              <PreviewStat
                title="AI Assistant"
                text="Research support"
              />
            </div>
          </div>
        </section>

        <section style={homeStyles.featuresSection}>
          <div style={homeStyles.sectionHeading}>
            <p style={homeStyles.sectionEyebrow}>
              PLATFORM FEATURES
            </p>

            <h2>
              Everything for your research workflow
            </h2>

            <p>
              A central system for managing research
              projects and publications.
            </p>
          </div>

          <div style={homeStyles.featureGrid}>
            <Feature
              icon="📁"
              title="Project Management"
              text="Create, update, search and manage research projects."
            />

            <Feature
              icon="📚"
              title="Publication Management"
              text="Store and manage authors, journals, DOI and publication details."
            />

            <Feature
              icon="📊"
              title="Analytics"
              text="Monitor research activity and understand project progress."
            />

            <Feature
              icon="🤖"
              title="AI Assistance"
              text="Support research-related activities with intelligent AI features."
            />
          </div>
        </section>

        <section style={homeStyles.ctaSection}>
          <h2>
            Ready to manage your research?
          </h2>

          <p>
            Start using your research management
            platform today.
          </p>

          <button
            style={homeStyles.primaryButton}
            onClick={onLogin}
          >
            Open Research Tracker
          </button>
        </section>
      </main>

      <footer style={homeStyles.footer}>
        <p>
          AI-Assisted Research Project & Publication Tracker
        </p>

        <p>
          Research • Publications • Analytics • AI
        </p>
      </footer>
    </div>
  );
}

// ========================================
// PREVIEW STAT
// ========================================

function PreviewStat({ title, text }) {
  return (
    <div style={homeStyles.previewStat}>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

// ========================================
// FEATURE
// ========================================

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div style={homeStyles.featureCard}>
      <div style={homeStyles.featureIcon}>
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

// ========================================
// DASHBOARD STYLES
// ========================================

const styles = {
  dashboard: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    padding: "35px 5%",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#172033",
  },

  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    maxWidth: "1400px",
    margin: "0 auto 30px",
  },

  brandSmall: {
    fontSize: "12px",
    letterSpacing: "2px",
    color: "#2563eb",
    fontWeight: "800",
    marginBottom: "8px",
  },

  dashboardTitle: {
    margin: 0,
    fontSize: "34px",
  },

  welcomeText: {
    color: "#64748b",
    marginBottom: "10px",
  },

  logoutButton: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "10px",
    background: "#172033",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  roleBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "700",
  },

  stats: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "white",
    padding: "22px",
    borderRadius: "16px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.07)",
  },

  statIcon: {
    fontSize: "28px",
  },

  statNumber: {
    fontSize: "28px",
    fontWeight: "800",
  },

  statLabel: {
    marginTop: "4px",
    color: "#64748b",
    fontSize: "14px",
  },

  sectionGrid: {
    maxWidth: "1400px",
    margin: "25px auto 0",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "24px",
  },

  largeCard: {
    background: "white",
    padding: "28px",
    borderRadius: "18px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.07)",
    marginBottom: "24px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "22px",
  },

  sectionEyebrow: {
    margin: 0,
    color: "#2563eb",
    fontSize: "11px",
    letterSpacing: "1.5px",
    fontWeight: "800",
  },

  sectionTitle: {
    margin: "6px 0",
    fontSize: "25px",
  },

  sectionDescription: {
    margin: 0,
    color: "#64748b",
  },

  primaryButton: {
    padding: "11px 17px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    marginBottom: "18px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "14px",
    outline: "none",
  },

  projectCard: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "18px",
    marginTop: "18px",
  },

  itemTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
  },

  itemDescription: {
    color: "#64748b",
    lineHeight: "1.6",
  },

  statusBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#15803d",
    fontSize: "12px",
    fontWeight: "700",
  },

  detailLine: {
    margin: "7px 0",
    color: "#475569",
  },

  itemActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  editButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  deleteButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "7px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  adminBadge: {
    padding: "4px 9px",
    borderRadius: "15px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: "12px",
  },

  researcherBadge: {
    padding: "4px 9px",
    borderRadius: "15px",
    background: "#dcfce7",
    color: "#15803d",
    fontWeight: "700",
    fontSize: "12px",
  },

  emptyState: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "38px",
    marginBottom: "10px",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "14px",
    marginTop: "22px",
    paddingTop: "17px",
    borderTop: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "14px",
  },

  pageButton: {
    padding: "8px 13px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "white",
    color: "#334155",
    cursor: "pointer",
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    overflowY: "auto",
    zIndex: 1000,
  },

  modalCard: {
    width: "470px",
    maxWidth: "100%",
    background: "white",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 20px 70px rgba(0,0,0,0.25)",
  },

  modalTitle: {
    marginTop: 0,
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginTop: "16px",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
  },

  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "25px",
  },

  cancelButton: {
    padding: "10px 18px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "white",
    color: "#334155",
    cursor: "pointer",
  },

  messageBar: {
    position: "fixed",
    right: "25px",
    bottom: "25px",
    background: "#172033",
    color: "white",
    padding: "13px 18px",
    borderRadius: "10px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)",
    zIndex: 1500,
  },

  // LOGIN

  loginPage: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns:
      "1.15fr 0.85fr",
    fontFamily: "Inter, Arial, sans-serif",
    background:
      "linear-gradient(135deg, #0f172a, #1e3a8a)",
  },

  loginLeft: {
    padding: "70px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  loginRight: {
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },

  loginLogo: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    background: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    fontSize: "21px",
    marginBottom: "25px",
  },

  loginEyebrow: {
    fontSize: "12px",
    letterSpacing: "2px",
    fontWeight: "800",
    opacity: 0.85,
  },

  loginTitle: {
    fontSize: "56px",
    margin: "15px 0",
  },

  loginDescription: {
    maxWidth: "650px",
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#dbeafe",
  },

  loginFeatures: {
    marginTop: "35px",
    display: "grid",
    gap: "20px",
  },

  loginFeature: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
  },

  loginCard: {
    width: "420px",
    maxWidth: "100%",
    background: "white",
    padding: "38px",
    borderRadius: "18px",
    boxShadow:
      "0 20px 60px rgba(15,23,42,0.12)",
  },

  loginHeading: {
    margin: 0,
    fontSize: "30px",
  },

  loginSubtitle: {
    color: "#64748b",
    marginBottom: "25px",
  },

  loginButton: {
    width: "100%",
    marginTop: "25px",
    padding: "13px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  errorMessage: {
    color: "#dc2626",
    textAlign: "center",
    marginTop: "18px",
  },
};

// ========================================
// HOME STYLES
// ========================================

const homeStyles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#172033",
    background: "#f8fafc",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 7%",
    background: "white",
    borderBottom:
      "1px solid #e2e8f0",
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    width: "45px",
    height: "45px",
    borderRadius: "11px",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
  },

  brandName: {
    fontSize: "19px",
    fontWeight: "800",
  },

  brandTagline: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },

  navButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  hero: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "90px 7%",
    display: "grid",
    gridTemplateColumns:
      "1.1fr 0.9fr",
    alignItems: "center",
    gap: "60px",
  },

  heroContent: {
    maxWidth: "680px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 13px",
    borderRadius: "20px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "11px",
    letterSpacing: "1px",
    fontWeight: "800",
  },

  heroTitle: {
    fontSize: "54px",
    lineHeight: "1.08",
    margin: "22px 0",
  },

  heroText: {
    fontSize: "18px",
    lineHeight: "1.75",
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
    borderRadius: "9px",
    background: "#2563eb",
    color: "white",
    fontWeight: "800",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "13px 24px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "white",
    color: "#334155",
    fontWeight: "800",
    cursor: "pointer",
  },

  previewCard: {
    background: "white",
    borderRadius: "20px",
    padding: "28px",
    boxShadow:
      "0 20px 60px rgba(15,23,42,0.10)",
  },

  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "19px",
    fontWeight: "800",
  },

  liveDot: {
    color: "#16a34a",
    fontSize: "14px",
  },

  previewLine: {
    height: "1px",
    background: "#e2e8f0",
    margin: "20px 0",
  },

  previewStats: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
  },

  previewStat: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  featuresSection: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "30px 7% 80px",
  },

  sectionHeading: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 35px",
  },

  sectionEyebrow: {
    color: "#2563eb",
    fontWeight: "800",
    letterSpacing: "1.5px",
    fontSize: "11px",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "20px",
  },

  featureCard: {
    background: "white",
    borderRadius: "15px",
    padding: "26px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.06)",
  },

  featureIcon: {
    fontSize: "31px",
    marginBottom: "12px",
  },

  ctaSection: {
    textAlign: "center",
    padding: "80px 7%",
    background:
      "linear-gradient(135deg, #eff6ff, #eef2ff)",
  },

  footer: {
    background: "#172033",
    color: "white",
    padding: "30px 7%",
    textAlign: "center",
  },
};

export default App;