export const SHOWS = [
  {
    id: "the-bear",
    title: "The Bear",
    year: 2022,
    network: "FX",
    genres: ["Drama", "Comedy"],
    description:
      "A young chef from the fine dining world returns to Chicago to run his family's Italian beef sandwich shop.",
    color: "#D85A30",
    seasons: [
      {
        number: 1,
        episodes: [
          { n: 1, title: "System", runtime: 29 },
          { n: 2, title: "Hands", runtime: 27 },
          { n: 3, title: "Brigade", runtime: 28 },
          { n: 4, title: "Dogs", runtime: 31 },
          { n: 5, title: "Sheridan", runtime: 29 },
          { n: 6, title: "Ceres", runtime: 30 },
          { n: 7, title: "Review Day", runtime: 61 },
          { n: 8, title: "Braciole", runtime: 30 },
          { n: 9, title: "Omelette", runtime: 28 },
          { n: 10, title: "The Bear", runtime: 29 },
          { n: 11, title: "Cousins", runtime: 31 },
          { n: 12, title: "Fishes", runtime: 74 },
        ],
      },
      {
        number: 2,
        episodes: [
          { n: 1, title: "Beef", runtime: 47 },
          { n: 2, title: "Pasta", runtime: 35 },
          { n: 3, title: "Sundae", runtime: 31 },
          { n: 4, title: "Honeydew", runtime: 29 },
          { n: 5, title: "Forks", runtime: 62 },
          { n: 6, title: "Napkins", runtime: 33 },
          { n: 7, title: "Fishes", runtime: 72 },
          { n: 8, title: "Bolognese", runtime: 32 },
          { n: 9, title: "Omelette", runtime: 56 },
          { n: 10, title: "The Bear", runtime: 43 },
        ],
      },
    ],
  },
  {
    id: "severance",
    title: "Severance",
    year: 2022,
    network: "Apple TV+",
    genres: ["Thriller", "Sci-Fi"],
    description:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    color: "#185FA5",
    seasons: [
      {
        number: 1,
        episodes: [
          { n: 1, title: "Good News About Hell", runtime: 52 },
          { n: 2, title: "Half Loop", runtime: 41 },
          { n: 3, title: "In Perpetuity", runtime: 40 },
          { n: 4, title: "The You You Are", runtime: 43 },
          { n: 5, title: "What's for Dinner?", runtime: 39 },
          { n: 6, title: "Hide and Seek", runtime: 45 },
          { n: 7, title: "Defiant Jazz", runtime: 46 },
          { n: 8, title: "What Is Wrong with You?", runtime: 47 },
          { n: 9, title: "The We We Are", runtime: 52 },
        ],
      },
    ],
  },
  {
    id: "succession",
    title: "Succession",
    year: 2018,
    network: "HBO",
    genres: ["Drama"],
    description:
      "The Roy family controls one of the biggest media and entertainment conglomerates in the world. But who will take over when the patriarch steps down?",
    color: "#3C3489",
    seasons: [
      {
        number: 1,
        episodes: [
          { n: 1, title: "Celebration", runtime: 60 },
          { n: 2, title: "Shit Show at the Fuck Factory", runtime: 55 },
          { n: 3, title: "Lifeboats", runtime: 53 },
          { n: 4, title: "Sad Sack Wasp Trap", runtime: 52 },
          { n: 5, title: "I Went to Market", runtime: 50 },
          { n: 6, title: "Which Side Are You On?", runtime: 52 },
          { n: 7, title: "Austerlitz", runtime: 54 },
          { n: 8, title: "Prague", runtime: 52 },
          { n: 9, title: "Pre-Nuptial", runtime: 54 },
          { n: 10, title: "Nobody Is Ever Missing", runtime: 69 },
        ],
      },
    ],
  },
];

export const FRIENDS = [
  { id: "jamie", name: "Jamie L.", initials: "JL", color: "#FAECE7", textColor: "#993C1D" },
  { id: "alex", name: "Alex K.", initials: "AK", color: "#E1F5EE", textColor: "#0F6E56" },
  { id: "maya", name: "Maya R.", initials: "MR", color: "#E6F1FB", textColor: "#185FA5" },
  { id: "tom", name: "Tom S.", initials: "TS", color: "#EEEDFE", textColor: "#534AB7" },
];

export const FRIEND_PROGRESS = {
  "the-bear": {
    jamie: { season: 1, episode: 10 },
    alex: { season: 1, episode: 7 },
    maya: { season: 1, episode: 3 },
    tom: { season: 2, episode: 10 },
  },
  severance: {
    jamie: { season: 1, episode: 9 },
    alex: { season: 1, episode: 4 },
    maya: { season: 1, episode: 1 },
    tom: { season: 1, episode: 9 },
  },
  succession: {
    jamie: { season: 1, episode: 6 },
    alex: { season: 1, episode: 10 },
    maya: { season: 1, episode: 2 },
    tom: { season: 1, episode: 10 },
  },
};
