import "./style.css";
import {
  awardPoint,
  createDeck,
  createPlayers,
  getNextPlayer,
  getWinner,
  isMatchingPair,
} from "./game/game-logic";
import { THEME_CARDS, THEME_NAMES } from "./game/theme-data";
import type {
  GameSetup,
  GameState,
  MemoryCard,
  PlayerColor,
  ThemeId,
} from "./game/types";

const MISMATCH_DELAY_MS = 850;
const DEFAULT_STEP_LABELS: Record<string, string> = {
  theme: "Game theme",
  player: "Player",
  boardSize: "Board size",
};

const gameSetup: GameSetup = {
  playerColor: null,
  boardSize: null,
  theme: null,
};

const board = getElement<HTMLDivElement>("#game-board");
const cardTemplate = getElement<HTMLTemplateElement>("#memory-card-template");
const exitDialog = getElement<HTMLDialogElement>("#exit-dialog");
const startButton = getElement<HTMLButtonElement>("#start-game");
const screens = document.querySelectorAll<HTMLElement>(".screen");

let gameState: GameState | null = null;
let openCards: MemoryCard[] = [];
let boardLocked = false;
let mismatchTimer: number | undefined;

/** Returns a required element or throws a descriptive error. */
function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) throw new Error(`Required element not found: ${selector}`);
  return element;
}

/** Checks whether a string is a supported player color. */
function isPlayerColor(value: string): value is PlayerColor {
  return value === "blue" || value === "orange";
}

/** Checks whether a number is a supported board size. */
function isBoardSize(value: number): value is 16 | 24 | 36 {
  return value === 16 || value === 24 || value === 36;
}

/** Checks whether a string is a supported theme. */
function isThemeId(value: string): value is ThemeId {
  return Object.hasOwn(THEME_NAMES, value);
}

/** Displays the screen that matches the supplied name. */
function showScreen(screenName: string): void {
  screens.forEach((screen) => {
    const isActive = screen.dataset.screen === screenName;
    screen.hidden = !isActive;
    screen.classList.toggle("screen--active", isActive);
  });
}

/** Capitalizes the first letter of a player color for display. */
function formatPlayerColor(color: PlayerColor): string {
  return color.charAt(0).toUpperCase() + color.slice(1);
}

/** Shows the chosen value in each footer step, or its default label. */
function updateStepLabels(): void {
  const values: Record<string, string | null> = {
    theme: gameSetup.theme ? THEME_NAMES[gameSetup.theme] : null,
    player: gameSetup.playerColor
      ? formatPlayerColor(gameSetup.playerColor)
      : null,
    boardSize: gameSetup.boardSize ? `${gameSetup.boardSize} cards` : null,
  };

  document.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => {
    const key = step.dataset.step ?? "";
    const value = values[key];

    step.textContent = value ?? DEFAULT_STEP_LABELS[key];
    step.classList.toggle("is-selected", value !== null);
  });
}

/** Enables the Start button only when all three settings are chosen. */
function updateStartButton(): void {
  const isComplete =
    gameSetup.playerColor !== null &&
    gameSetup.boardSize !== null &&
    gameSetup.theme !== null;

  startButton.disabled = !isComplete;
}

/** Creates an element with a class and text content. */
function createTextElement(
  tag: string,
  className: string,
  text: string,
): HTMLElement {
  const element = document.createElement(tag);

  element.className = className;
  element.textContent = text;
  return element;
}

/** Creates the score and exit row of the settings preview. */
function createPreviewHeader(): HTMLElement {
  const header = document.createElement("div");

  header.className = "theme-preview__header";
  header.append(
    createTextElement("span", "theme-preview__score", "Blue 0"),
    createTextElement("span", "theme-preview__score", "Orange 0"),
    createTextElement("span", "theme-preview__current", "Current player:"),
    createTextElement("span", "theme-preview__exit", "Exit game"),
  );
  return header;
}

/** Creates the two decorative cards of the settings preview. */
function createPreviewCards(): HTMLElement {
  const cards = document.createElement("div");

  cards.className = "theme-preview__cards";
  cards.append(
    createTextElement(
      "div",
      "theme-preview__card theme-preview__card--back",
      "",
    ),
    createTextElement(
      "div",
      "theme-preview__card theme-preview__card--front",
      "",
    ),
  );
  return cards;
}

