import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import { SHOWS } from "../data/seed";

export default function Home() {
  const { state } = useStore();
  const navigate = useNavigate();

  const watching = SHOWS.filter((s) => state.progress[s.id]?.watching);
  const notStarted = SHOWS.filter((s) => !state.progress[s.id]?.watching);

  function getProgress(show) {
    const prog = state.progress[show.id];
    if (!prog) return { watched: 0, total: 0 };
    const allEps = show.seasons.flatMap((s) =>
      s.episodes.map((e) => `s${s.number}e${e.n}`)
    );
    const watched = allEps.filter((k) => prog.episodes[k]?.watched).length;
    return { watched, total: allEps.length };
  }

  function getSeasonProgress(show) {
    const prog = state.progress[show.id];
    const results = [];
    show.seasons.forEach((season) => {
      const watched = season.episodes.filter(
        (ep) => prog?.episodes[`s${season.number}e${ep.n}`]?.watched
      ).length;
      results.push({ s: season.number, watched, total: season.episodes.length });
    });
    return results;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Your Watchlist</h1>
        <p className="page-subtitle">Track every episode, season by season.</p>
      </div>

      {watching.length > 0 && (
        <>
          <h2 style={{ fontSize: 13, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.85rem" }}>
            Currently watching
          </h2>
          <div className="show-grid" style={{ marginBottom: "2rem" }}>
            {watching.map((show) => {
              const { watched, total } = getProgress(show);
              const pct = total ? (watched / total) * 100 : 0;
              const seasons = getSeasonProgress(show);
              return (
                <div
                  key={show.id}
                  className="show-card"
                  onClick={() => navigate(`/show/${show.id}`)}
                >
                  <div
                    className="show-card-banner"
                    style={{ background: show.color + "cc" }}
                  >
                    {show.title}
                  </div>
                  <div className="show-card-body">
                    <div className="show-card-title">{show.title}</div>
                    <div className="show-card-meta">
                      {show.year} · {show.network} · {show.seasons.length} season{show.seasons.length > 1 ? "s" : ""}
                    </div>
                    <div className="show-card-progress">
                      <span>{watched} / {total} eps</span>
                      <span style={{ color: "var(--accent)" }}>{Math.round(pct)}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                      {seasons.map((s) => (
                        <span
                          key={s.s}
                          style={{
                            fontSize: 11,
                            padding: "2px 7px",
                            borderRadius: 99,
                            background: s.watched === s.total ? "var(--accent-dim)" : "var(--bg3)",
                            color: s.watched === s.total ? "var(--accent)" : "var(--text3)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          S{s.s}: {s.watched}/{s.total}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {notStarted.length > 0 && (
        <>
          <h2 style={{ fontSize: 13, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.85rem" }}>
            Add to watchlist
          </h2>
          <div className="show-grid">
            {notStarted.map((show) => (
              <div
                key={show.id}
                className="show-card"
                onClick={() => navigate(`/show/${show.id}`)}
                style={{ opacity: 0.7 }}
              >
                <div
                  className="show-card-banner"
                  style={{ background: show.color + "66" }}
                >
                  {show.title}
                </div>
                <div className="show-card-body">
                  <div className="show-card-title">{show.title}</div>
                  <div className="show-card-meta">
                    {show.year} · {show.network}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--accent)" }}>+ Add to watchlist</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {watching.length === 0 && notStarted.length === 0 && (
        <div className="empty-state">
          <p>No shows yet — head to Discover to add some.</p>
        </div>
      )}
    </div>
  );
}
