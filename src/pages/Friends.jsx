import { useNavigate } from "react-router-dom";
import { FRIENDS, FRIEND_PROGRESS, SHOWS } from "../data/seed";
import { useStore } from "../hooks/useStore";

export default function Friends() {
  const { state } = useStore();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Friends</h1>
        <p className="page-subtitle">See what everyone's watching and where they are.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FRIENDS.map((friend) => {
          const shows = SHOWS.filter((show) => FRIEND_PROGRESS[show.id]?.[friend.id]);

          return (
            <div key={friend.id} className="card card-padded">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                <div
                  className="avatar"
                  style={{
                    background: friend.color,
                    color: friend.textColor,
                    width: 44,
                    height: 44,
                    fontSize: 14,
                  }}
                >
                  {friend.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{friend.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>
                    Watching {shows.length} show{shows.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {shows.map((show) => {
                  const fp = FRIEND_PROGRESS[show.id][friend.id];
                  const showSeason = show.seasons.find((s) => s.number === fp.season);
                  const friendEp = showSeason?.episodes.find((e) => e.n === fp.episode);
                  const myProg = state.progress[show.id];
                  const myWatched = show.seasons.flatMap((s) =>
                    s.episodes.filter((e) => myProg?.episodes[`s${s.number}e${e.n}`]?.watched)
                  ).length;
                  const friendWatched = show.seasons.flatMap((s) =>
                    s.episodes.filter((e) =>
                      s.number < fp.season ||
                      (s.number === fp.season && e.n <= fp.episode)
                    )
                  ).length;
                  const ahead = friendWatched > myWatched;
                  const same = friendWatched === myWatched;

                  return (
                    <div
                      key={show.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 10px",
                        background: "var(--bg3)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onClick={() => navigate(`/show/${show.id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg4)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg3)"}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 38,
                          borderRadius: 3,
                          background: show.color + "99",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{show.title}</div>
                        <div style={{ fontSize: 11, color: "var(--text2)" }}>
                          S{fp.season} E{fp.episode}{friendEp ? ` — ${friendEp.title}` : ""}
                        </div>
                      </div>
                      {ahead ? (
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "rgba(216,90,48,0.15)", color: "var(--accent)" }}>
                          ahead
                        </span>
                      ) : same ? (
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "rgba(29,158,117,0.15)", color: "#1D9E75" }}>
                          in sync
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "var(--bg4)", color: "var(--text3)" }}>
                          behind
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
