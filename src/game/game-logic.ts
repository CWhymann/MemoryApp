import type {
  BoardSize,
  MemoryCard,
  Player,
  PlayerColor,
  ThemeCard,
} from "./types";

/** Shuffles a new array without changing the input array. */
function shuffleArray<T>(items: readonly T[]): T[] {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

/** Creates a shuffled board with the selected number of cards. */
export function createDeck(
  themeCards: readonly ThemeCard[],
  cardCount: BoardSize,
): MemoryCard[] {
  const pairCount = cardCount / 2;

  if (themeCards.length < pairCount) {
    throw new Error(`This theme needs at least ${pairCount} card images.`);
  }

  const selectedCards = shuffleArray(themeCards).slice(0, pairCount);
  const pairedCards = selectedCards.flatMap((card) => [
    { ...card, cardId: `${card.id}-a`, faceUp: false, matched: false },
    { ...card, cardId: `${card.id}-b`, faceUp: false, matched: false },
  ]);

  return shuffleArray(pairedCards);
}

/** Creates both players with a score of zero. */
export function createPlayers(playerOneColor: PlayerColor): [Player, Player] {
  const playerTwoColor = playerOneColor === "blue" ? "orange" : "blue";

  return [
    { color: playerOneColor, score: 0 },
    { color: playerTwoColor, score: 0 },
  ];
}

/** Checks whether two cards show the same image. */
export function isMatchingPair(
  firstCard: MemoryCard,
  secondCard: MemoryCard,
): boolean {
  return firstCard.id === secondCard.id;
}

/** Returns the other player's color. */
export function getNextPlayer(currentPlayer: PlayerColor): PlayerColor {
  return currentPlayer === "blue" ? "orange" : "blue";
}

/** Adds one point to the player who found a pair. */
export function awardPoint(
  players: [Player, Player],
  playerColor: PlayerColor,
): [Player, Player] {
  const [firstPlayer, secondPlayer] = players;
  const updatedFirst =
    firstPlayer.color === playerColor
      ? { ...firstPlayer, score: firstPlayer.score + 1 }
      : firstPlayer;
  const updatedSecond =
    secondPlayer.color === playerColor
      ? { ...secondPlayer, score: secondPlayer.score + 1 }
      : secondPlayer;

  return [updatedFirst, updatedSecond];
}

/** Returns the winning player's color or a tie. */
export function getWinner(players: [Player, Player]): PlayerColor | "tie" {
  if (players[0].score === players[1].score) return "tie";
  return players[0].score > players[1].score
    ? players[0].color
    : players[1].color;
}
