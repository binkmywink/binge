import { useState, useRef, useEffect } from "react";
import Stars from "./Stars";

export default function EpisodeRow({
  ep,
  season,
  progress,
  isCurrentEp,
  onMarkWatched,
  onSetRating,
  onSetNote,
}) {
  const [expanded, setExpanded] = useState(false);
  const [noteVal, setNoteVal] = useState(progress?.note ?? "");
  const taRef = useRef(null);

  useEffect(() => { setNoteVal(progress?.note ?? ""); }, [progress?.note]);

  const watched = progress?.watched ?? false;
  const rating = progress?.rating ?? 0;

  function toggleExpand(e) {
    e.stopPropagation();
    if (!watched && ep.n !== getNextEp()) return;
    setExpanded((v) => !v);
  }

  // rough "next unwatched" — just allow expand on watched eps
  function getNextEp() { return null; }

  function handleCheck(e) {
    e.stopPropagation();
    onMarkWatched(season, ep.n, !watched);
    if (!watched) setExpanded(true);
  }

  function saveNote(e) {
    e.stopPropagation();
    onSetNote(season, ep.n, noteVal);
    setExpanded(false);
  }

  return (
    <div
      className={`ep-row ${isCurrentEp ? "current" : ""} ${expanded ? "expanded" : ""}`}
      onClick={watched ? toggleExpand : undefined}
    >
      <div className="ep-row-header">
        <span className="ep-num">E{String(ep.n).padStart(2, "0")}</span>
        <span className="ep-title">{ep.title}</span>
        {isCurrentEp && <span className="here-badge">you are here</span>}
        <span className="ep-runtime" style={{ marginLeft: "auto", marginRight: 10 }}>
          {ep.runtime}m
        </span>
        <div
          className={`ep-check ${watched ? "done" : isCurrentEp ? "here" : ""}`}
          onClick={handleCheck}
          title={watched ? "Mark unwatched" : "Mark watched"}
        >
          {watched ? "✓" : isCurrentEp ? "▶" : ""}
        </div>
      </div>

      {watched && (
        <div className="ep-meta-row">
          <Stars
            value={rating}
            onChange={(r) => { onSetRating(season, ep.n, r); }}
          />
          {progress?.note && !expanded && (
            <span style={{ fontSize: 12, color: "var(--text2)", fontStyle: "italic" }}>
              "{progress.note.slice(0, 60)}{progress.note.length > 60 ? "…" : ""}"
            </span>
          )}
        </div>
      )}

      {!watched && !isCurrentEp && (
        <div style={{ paddingLeft: 50, marginTop: 4, fontSize: 12, color: "var(--text3)" }}>
          Not watched yet
        </div>
      )}

      {expanded && watched && (
        <div className="ep-expand-body" onClick={(e) => e.stopPropagation()}>
          <textarea
            ref={taRef}
            rows={3}
            placeholder="Add a note for this episode…"
            value={noteVal}
            onChange={(e) => setNoteVal(e.target.value)}
          />
          <div className="ep-expand-actions">
            <button className="btn btn-primary btn-sm" onClick={saveNote}>
              Save note
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setNoteVal(progress?.note ?? ""); setExpanded(false); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
