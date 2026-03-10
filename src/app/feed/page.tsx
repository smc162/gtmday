"use client";

const FEED_URL = "https://www.linkedin.com/company/akatos/";

export default function FeedPage() {
  return (
    <div className="page-shell">
      <h1 className="page-heading">Social feed</h1>
      <p className="page-subtitle">Slow ambient scroll</p>

      <section className="card feed-card">
        <p className="muted">
          This frame slowly drifts through the embedded page, currently pointed
          at the{" "}
          <a
            href={FEED_URL}
            target="_blank"
            rel="noreferrer"
          >
            Akatos LinkedIn page
          </a>
          .
        </p>
        <div className="feed-window">
          <div className="feed-inner">
            <iframe
              title="Ambient feed"
              src={FEED_URL}
              className="feed-iframe"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

