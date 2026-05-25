import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import { SHOWS } from "../data/seed";
import Stars from "../components/Stars";

export default function Diary() {
  const { state } = useStore();
  const navigate = useNavigate();

  const entries = [];

  SHOWS.forEach((show) => {
    const prog = state.progress[show.id];
    if (!prog) return;
    show.seasons.forEach((season) => {
      season.episodes.forEach((ep) => {
        const key = `s${season.number}e${ep.n}`;
        const epData = prog.episodes[key];
        if (epData?.watched && epData.watchedAt) {
          entries.push({
            show,
            season: season.number,
            ep,
            epData,
            watchedAt: new Date(epData.watchedAt),
          });
        }
      });
    });
  });

  entries.sort((a, b) => b.watchedAt - a.watchedAt);

  function formatDate(d) {
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function groupByDate(entries) {
    const groups = {};
    entries.forEach((e) => {
      const label = formatDate(e.watchedAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(e);
    });
    return groups;
  }

  const groups = groupByDate(entries);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Watch Diary</h1>
        <p className="page-subtitle">Every episode you've watched, in order.</p>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No entries yet. Start watching a show to build your diary.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
            onClick={() => navigate("/")}
          >
            Go to watchlist
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {Object.entries(groups).map(([date, items]) => (
            <div key={date}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text3)",
                  marginBottom: "0.6rem",
                }}
              >
                {date}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map((entry, i) => (
                  <div
                    key={i}
                    className="diary-entry"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/show/${entry.show.id}`)}
                  >
                    <div className="diary-entry-header">
                      <div>
                        <div className="diary-entry-title">
                          {entry.show.title}
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text3)",
                              fontWeight: 400,
                              marginLeft: 8,
                            }}
                          >
                            S{entry.season} E{entry.ep.n} — {entry.ep.title}
                          </span>
                        </div>
                        <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
                          <Stars value={entry.epData.rating} readonly />
                          <span style={{ fontSize: 12, color: "var(--text3)" }}>
                            {entry.ep.runtime}m
                          </span>
                        </div>
                        {entry.epData.note && (
                          <div className="diary-entry-note">"{entry.epData.note}"</div>
                        )}
                      </div>
                      <div
                        style={{
                          width: 36,
                          height: 50,
                          borderRadius: 4,
                          background: entry.show.color + "99",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 9,
                          color: "#fff",
                          textAlign: "center",
                          lineHeight: 1.2,
                          padding: 4,
                          flexShrink: 0,
                        }}
                      >
                        {entry.show.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
