import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SHOWS } from "../data/seed";
import { useStore } from "../hooks/useStore";
import { searchShows, getPopularShows } from "../services/tvApi";

export default function Discover() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { state, addShow } = useStore();
  const navigate = useNavigate();

  // Load popular shows on mount
  useEffect(() => {
    const loadPopular = async () => {
      setLoading(true);
      try {
        const popular = await getPopularShows();
        setResults(popular);
      } catch (error) {
        console.error("Error loading popular shows:", error);
        setResults(SHOWS);
      } finally {
        setLoading(false);
      }
    };
    loadPopular();
  }, []);

  // Search for shows when query changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        setHasSearched(true);
        try {
          const searchResults = await searchShows(query);
          setResults(searchResults);
        } catch (error) {
          console.error("Error searching shows:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setHasSearched(false);
        const popular = await getPopularShows();
        setResults(popular);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

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

      {loading && <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>Loading...</div>}

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
                    onClick={(e) => { e.stopPropagation(); addShow(show.id, show); navigate(`/show/${show.id}`); }}
                  >
                    + Add to watchlist
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {results.length === 0 && !loading && (
        <div className="empty-state">
          <p>{hasSearched ? `No shows match "${query}"` : "No shows found"}</p>
          <p style={{ marginTop: 8, fontSize: 12 }}>Try searching for a show title, like "Breaking Bad" or "The Office"</p>
        </div>
      )}
    </div>
  );
}
