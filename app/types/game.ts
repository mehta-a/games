export type GameState = 'welcome' | 'playing' | 'ended';

export type Player = {
  name: string;
  symbol: 'X' | 'O';
};

export type GameResult = {
  winner: Player | null;
  timestamp: string;
  playerX: string;
  playerO: string;
  scoreX: number;
  scoreO: number;
};

export type GameStorage = {
  gameState: GameState;
  board: string[];
  currentPlayer: string;
  score: {
    X: number;
    O: number;
  };
  playerX: string;
  playerO: string;
};