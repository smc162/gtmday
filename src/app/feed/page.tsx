"use client";

const FEED_URL =
  process.env.NEXT_PUBLIC_FEED_URL ?? "https://news.ycombinator.com/";

export default function FeedPage() {
  return (
    <div className="page-shell">
      <h1 className="page-heading">Social feed</h1>
      <p className="page-subtitle">Slow ambient scroll</p>

      <section className="card feed-card">
        <p className="muted">
          This frame slowly drifts through the embedded page. Update{" "}
          <code>NEXT_PUBLIC_FEED_URL</code> to point it at the feed you want
          visible during GTM Day.
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

