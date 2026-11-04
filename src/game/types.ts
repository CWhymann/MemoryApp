export const BOARD_SIZES = [16, 24, 36] as const;

export type BoardSize = (typeof BOARD_SIZES)[number];
export type PlayerColor = "blue" | "orange";
export type ThemeId = "code-vibes" | "gaming" | "da-projects" | "foods";
export type GameStatus = "playing" | "finished";

export interface GameSetup {
  playerColor: PlayerColor | null;
  boardSize: BoardSize | null;
  theme: ThemeId | null;
}

export interface ThemeCard {
  id: string;
  label: string;
  imagePath: string;
  symbol: string;
}

export interface MemoryCard extends ThemeCard {
  cardId: string;
  faceUp: boolean;
  matched: boolean;
}

export interface Player {
  color: PlayerColor;
  score: number;
}

export interface GameState {
  cards: MemoryCard[];
  players: [Player, Player];
  currentPlayer: PlayerColor;
  moves: number;
  status: GameStatus;
}
