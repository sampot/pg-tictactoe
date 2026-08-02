import { describe, expect, it } from "vitest";
import { TicTacToeGame } from "./tictactoe.js";

describe("TicTacToeGame", () => {
  it("places marks and switches player", () => {
    const g = new TicTacToeGame();
    expect(g.makeMove(0)).toBe(true);
    expect(g.getBoard()[0]).toBe("X");
    expect(g.getCurrentPlayer()).toBe("O");
  });

  it("detects a row win", () => {
    const g = new TicTacToeGame();
    g.makeMove(0); // X
    g.makeMove(3); // O
    g.makeMove(1); // X
    g.makeMove(4); // O
    expect(g.makeMove(2)).toBe(true); // X wins
    expect(g.isGameOver()).toBe(true);
    expect(g.getWinner()).toBe("X");
    expect(g.getWinningLine()).toEqual([0, 1, 2]);
  });

  it("rejects occupied cells", () => {
    const g = new TicTacToeGame();
    expect(g.makeMove(4)).toBe(true);
    expect(g.makeMove(4)).toBe(false);
  });

  it("AI returns a legal empty cell", () => {
    const g = new TicTacToeGame();
    g.makeMove(0);
    const move = g.getBestMove("O");
    expect(move).toBeGreaterThanOrEqual(0);
    expect(g.getBoard()[move]).toBeNull();
  });

  it("perfect AI blocks an immediate threat", () => {
    const g = new TicTacToeGame();
    // X X _
    // O _ _
    // _ _ _
    g.makeMove(0);
    g.makeMove(3);
    g.makeMove(1);
    const move = g.getBestMove("O", { randomChance: 0 });
    expect(move).toBe(2);
  });
});
