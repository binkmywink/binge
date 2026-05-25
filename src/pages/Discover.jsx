import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SHOWS } from "../data/seed";
import { useStore } from "../hooks/useStore";

export default function Discover() {
  const [query, setQuery] = useState("");
  const { state, addShow } = useStore();
  const navigate = useNavigate();

  const results = SHOWS.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.genres.some((g) => g.toLowerCase().includes(query.toLowerCase())) ||
    s.network.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Discover</h1>
        <p className="page-subtitle">Find your next obsession.</p>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search by title, genre, or network…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="show-grid">
        {results.map((show) => {
          const watching = state.progress[show.id]?.watching;
          const totalEps = show.seasons.flatMap((s) => s.episodes).length;
          return (
            <div key={show.id} className="show-card" onClick={() => navigate(`/show/${show.id}`)}>
              <div
                className="show-card-banner"
                style={{ background: show.color + "cc" }}
              >
                {show.title}
              </div>
              <div className="show-card-body">
                <div className="show-card-title">{show.title}</div>
                <div className="show-card-meta">
                  {show.year} · {show.network} · {totalEps} eps
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "6px 0" }}>
                  {show.genres.map((g) => <span className="tag" key={g}>{g}</span>)}
                </div>
                {watching ? (
                  <span style={{ fontSize: 12, color: "var(--accent)" }}>✓ In your watchlist</span>
                ) : (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 4, width: "100%" }}
                    onClick={(e) => { e.stopPropagation(); addShow(show.id); navigate(`/show/${show.id}`); }}
                  >
                    + Add to watchlist
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="empty-state">
          <p>No shows match "{query}"</p>
          <p style={{ marginTop: 8, fontSize: 12 }}>More shows coming soon — this is a prototype!</p>
        </div>
      )}
    </div>
  );
}
