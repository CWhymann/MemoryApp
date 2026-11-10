import type { ThemeCard, ThemeId } from "./types";

export const THEME_NAMES: Record<ThemeId, string> = {
  "code-vibes": "Code vibes",
  gaming: "Gaming",
  "da-projects": "DA projects",
  foods: "Foods",
};

const GAMING_FILES: readonly number[] = [
  19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 32, 35, 38, 31, 34, 37, 40, 42,
];

const FOODS_FILES: readonly number[] = [
  1, 6, 12, 3, 8, 15, 2, 7, 14, 5, 11, 18, 13, 4, 9, 16, 10, 17,
];

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

/** Returns the motif image path for one card of a theme. */
function getImagePath(themeId: ThemeId, index: number): string {
  const cardNumber = String(index + 1).padStart(2, "0");

  if (themeId === "gaming") {
    return `/assets/cards/image${GAMING_FILES[index]}_2290_4090.png`;
  }

  if (themeId === "foods") {
    return `/assets/cards/image${FOODS_FILES[index]}_2290_4090.png`;
  }

  return `/assets/cards/${themeId}/${cardNumber}.png`;
}

/** Creates placeholder card data for one theme. */
function createThemeCards(themeId: ThemeId): ThemeCard[] {
  return THEME_SYMBOLS[themeId].map((symbol, index) => {
    const cardNumber = String(index + 1).padStart(2, "0");

    return {
      id: `${themeId}-${cardNumber}`,
      label: `${THEME_NAMES[themeId]} ${cardNumber}`,
      imagePath: getImagePath(themeId, index),
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