/** Redraws the settings preview with the current theme and player. */
function renderPreview(): void {
  const preview = getElement<HTMLDivElement>("#theme-preview");

  preview.dataset.theme = gameSetup.theme ?? "code-vibes";
  preview.dataset.player = gameSetup.playerColor ?? "blue";
  preview.replaceChildren(createPreviewHeader(), createPreviewCards());
}

/** Updates the footer, the preview and the Start button. */
function updateSetupDisplay(): void {
  updateStepLabels();
  updateStartButton();
  renderPreview();
}

/** Stores a valid setting selected by the user. */
function updateGameSetup(name: string, value: string): void {
  if (name === "playerColor" && isPlayerColor(value)) {
    gameSetup.playerColor = value;
  }

  const boardSize = Number(value);

  if (name === "boardSize" && isBoardSize(boardSize)) {
    gameSetup.boardSize = boardSize;
  }

  if (name === "theme" && isThemeId(value)) {
    gameSetup.theme = value;
  }
}

/** Updates the setup after a radio option changes. */
function handleSettingsChange(event: Event): void {
  const input = event.target;

  if (!(input instanceof HTMLInputElement) || !input.checked) return;
  updateGameSetup(input.name, input.value);
  updateSetupDisplay();
}

/** Creates a fresh game state from the selected settings. */
function createGameState(): GameState | null {
  const { playerColor, boardSize, theme } = gameSetup;

  if (!playerColor || !boardSize || !theme) return null;

  return {
    cards: createDeck(THEME_CARDS[theme], boardSize),
    players: createPlayers(playerColor),
    currentPlayer: playerColor,
    moves: 0,
    status: "playing",
  };
}

/** Adds one card button to the board. */
function addCard(card: MemoryCard): void {
  const fragment = cardTemplate.content.cloneNode(true) as DocumentFragment;
  const button = fragment.querySelector<HTMLButtonElement>(".memory-card");

  if (!button)
    throw new Error("The memory card template is missing its button.");
  button.dataset.cardId = card.cardId;
  button.setAttribute("aria-label", "Hidden card");
  board.append(fragment);
}

/** Displays the selected deck and theme. */
function renderBoard(): void {
  if (!gameState || !gameSetup.boardSize || !gameSetup.theme) return;

  board.replaceChildren();
  board.dataset.cardCount = String(gameSetup.boardSize);
  board.dataset.theme = gameSetup.theme;
  gameState.cards.forEach(addCard);
  getElement("#game-theme-heading").textContent = THEME_NAMES[gameSetup.theme];
}

/** Updates a card button to match its current state. */
function renderCard(card: MemoryCard): void {
  const button = board.querySelector<HTMLButtonElement>(
    `[data-card-id="${card.cardId}"]`,
  );
  const symbol = button?.querySelector<HTMLSpanElement>(".memory-card__symbol");

  if (!button || !symbol) return;

  symbol.textContent = card.symbol;
  button.classList.toggle("is-flipped", card.faceUp || card.matched);
  button.classList.toggle("is-matched", card.matched);
  button.setAttribute(
    "aria-label",
    card.matched ? `Matched: ${card.label}` : card.label,
  );
}

/** Updates both scores and the current player's label. */
function updateScoreboard(): void {
  if (!gameState) return;

  const bluePlayer = gameState.players.find(
    (player) => player.color === "blue",
  );
  const orangePlayer = gameState.players.find(
    (player) => player.color === "orange",
  );

  getElement("#blue-score").textContent = String(bluePlayer?.score ?? 0);
  getElement("#orange-score").textContent = String(orangePlayer?.score ?? 0);
  getElement("#current-player").textContent = gameState.currentPlayer;
}

/** Starts a new game with the selected settings. */
function startGame(): void {
  window.clearTimeout(mismatchTimer);
  boardLocked = false;
  openCards = [];
  gameState = createGameState();

  if (!gameState) return;

  renderBoard();
  updateScoreboard();
  showScreen("game");
}

