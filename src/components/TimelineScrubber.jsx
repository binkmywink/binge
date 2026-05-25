import { useRef } from "react";

export default function TimelineScrubber({ episodes, epProgress, onJump }) {
  const trackRef = useRef(null);

  const watchedCount = episodes.filter(
    (ep) => epProgress[`s${ep.season ?? 1}e${ep.n}`]?.watched
  ).length;
  const pct = episodes.length ? (watchedCount / episodes.length) * 100 : 0;

  function handleTrackClick(e) {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * (episodes.length - 1));
    onJump(episodes[idx]);
  }

  // find current ep (last watched)
  let currentIdx = -1;
  for (let i = episodes.length - 1; i >= 0; i--) {
    if (epProgress[`s${episodes[i].season ?? 1}e${episodes[i].n}`]?.watched) {
      currentIdx = i;
      break;
    }
  }

  const thumbPct = episodes.length > 1
    ? (currentIdx / (episodes.length - 1)) * 100
    : pct;

  return (
    <div className="scrubber-wrap">
      <div
        className="scrubber-track"
        ref={trackRef}
        onClick={handleTrackClick}
        title="Click to jump to episode"
      >
        <div className="scrubber-fill" style={{ width: `${pct}%` }} />
        {currentIdx >= 0 && (
          <div
            className="scrubber-thumb"
            style={{ left: `${thumbPct}%` }}
          />
        )}
      </div>

      <div className="ep-pip-row">
        {episodes.map((ep, i) => {
          const key = `s${ep.season ?? 1}e${ep.n}`;
          const watched = epProgress[key]?.watched;
          const isCurrent = i === currentIdx;
          return (
            <div
              key={i}
              className={`ep-pip ${watched ? "watched" : ""} ${isCurrent ? "current" : ""}`}
              onClick={(e) => { e.stopPropagation(); onJump(ep); }}
              title={`E${ep.n}: ${ep.title}`}
            >
              {ep.n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
