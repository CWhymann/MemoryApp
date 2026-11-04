import type { ThemeCard, ThemeId } from "./types";

export const THEME_NAMES: Record<ThemeId, string> = {
  "code-vibes": "Code vibes",
  gaming: "Gaming",
  "da-projects": "DA projects",
  foods: "Foods",
};

const THEME_SYMBOLS: Record<ThemeId, readonly string[]> = {
  "code-vibes": [
    "JS",
    "CSS",
    "HTML",
    "TS",
    "{}",
    "</>",
    "JSX",
    "npm",
    "API",
    "DB",
    "Git",
    "VS",
    "Django",
    "Node",
    "React",
    "Vue",
    "Sass",
    "SQL",
  ],
  gaming: [
    "🎮",
    "🕹️",
    "🎲",
    "🧩",
    "👾",
    "🚀",
    "⭐",
    "🏆",
    "🛡️",
    "⚔️",
    "🗺️",
    "🎯",
    "🧙",
    "🐉",
    "🚗",
    "🏎️",
    "🎧",
    "💎",
  ],
  "da-projects": [
    "DA",
    "UX",
    "UI",
    "AI",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
  ],
  foods: [
    "🍋",
    "🍊",
    "🍒",
    "🍐",
    "🍓",
    "🍇",
    "🥝",
    "🍑",
    "🍉",
    "🍍",
    "🥥",
    "🫐",
    "🥑",
    "🥕",
    "🍄",
    "🌽",
    "🥨",
    "🍪",
  ],
};

/** Creates placeholder card data for one theme. */
function createThemeCards(themeId: ThemeId): ThemeCard[] {
  return THEME_SYMBOLS[themeId].map((symbol, index) => {
    const cardNumber = String(index + 1).padStart(2, "0");

    return {
      id: `${themeId}-${cardNumber}`,
      label: `${THEME_NAMES[themeId]} ${cardNumber}`,
      imagePath: `/assets/themes/${themeId}/card-${cardNumber}.svg`,
      symbol,
    };
  });
}

export const THEME_CARDS: Record<ThemeId, ThemeCard[]> = {
  "code-vibes": createThemeCards("code-vibes"),
  gaming: createThemeCards("gaming"),
  "da-projects": createThemeCards("da-projects"),
  foods: createThemeCards("foods"),
};