/** Finds a card from a click inside the board. */
function findClickedCard(target: EventTarget | null): MemoryCard | undefined {
  if (!(target instanceof HTMLElement) || !gameState) return undefined;

  const button = target.closest<HTMLButtonElement>(".memory-card");
  return gameState.cards.find((card) => card.cardId === button?.dataset.cardId);
}

/** Reveals a card and resolves the turn after two selections. */
function handleBoardClick(event: MouseEvent): void {
  if (!gameState || boardLocked || gameState.status !== "playing") return;

  const card = findClickedCard(event.target);
  if (!card || card.faceUp || card.matched) return;

  card.faceUp = true;
  openCards.push(card);
  renderCard(card);
  if (openCards.length === 2) resolvePair();
}

/** Compares the two revealed cards. */
function resolvePair(): void {
  if (!gameState || openCards.length !== 2) return;

  gameState.moves += 1;
  const [firstCard, secondCard] = openCards;

  if (isMatchingPair(firstCard, secondCard)) {
    handleMatch(firstCard, secondCard);
  } else {
    handleMismatch(firstCard, secondCard);
  }
}

/** Awards a point and keeps the turn when the cards match. */
function handleMatch(firstCard: MemoryCard, secondCard: MemoryCard): void {
  if (!gameState) return;

  firstCard.matched = true;
  secondCard.matched = true;
  gameState.players = awardPoint(gameState.players, gameState.currentPlayer);
  openCards = [];
  renderCard(firstCard);
  renderCard(secondCard);
  updateScoreboard();

  if (gameState.cards.every((card) => card.matched)) finishGame();
}

/** Hides a mismatch, then passes the turn to the other player. */
function handleMismatch(firstCard: MemoryCard, secondCard: MemoryCard): void {
  if (!gameState) return;

  boardLocked = true;
  const activeGame = gameState;
  mismatchTimer = window.setTimeout(
    () => hideMismatchedCards(activeGame, firstCard, secondCard),
    MISMATCH_DELAY_MS,
  );
}

/** Turns mismatched cards face down and switches the active player. */
function hideMismatchedCards(
  activeGame: GameState,
  firstCard: MemoryCard,
  secondCard: MemoryCard,
): void {
  if (gameState !== activeGame) return;

  firstCard.faceUp = false;
  secondCard.faceUp = false;
  renderCard(firstCard);
  renderCard(secondCard);
  gameState.currentPlayer = getNextPlayer(gameState.currentPlayer);
  openCards = [];
  boardLocked = false;
  updateScoreboard();
}

/** Displays the final scores and winner message. */
function finishGame(): void {
  if (!gameState) return;

  gameState.status = "finished";
  const winner = getWinner(gameState.players);
  const message = winner === "tie" ? "It’s a draw!" : `${winner} player wins!`;

  getElement("#winner-message").textContent = message;
  getElement("#result-blue-score").textContent = String(
    gameState.players.find((player) => player.color === "blue")?.score ?? 0,
  );
  getElement("#result-orange-score").textContent = String(
    gameState.players.find((player) => player.color === "orange")?.score ?? 0,
  );
  showScreen("result");
}

/** Runs the action associated with a clicked button. */
function runAction(action: string): void {
  if (action === "open-settings") showScreen("settings");
  if (action === "exit-game") exitDialog.showModal();
  if (action === "cancel-exit") exitDialog.close();
  if (action === "confirm-exit") {
    window.clearTimeout(mismatchTimer);
    exitDialog.close();
    showScreen("settings");
  }
  if (action === "play-again") startGame();
  if (action === "back-home") showScreen("home");
}

/** Finds and runs the action for a clicked button. */
function handleButtonClick(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;
  const button = target.closest<HTMLButtonElement>("[data-action]");
  if (button?.dataset.action) runAction(button.dataset.action);
}

getElement<HTMLFormElement>("#settings-form").addEventListener(
  "change",
  handleSettingsChange,
);
startButton.addEventListener("click", startGame);
board.addEventListener("click", handleBoardClick);
document.addEventListener("click", handleButtonClick);
updateSetupDisplay();
