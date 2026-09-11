import { useState } from "react";

function AIAssistant() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = () => {
    const cleanTopic = topic.trim();

    if (!cleanTopic) {
      setResult({
        error: "Please enter a research topic.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    // Local research-assistance logic.
    // No external API is required.

    setTimeout(() => {
      setResult({
        topic: cleanTopic,

        questions: [
          `What are the current challenges related to ${cleanTopic}?`,
          `What methods can improve outcomes in ${cleanTopic}?`,
          `What are the practical applications of ${cleanTopic}?`,
          `What limitations should researchers consider in ${cleanTopic}?`,
          `What future research opportunities exist in ${cleanTopic}?`,
        ],

        objectives: [
          `Study the current state of ${cleanTopic}.`,
          `Identify major challenges and research gaps.`,
          `Analyze possible solutions and approaches.`,
          `Evaluate practical applications.`,
          `Identify opportunities for future research.`,
        ],

        keywords: [
          cleanTopic,
          "research",
          "technology",
          "innovation",
          "analysis",
          "study",
          "development",
        ],

        areas: [
          "Current research trends",
          "Research challenges",
          "Practical applications",
          "Technology and innovation",
          "Future research opportunities",
        ],
      });

      setLoading(false);
    }, 800);
  };

  const clearAssistant = () => {
    setTopic("");
    setResult(null);
  };

  return (
    <section
      id="ai-assistant-section"
      style={styles.container}
    >
      {/* HEADER */}

      <div style={styles.header}>
        <p style={styles.eyebrow}>
          INTELLIGENT RESEARCH SUPPORT
        </p>

        <h2 style={styles.title}>
          AI Research Assistant
        </h2>

        <p style={styles.description}>
          Enter a research topic to generate questions,
          objectives, keywords, and possible research areas.
        </p>
      </div>

      {/* INPUT CARD */}

      <div style={styles.inputCard}>
        <label style={styles.label}>
          Research Topic
        </label>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Example: Artificial Intelligence in Education"
          rows="4"
          style={styles.textarea}
        />

        <div style={styles.buttonRow}>
          <button
            onClick={generateSuggestions}
            disabled={loading}
            style={styles.generateButton}
          >
            {loading
              ? "Generating..."
              : "Generate Suggestions"}
          </button>

          <button
            onClick={clearAssistant}
            style={styles.clearButton}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ERROR */}

      {result?.error && (
        <div style={styles.errorCard}>
          {result.error}
        </div>
      )}

      {/* RESULTS */}

      {result && !result.error && (
        <div style={styles.resultsContainer}>

          {/* TOPIC */}

          <div style={styles.topicCard}>
            <p style={styles.smallHeading}>
              RESEARCH TOPIC
            </p>

            <h3 style={styles.topicTitle}>
              {result.topic}
            </h3>
          </div>

          {/* RESEARCH QUESTIONS */}

          <div style={styles.resultCard}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>❓</span>

              <h3>
                Research Questions
              </h3>
            </div>

            <ol style={styles.list}>
              {result.questions.map(
                (question, index) => (
                  <li
                    key={index}
                    style={styles.listItem}
                  >
                    {question}
                  </li>
                )
              )}
            </ol>
          </div>

          {/* OBJECTIVES */}

          <div style={styles.resultCard}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>🎯</span>

              <h3>
                Research Objectives
              </h3>
            </div>

            <ol style={styles.list}>
              {result.objectives.map(
                (objective, index) => (
                  <li
                    key={index}
                    style={styles.listItem}
                  >
                    {objective}
                  </li>
                )
              )}
            </ol>
          </div>

          {/* KEYWORDS */}

          <div style={styles.resultCard}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>🔑</span>

              <h3>
                Suggested Keywords
              </h3>
            </div>

            <div style={styles.keywordContainer}>
              {result.keywords.map(
                (keyword, index) => (
                  <span
                    key={index}
                    style={styles.keyword}
                  >
                    {keyword}
                  </span>
                )
              )}
            </div>
          </div>

          {/* AREAS */}

          <div style={styles.resultCard}>
            <div style={styles.cardHeader}>
              <span style={styles.icon}>💡</span>

              <h3>
                Possible Research Areas
              </h3>
            </div>

            <div style={styles.areaGrid}>
              {result.areas.map(
                (area, index) => (
                  <div
                    key={index}
                    style={styles.areaCard}
                  >
                    {area}
                  </div>
                )
              )}
            </div>
          </div>

          {/* NOTICE */}

          <div style={styles.notice}>
            <strong>Note:</strong> These suggestions
            are generated locally as an AI-assistance
            prototype and should be reviewed by the
            researcher before use.
          </div>

        </div>
      )}
    </section>
  );
}

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "25px auto",
    backgroundColor: "white",
    borderRadius: "18px",
    padding: "30px",
    boxSizing: "border-box",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.07)",
  },

  header: {
    marginBottom: "25px",
  },

  eyebrow: {
    margin: 0,
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  title: {
    margin: "7px 0",
    fontSize: "29px",
  },

  description: {
    margin: 0,
    color: "#64748b",
    lineHeight: "1.6",
  },

  inputCard: {
    backgroundColor: "#f8fafc",
    padding: "22px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
    outline: "none",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  generateButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  clearButton: {
    padding: "11px 18px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#334155",
    fontWeight: "700",
    cursor: "pointer",
  },

  errorCard: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "600",
  },

  resultsContainer: {
    marginTop: "25px",
    display: "grid",
    gap: "18px",
  },

  topicCard: {
    padding: "22px",
    borderRadius: "14px",
    backgroundColor: "#eff6ff",
    border: "1px solid #dbeafe",
  },

  smallHeading: {
    margin: 0,
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  topicTitle: {
    margin: "7px 0 0",
    fontSize: "21px",
  },

  resultCard: {
    padding: "23px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },

  icon: {
    fontSize: "23px",
  },

  list: {
    margin: 0,
    paddingLeft: "24px",
  },

  listItem: {
    marginBottom: "10px",
    color: "#475569",
    lineHeight: "1.6",
  },

  keywordContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
  },

  keyword: {
    padding: "7px 11px",
    borderRadius: "20px",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "700",
  },

  areaGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px",
  },

  areaCard: {
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontWeight: "600",
  },

  notice: {
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontSize: "13px",
    lineHeight: "1.6",
  },
};

export default AIAssistant;