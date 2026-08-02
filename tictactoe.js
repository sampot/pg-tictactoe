/**
 * Tic-tac-toe core: board, win/draw, and minimax AI.
 * Cells 0–8 row-major; players 'X' | 'O'.
 */

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export class TicTacToeGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = "X";
    this.gameOver = false;
    this.winner = null; // 'X' | 'O' | 'draw' | null
    this.winningLine = null;
    this.moveCount = 0;
    this.lastMove = null;
  }

  getBoard() {
    return this.board;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  isGameOver() {
    return this.gameOver;
  }

  getWinner() {
    return this.winner;
  }

  getWinningLine() {
    return this.winningLine;
  }

  getLastMove() {
    return this.lastMove;
  }

  emptyIndices(board = this.board) {
    const out = [];
    for (let i = 0; i < 9; i++) if (board[i] == null) out.push(i);
    return out;
  }

  makeMove(index) {
    if (
      this.gameOver ||
      index < 0 ||
      index > 8 ||
      this.board[index] != null
    ) {
      return false;
    }

    const player = this.currentPlayer;
    this.board[index] = player;
    this.lastMove = { index, player };
    this.moveCount += 1;

    const line = this.findWin(this.board, player);
    if (line) {
      this.gameOver = true;
      this.winner = player;
      this.winningLine = line;
      return true;
    }

    if (this.emptyIndices().length === 0) {
      this.gameOver = true;
      this.winner = "draw";
      this.winningLine = null;
      return true;
    }

    this.currentPlayer = player === "X" ? "O" : "X";
    return true;
  }

  findWin(board, player) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return line;
      }
    }
    return null;
  }

  /**
   * @param {'X'|'O'} player
   * @param {{ randomChance?: number }} [opts]
   *   randomChance: probability of a random legal move (AI vs AI spice).
   */
  getBestMove(player = this.currentPlayer, opts = {}) {
    const board = this.board.slice();
    const empties = this.emptyIndices(board);
    if (empties.length === 0) return -1;

    const randomChance = opts.randomChance ?? 0;
    if (randomChance > 0 && Math.random() < randomChance) {
      return empties[Math.floor(Math.random() * empties.length)];
    }

    // Opening book: take center when free.
    if (board[4] == null) return 4;

    let bestScore = player === "O" ? -Infinity : Infinity;
    let bestMoves = [];

    for (const i of empties) {
      board[i] = player;
      // Scores are from O's perspective (O win positive).
      const score = this.minimax(board, 0, player === "X");
      board[i] = null;

      if (player === "O") {
        if (score > bestScore) {
          bestScore = score;
          bestMoves = [i];
        } else if (score === bestScore) bestMoves.push(i);
      } else if (score < bestScore) {
        bestScore = score;
        bestMoves = [i];
      } else if (score === bestScore) bestMoves.push(i);
    }

    if (bestMoves.length === 0) return empties[0];
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  /** Minimax; maximizing player is O. */
  minimax(board, depth, isMaximizing) {
    if (this.findWin(board, "O")) return 10 - depth;
    if (this.findWin(board, "X")) return depth - 10;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] != null) continue;
        board[i] = "O";
        best = Math.max(best, this.minimax(board, depth + 1, false));
        board[i] = null;
      }
      return best;
    }

    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] != null) continue;
      board[i] = "X";
      best = Math.min(best, this.minimax(board, depth + 1, true));
      board[i] = null;
    }
    return best;
  }
}
