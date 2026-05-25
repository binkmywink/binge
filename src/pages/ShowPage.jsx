import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import { SHOWS, FRIENDS, FRIEND_PROGRESS } from "../data/seed";
import { getShowDetails } from "../services/tvApi";
import TimelineScrubber from "../components/TimelineScrubber";
import EpisodeRow from "../components/EpisodeRow";

export default function ShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, markWatched, setRating, setNote, addShow } = useStore();
  const [activeSeason, setActiveSeason] = useState(1);
  const [activeTab, setActiveTab] = useState("episodes");
  const [loading, setLoading] = useState(false);

  // Try to find show in seed data first, then in cached shows
  let show = SHOWS.find((s) => s.id === id) || state.shows?.[id];

  // If show not found locally, attempt to fetch from API
  useEffect(() => {
    if (!show && id.startsWith("tvmaze-")) {
      setLoading(true);
      const tvmazeId = id.replace("tvmaze-", "");
      getShowDetails(parseInt(tvmazeId))
        .then((fetchedShow) => {
          if (fetchedShow) {
            // Add the fetched show to the store
            addShow(id, fetchedShow);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, show, addShow]);

  if (loading) return <div className="page"><p style={{ color: "var(--text2)" }}>Loading show details...</p></div>;
  if (!show) return <div className="page"><p style={{ color: "var(--text2)" }}>Show not found.</p></div>;

  const prog = state.progress[id];
  const season = show.seasons.find((s) => s.number === activeSeason);
  const epProgress = prog?.episodes ?? {};

  const seasonEps = season?.episodes.map((ep) => ({ ...ep, season: activeSeason })) ?? [];
  const watchedInSeason = seasonEps.filter((ep) => epProgress[`s${activeSeason}e${ep.n}`]?.watched).length;
  const totalRuntime = seasonEps.reduce((a, ep) => a + ep.runtime, 0);
  const watchedRuntime = seasonEps
    .filter((ep) => epProgress[`s${activeSeason}e${ep.n}`]?.watched)
    .reduce((a, ep) => a + ep.runtime, 0);

  // find current ep (last watched in season)
  let currentEpNum = null;
  for (let i = seasonEps.length - 1; i >= 0; i--) {
    if (epProgress[`s${activeSeason}e${seasonEps[i].n}`]?.watched) {
      currentEpNum = seasonEps[i].n;
      break;
    }
  }

  function handleJump(ep) {
    // mark all eps up to and including this one as watched
    for (let i = 0; i < seasonEps.length; i++) {
      const e = seasonEps[i];
      if (e.n <= ep.n) {
        if (!epProgress[`s${activeSeason}e${e.n}`]?.watched) {
          markWatched(id, activeSeason, e.n, true);
        }
      }
    }
  }

  const friendsForShow = FRIEND_PROGRESS[id];

  return (
    <div className="page">
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: "1.25rem" }}
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <div className="show-hero">
        <div
          className="show-poster"
          style={{ background: show.color + "dd" }}
        >
          {show.title}
        </div>
        <div className="show-hero-meta">
          <h1>{show.title}</h1>
          <p>{show.description}</p>
          <div className="show-hero-tags">
            {show.genres.map((g) => <span className="tag" key={g}>{g}</span>)}
            <span className="tag">{show.year}</span>
            <span className="tag">{show.network}</span>
          </div>
          {!prog?.watching && (
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: 12 }}
              onClick={() => addShow(id)}
            >
              + Add to watchlist
            </button>
          )}
        </div>
      </div>

      {/* Season switcher + timeline */}
      <div className="timeline-section">
        <div className="timeline-header">
          <span style={{ fontSize: 13, color: "var(--text2)" }}>
            Season progress
          </span>
          <div className="season-switcher">
            {show.seasons.map((s) => (
              <button
                key={s.number}
                className={`season-btn ${activeSeason === s.number ? "active" : ""}`}
                onClick={() => setActiveSeason(s.number)}
              >
                S{s.number}
              </button>
            ))}
          </div>
        </div>

        <TimelineScrubber
          episodes={seasonEps}
          epProgress={epProgress}
          onJump={handleJump}
        />

        <div className="stat-grid">
          <div className="stat-box">
            <div className="stat-val">{watchedInSeason}</div>
            <div className="stat-lbl">episodes watched</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">{seasonEps.length - watchedInSeason}</div>
            <div className="stat-lbl">to go</div>
          </div>
          <div className="stat-box">
            <div className="stat-val">{Math.round(watchedRuntime / 60)}h</div>
            <div className="stat-lbl">time watched</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-row">
        {["episodes", "friends", "about"].map((t) => (
          <button
            key={t}
            className={`tab-btn ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "episodes" && (
        <div className="ep-list">
          {seasonEps.map((ep) => (
            <EpisodeRow
              key={ep.n}
              ep={ep}
              season={activeSeason}
              progress={epProgress[`s${activeSeason}e${ep.n}`]}
              isCurrentEp={ep.n === currentEpNum}
              onMarkWatched={(s, n, w) => markWatched(id, s, n, w)}
              onSetRating={(s, n, r) => setRating(id, s, n, r)}
              onSetNote={(s, n, note) => setNote(id, s, n, note)}
            />
          ))}
        </div>
      )}

      {activeTab === "friends" && (
        <div className="card card-padded">
          {FRIENDS.map((friend) => {
            const fp = friendsForShow?.[friend.id];
            if (!fp) return null;
            const showSeason = show.seasons.find((s) => s.number === fp.season);
            const friendEp = showSeason?.episodes.find((e) => e.n === fp.episode);
            const totalEps = show.seasons.flatMap((s) => s.episodes).length;
            const watchedByFriend = show.seasons
              .flatMap((s) =>
                s.episodes
                  .filter((e) =>
                    s.number < fp.season ||
                    (s.number === fp.season && e.n <= fp.episode)
                  )
                  .map(() => 1)
              )
              .length;
            const friendPct = (watchedByFriend / totalEps) * 100;
            const myWatched = seasonEps.filter((e) => epProgress[`s${activeSeason}e${e.n}`]?.watched).length;
            const ahead = fp.season > activeSeason || (fp.season === activeSeason && fp.episode > (currentEpNum ?? 0));
            const same = fp.season === activeSeason && fp.episode === (currentEpNum ?? 0);

            return (
              <div className="friend-row" key={friend.id}>
                <div
                  className="avatar"
                  style={{ background: friend.color, color: friend.textColor }}
                >
                  {friend.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{friend.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>
                    S{fp.season} E{fp.episode}{friendEp ? ` — "${friendEp.title}"` : ""}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <div className="progress-track" style={{ height: 3 }}>
                      <div className="progress-fill" style={{ width: `${friendPct}%`, background: friend.textColor }} />
                    </div>
                  </div>
                </div>
                <div>
                  {ahead ? (
                    <span className="badge" style={{ background: "rgba(216,90,48,0.15)", color: "var(--accent)", fontSize: 10 }}>
                      ahead ↑
                    </span>
                  ) : same ? (
                    <span className="badge" style={{ background: "rgba(29,158,117,0.15)", color: "#1D9E75", fontSize: 10 }}>
                      in sync
                    </span>
                  ) : (
                    <span className="badge badge-muted" style={{ fontSize: 10 }}>
                      behind ↓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "about" && (
        <div className="card card-padded">
          <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: "1rem" }}>
            {show.description}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ fontSize: 13 }}>
              <div style={{ color: "var(--text3)", fontSize: 11, marginBottom: 3 }}>Network</div>
              {show.network}
            </div>
            <div style={{ fontSize: 13 }}>
              <div style={{ color: "var(--text3)", fontSize: 11, marginBottom: 3 }}>Year</div>
              {show.year}
            </div>
            <div style={{ fontSize: 13 }}>
              <div style={{ color: "var(--text3)", fontSize: 11, marginBottom: 3 }}>Seasons</div>
              {show.seasons.length}
            </div>
            <div style={{ fontSize: 13 }}>
              <div style={{ color: "var(--text3)", fontSize: 11, marginBottom: 3 }}>Total runtime</div>
              {Math.round(totalRuntime / 60)}h {totalRuntime % 60}m
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
