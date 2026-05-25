import { useState, useEffect, useCallback } from "react";
import { SHOWS } from "../data/seed";

const STORAGE_KEY = "framebyfame_v1";

function defaultState() {
  const progress = {};
  SHOWS.forEach((show) => {
    progress[show.id] = {
      watching: false,
      currentSeason: 1,
      episodes: {},
    };
    show.seasons.forEach((season) => {
      season.episodes.forEach((ep) => {
        progress[show.id].episodes[`s${season.number}e${ep.n}`] = {
          watched: false,
          rating: 0,
          note: "",
          watchedAt: null,
        };
      });
    });
  });

  // Seed The Bear with some watched data
  const bearId = "the-bear";
  for (let i = 1; i <= 7; i++) {
    progress[bearId].episodes[`s1e${i}`] = {
      watched: true,
      rating: i === 7 ? 5 : i === 3 ? 5 : i === 5 ? 3 : 4,
      note:
        i === 7
          ? "The cousin scene broke me. Incredible writing."
          : i === 3
          ? "Sydney joining the team is the best thing that happened."
          : "",
      watchedAt: new Date(Date.now() - (7 - i) * 86400000).toISOString(),
    };
  }
  progress[bearId].watching = true;

  progress["severance"].watching = true;
  progress["severance"].episodes["s1e1"] = {
    watched: true, rating: 4, note: "Unsettling in the best way.", watchedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  };
  progress["severance"].episodes["s1e2"] = {
    watched: true, rating: 4, note: "", watchedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  };

  return { progress, profile: { name: "You", initials: "ME" } };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch {
    return defaultState();
  }
}

export function useStore() {
  const [state, setState] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const markWatched = useCallback((showId, season, epNum, watched = true) => {
    setState((prev) => {
      const key = `s${season}e${epNum}`;
      const existing = prev.progress[showId].episodes[key];
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [showId]: {
            ...prev.progress[showId],
            watching: true,
            episodes: {
              ...prev.progress[showId].episodes,
              [key]: {
                ...existing,
                watched,
                watchedAt: watched ? new Date().toISOString() : null,
              },
            },
          },
        },
      };
    });
  }, []);

  const setRating = useCallback((showId, season, epNum, rating) => {
    setState((prev) => {
      const key = `s${season}e${epNum}`;
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [showId]: {
            ...prev.progress[showId],
            episodes: {
              ...prev.progress[showId].episodes,
              [key]: { ...prev.progress[showId].episodes[key], rating },
            },
          },
        },
      };
    });
  }, []);

  const setNote = useCallback((showId, season, epNum, note) => {
    setState((prev) => {
      const key = `s${season}e${epNum}`;
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [showId]: {
            ...prev.progress[showId],
            episodes: {
              ...prev.progress[showId].episodes,
              [key]: { ...prev.progress[showId].episodes[key], note },
            },
          },
        },
      };
    });
  }, []);

  const addShow = useCallback((showId) => {
    setState((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [showId]: { ...prev.progress[showId], watching: true },
      },
    }));
  }, []);

  const getShowProgress = useCallback(
    (showId, season) => {
      const show = SHOWS.find((s) => s.id === showId);
      if (!show) return null;
      const seasonData = show.seasons.find((s) => s.number === season);
      if (!seasonData) return null;
      const eps = prev => prev.progress[showId].episodes;
      const watched = seasonData.episodes.filter(
        (ep) => state.progress[showId]?.episodes[`s${season}e${ep.n}`]?.watched
      );
      return {
        total: seasonData.episodes.length,
        watched: watched.length,
        pct: (watched.length / seasonData.episodes.length) * 100,
      };
    },
    [state]
  );

  return { state, markWatched, setRating, setNote, addShow, getShowProgress };
}
