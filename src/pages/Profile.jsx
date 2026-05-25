import { useStore } from "../hooks/useStore";
import { SHOWS } from "../data/seed";
import Stars from "../components/Stars";

export default function Profile() {
  const { state } = useStore();

  const allEntries = [];
  let totalMinutes = 0;
  let totalRated = 0;
  let ratingSum = 0;
  let totalNotes = 0;

  SHOWS.forEach((show) => {
    const prog = state.progress[show.id];
    if (!prog) return;
    show.seasons.forEach((season) => {
      season.episodes.forEach((ep) => {
        const key = `s${season.number}e${ep.n}`;
        const epData = prog.episodes[key];
        if (epData?.watched) {
          totalMinutes += ep.runtime;
          allEntries.push({ show, ep, season: season.number, epData });
          if (epData.rating > 0) { totalRated++; ratingSum += epData.rating; }
          if (epData.note) totalNotes++;
        }
      });
    });
  });

  const avgRating = totalRated > 0 ? (ratingSum / totalRated).toFixed(1) : "—";
  const showsWatching = SHOWS.filter((s) => state.progress[s.id]?.watching).length;

  const topShows = SHOWS.map((show) => {
    const prog = state.progress[show.id];
    if (!prog) return null;
    const allEps = show.seasons.flatMap((s) => s.episodes.map((e) => `s${s.number}e${e.n}`));
    const watched = allEps.filter((k) => prog.episodes[k]?.watched).length;
    if (!watched) return null;
    return { show, watched, total: allEps.length };
  })
    .filter(Boolean)
    .sort((a, b) => b.watched - a.watched);

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
          <div
            className="avatar"
            style={{
              width: 56,
              height: 56,
              fontSize: 18,
              background: "var(--accent-dim)",
              color: "var(--accent)",
              border: "2px solid var(--accent)",
            }}
          >
            ME
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>Your Profile</h1>
            <p className="page-subtitle">Member since 2024</p>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-box">
          <div className="stat-val">{allEntries.length}</div>
          <div className="stat-lbl">episodes watched</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{Math.round(totalMinutes / 60)}h</div>
          <div className="stat-lbl">watch time</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{showsWatching}</div>
          <div className="stat-lbl">shows tracking</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{avgRating}</div>
          <div className="stat-lbl">avg rating</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{totalNotes}</div>
          <div className="stat-lbl">notes written</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{totalRated}</div>
          <div className="stat-lbl">eps rated</div>
        </div>
      </div>

      <h2 style={{ fontSize: 13, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.85rem" }}>
        Shows progress
      </h2>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        {topShows.length === 0 && (
          <div style={{ padding: "1.25rem", color: "var(--text2)", fontSize: 14 }}>No shows yet.</div>
        )}
        {topShows.map(({ show, watched, total }, i) => (
          <div
            key={show.id}
            style={{
              padding: "1rem 1.25rem",
              borderBottom: i < topShows.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{show.title}</span>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{watched}/{total}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(watched / total) * 100}%`, background: show.color }} />
            </div>
          </div>
        ))}
      </div>

      {totalNotes > 0 && (
        <>
          <h2 style={{ fontSize: 13, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.85rem" }}>
            Recent notes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {allEntries
              .filter((e) => e.epData.note)
              .slice(-5)
              .reverse()
              .map((entry, i) => (
                <div key={i} className="card card-padded">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {entry.show.title} S{entry.season}E{entry.ep.n}
                    </span>
                    <Stars value={entry.epData.rating} readonly />
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text2)", fontStyle: "italic" }}>
                    "{entry.epData.note}"
                  </p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
