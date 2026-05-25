// TVMAZE API service for fetching TV shows

const TVMAZE_API = "https://api.tvmaze.com";

export async function searchShows(query) {
  try {
    const response = await fetch(`${TVMAZE_API}/search/shows?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to fetch shows");
    const data = await response.json();
    // Fetch episodes for search results in parallel
    const withEpisodes = await Promise.all(
      data.map(async (item) => {
        try {
          const detailResponse = await fetch(`${TVMAZE_API}/shows/${item.show.id}?embed=episodes`);
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            return transformShow(detailData, true);
          }
        } catch (error) {
          console.warn(`Failed to fetch episodes for ${item.show.name}:`, error);
        }
        return transformShow(item.show);
      })
    );
    return withEpisodes.filter(Boolean);
  } catch (error) {
    console.error("Error searching shows:", error);
    return [];
  }
}

export async function getShowDetails(tvmazeId) {
  try {
    const response = await fetch(`${TVMAZE_API}/shows/${tvmazeId}?embed=episodes`);
    if (!response.ok) throw new Error("Failed to fetch show details");
    const data = await response.json();
    return transformShow(data, true);
  } catch (error) {
    console.error("Error fetching show details:", error);
    return null;
  }
}

function transformShow(show, includeEpisodes = false) {
  if (!show || !show.id || !show.name) return null;

  const transformed = {
    id: `tvmaze-${show.id}`,
    tvmazeId: show.id,
    title: show.name,
    year: show.premiered ? parseInt(show.premiered.split("-")[0]) : null,
    network: show.network?.name || show.webChannel?.name || "Unknown",
    genres: show.genres || [],
    description: show.summary?.replace(/<[^>]*>/g, "") || "No description available",
    color: generateColorFromId(show.id),
    seasons: [],
  };

  // Fetch episodes if requested
  if (includeEpisodes && show._embedded?.episodes) {
    // Group episodes by season
    const episodesBySeason = {};
    show._embedded.episodes.forEach((ep) => {
      const seasonNum = ep.season;
      if (!episodesBySeason[seasonNum]) {
        episodesBySeason[seasonNum] = [];
      }
      episodesBySeason[seasonNum].push({
        n: ep.number,
        title: ep.name,
        runtime: ep.runtime || 0,
      });
    });

    // Convert to seasons array
    Object.keys(episodesBySeason)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((seasonNum) => {
        transformed.seasons.push({
          number: seasonNum,
          episodes: episodesBySeason[seasonNum],
        });
      });
  }

  return transformed;
}

function generateColorFromId(id) {
  const colors = [
    "#D85A30",
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
  ];
  return colors[id % colors.length];
}

// Popular shows to seed on app start
export async function getPopularShows() {
  try {
    const response = await fetch(`${TVMAZE_API}/shows?page=0`);
    if (!response.ok) throw new Error("Failed to fetch popular shows");
    const data = await response.json();
    // Fetch episodes for popular shows in parallel
    const withEpisodes = await Promise.all(
      data.slice(0, 20).map(async (show) => {
        try {
          const detailResponse = await fetch(`${TVMAZE_API}/shows/${show.id}?embed=episodes`);
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            return transformShow(detailData, true);
          }
        } catch (error) {
          console.warn(`Failed to fetch episodes for ${show.name}:`, error);
        }
        return transformShow(show);
      })
    );
    return withEpisodes.filter(Boolean);
  } catch (error) {
    console.error("Error fetching popular shows:", error);
    return [];
  }
}
