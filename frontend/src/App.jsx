import { useState } from "react";
import {
  Video,
  Sparkles,
  Link2,
  FileText,
  ListChecks,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

import "./App.css";

const API_URL = "http://localhost:8000";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSummarize(event) {
    event.preventDefault();

    if (!url.trim()) {
      setError("Please paste a Video video link first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch(`${API_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to summarize this video.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure FastAPI is running on port 8000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function buildNotes() {
    if (!result) return "";

    return [
      "Video SUMMARIZER",
      "",
      `Video: ${result.title || "Video video"}`,
      `Link: ${url}`,
      "",
      "SUMMARY",
      result.summary,
      "",
      "KEY TAKEAWAYS",
      ...result.key_takeaways.map((item, index) => `${index + 1}. ${item}`),
      "",
      "IMPORTANT TOPICS",
      ...result.topics.map(
        (topic) => `${topic.timestamp} — ${topic.title}\n${topic.description}\n${topic.Video_url}`
      ),
    ].join("\n");
  }

  async function copyNotes() {
    try {
      await navigator.clipboard.writeText(buildNotes());
      setCopied(true);
    } catch {
      setError("Unable to copy automatically. Please copy the text manually.");
    }
  }

  function downloadNotes() {
    const blob = new Blob([buildNotes()], {
      type: "text/plain;charset=utf-8",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "Video-summary.txt";
    link.click();
    URL.revokeObjectURL(downloadUrl);
  }

  function startOver() {
    setUrl("");
    setResult(null);
    setError("");
    setCopied(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="Video Summarizer home">
          <span className="brand-icon">
            <Video size={25} />
          </span>
          <span>Video<span className="brand-accent">Summarizer</span></span>
        </a>
        <a className="nav-link" href="#features">Features</a>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="eyebrow">
            <Sparkles size={15} />
            YOUR AI VIDEO ASSISTANT
          </div>

          <h1>
            Watch less.
            <br />
            <span>Understand more.</span>
          </h1>

          <p className="hero-description">
            Turn long Video videos into concise summaries, useful takeaways,
            and timestamped notes in seconds.
          </p>

          <form className="url-form" onSubmit={handleSummarize}>
            <div className="input-wrap">
              <Link2 size={21} />
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="Paste your Video video link here..."
                aria-label="Video video URL"
                required
              />
              {url && (
                <button
                  type="button"
                  className="clear-input"
                  onClick={() => setUrl("")}
                  aria-label="Clear URL"
                >
                  ×
                </button>
              )}
            </div>

            <button className="summarize-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={19} />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Summarize video
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="helper-text">
            <CheckCircle2 size={15} />
            Free to try · Videos need accessible transcripts
          </p>

          {loading && (
            <div className="loading-card" role="status">
              <LoaderCircle className="spin loading-icon" size={28} />
              <div>
                <strong>Working on your summary...</strong>
                <p>Retrieving captions and asking AI to find the key ideas.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message" role="alert">
              <AlertCircle size={20} />
              <div>
                <strong>We couldn't summarize this video</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
        </section>

        {result && (
          <section className="results-section" aria-live="polite">
            <div className="results-heading">
              <div>
                <div className="eyebrow">
                  <CheckCircle2 size={15} />
                  SUMMARY READY
                </div>
                <h2>Your video, simplified.</h2>
                <p>Here are the most important things to know.</p>
              </div>
              <button className="secondary-btn" onClick={startOver}>
                <RotateCcw size={16} />
                New video
              </button>
            </div>

            <div className="video-card">
              <a
                className="thumbnail-link"
                href={`https://www.Video.com/watch?v=${result.video_id}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Open original Video video"
              >
                <img
                  className="thumbnail"
                  src={result.thumbnail_url}
                  alt="Video video thumbnail"
                />
                <span className="play-overlay">
                  <Video size={28} />
                </span>
              </a>
              <div className="video-details">
                <span className="content-label">VIDEO OVERVIEW</span>
                <h3>{result.title || "Your Video video"}</h3>
                <a
                  href={`https://www.Video.com/watch?v=${result.video_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="original-link"
                >
                  Watch on Video <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="result-card">
              <div className="card-heading">
                <span className="section-icon purple">
                  <FileText size={20} />
                </span>
                <div>
                  <h3>Concise summary</h3>
                  <p>The main ideas, without the extra noise.</p>
                </div>
              </div>
              <p className="summary-text">{result.summary}</p>
              <div className="card-actions">
                <button className="secondary-btn" onClick={copyNotes}>
                  <Copy size={16} />
                  {copied ? "Copied!" : "Copy all notes"}
                </button>
                <button className="secondary-btn" onClick={downloadNotes}>
                  <Download size={16} />
                  Download notes
                </button>
              </div>
            </div>

            <div className="result-card">
              <div className="card-heading">
                <span className="section-icon green">
                  <ListChecks size={20} />
                </span>
                <div>
                  <h3>Key takeaways</h3>
                  <p>The points worth remembering.</p>
                </div>
              </div>
              <ol className="takeaways-list">
                {result.key_takeaways.map((item, index) => (
                  <li key={`${index}-${item}`}>
                    <span className="takeaway-number">{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {result.topics?.length > 0 && (
              <div className="result-card">
                <div className="card-heading">
                  <span className="section-icon orange">
                    <Clock3 size={20} />
                  </span>
                  <div>
                    <h3>Important topics</h3>
                    <p>Jump directly to a topic in the video.</p>
                  </div>
                </div>
                <div className="topics-list">
                  {result.topics.map((topic, index) => (
                    <a
                      className="topic-item"
                      key={`${index}-${topic.timestamp_seconds}`}
                      href={topic.Video_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="topic-time">{topic.timestamp}</span>
                      <span className="topic-copy">
                        <strong>{topic.title}</strong>
                        <span>{topic.description}</span>
                      </span>
                      <ExternalLink size={16} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="features-section" id="features">
          <div className="eyebrow">BUILT FOR BETTER LEARNING</div>
          <h2>Everything important.<br />Nothing unnecessary.</h2>

          <div className="features-grid">
            <article className="feature-card">
              <span className="section-icon purple"><Sparkles size={21} /></span>
              <h3>AI-powered summaries</h3>
              <p>Understand lengthy videos through clear, concise explanations.</p>
            </article>
            <article className="feature-card">
              <span className="section-icon green"><ListChecks size={21} /></span>
              <h3>Key takeaways</h3>
              <p>Keep the main lessons and important details in one place.</p>
            </article>
            <article className="feature-card">
              <span className="section-icon orange"><Clock3 size={21} /></span>
              <h3>Timestamped topics</h3>
              <p>Jump to useful sections when transcript timestamps are available.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
         <span className="brand-icon"><Video size={22} /></span>
          <span>Video<span className="brand-accent">Summarizer</span></span>
        </a>
        <p>Spend less time watching. More time learning.</p>
      </footer>
    </div>
  );
}

export default App;
