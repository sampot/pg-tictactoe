import { TicTacToeGame } from "./tictactoe.js";

/** @type {'pvp' | 'ai' | 'aivsai'} */
let mode = "pvp";
let game = new TicTacToeGame();
/** @type {ReturnType<typeof setTimeout> | null} */
let aiTimer = null;
let aiVsAiRunning = false;
let thinking = false;
let gameSpeed = 800;

const statusEl = document.getElementById("status");
const modeLabel = document.getElementById("mode-label");
const turnDisplay = document.getElementById("turn-display");
const boardEl = document.getElementById("board");
const cells = [...boardEl.querySelectorAll(".cell")];
const startAiBtn = document.getElementById("start-ai");
const startAiVsAiBtn = document.getElementById("start-ai-vs-ai");
const resetBtn = document.getElementById("reset-game");
const speedSlider = document.getElementById("speed-slider");
const speedValue = document.getElementById("speed-value");

function clearAiTimer() {
  if (aiTimer != null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

function stopAiVsAi() {
  aiVsAiRunning = false;
  clearAiTimer();
}

function updateChrome() {
  const labels = {
    pvp: "雙人輪流",
    ai: "人機對弈（您執 X）",
    aivsai: "AI 對 AI",
  };
  modeLabel.textContent = labels[mode];

  if (mode === "aivsai" && aiVsAiRunning) {
    turnDisplay.textContent = "AI 對弈中";
  } else if (game.isGameOver()) {
    turnDisplay.textContent = "—";
  } else {
    turnDisplay.textContent = game.getCurrentPlayer();
  }

  startAiBtn.textContent =
    mode === "ai" ? "改為雙人對弈" : "開始 AI 對弈";
  startAiVsAiBtn.textContent = aiVsAiRunning
    ? "停止 AI 對 AI"
    : "AI 對 AI 自動對弈";

  startAiBtn.disabled = aiVsAiRunning;
  const speedRow = document.getElementById("speed-row");
  if (speedRow) {
    speedRow.hidden = mode !== "aivsai";
  }
}

function setStatus(message, tone = "") {
  statusEl.textContent = message;
  statusEl.dataset.tone = tone;
}

function refreshStatus() {
  if (game.isGameOver()) {
    const w = game.getWinner();
    if (w === "draw") setStatus("平局！", "draw");
    else if (mode === "ai" && w === "O") setStatus("O（AI）獲勝！", "o");
    else if (mode === "ai" && w === "X") setStatus("X（您）獲勝！", "x");
    else if (mode === "aivsai") setStatus(`AI ${w} 獲勝！`, w.toLowerCase());
    else setStatus(`${w} 獲勝！`, w.toLowerCase());
    return;
  }

  if (mode === "aivsai") {
    setStatus(
      aiVsAiRunning
        ? `AI 對弈進行中…輪到 ${game.getCurrentPlayer()}`
        : "已停止。可再按「AI 對 AI」繼續或「重新開始」。",
    );
    return;
  }

  if (mode === "ai") {
    if (thinking || game.getCurrentPlayer() === "O") {
      setStatus("AI 思考中…");
    } else {
      setStatus("輪到您（X），請選一格。");
    }
    return;
  }

  setStatus(`輪到 ${game.getCurrentPlayer()}，請選一格。`);
}

function renderBoard() {
  const board = game.getBoard();
  const winLine = game.getWinningLine();
  const last = game.getLastMove();

  cells.forEach((cell, i) => {
    const mark = board[i];
    cell.textContent = mark ?? "";
    cell.classList.toggle("x", mark === "X");
    cell.classList.toggle("o", mark === "O");
    cell.classList.toggle("winning", Boolean(winLine?.includes(i)));
    cell.classList.toggle("last", Boolean(last && last.index === i));
    cell.setAttribute("aria-label", mark ? `${mark} 在第 ${i + 1} 格` : `第 ${i + 1} 格，空`);
    const locked =
      game.isGameOver() ||
      mark != null ||
      thinking ||
      aiVsAiRunning ||
      (mode === "ai" && game.getCurrentPlayer() === "O");
    cell.disabled = locked;
  });
}

function afterMove() {
  renderBoard();
  updateChrome();
  refreshStatus();

  if (game.isGameOver()) {
    stopAiVsAi();
    thinking = false;
    updateChrome();
    return;
  }

  if (mode === "ai" && game.getCurrentPlayer() === "O") {
    scheduleAiMove({ randomChance: 0 });
  }
}

function placeAt(index) {
  if (thinking || game.isGameOver()) return false;
  if (!game.makeMove(index)) return false;
  afterMove();
  return true;
}

function scheduleAiMove(opts = {}) {
  if (thinking || game.isGameOver()) return;
  thinking = true;
  updateChrome();
  refreshStatus();

  const delay = mode === "aivsai" ? gameSpeed : 220;
  clearAiTimer();
  aiTimer = setTimeout(() => {
    aiTimer = null;
    thinking = false;
    if (game.isGameOver()) {
      updateChrome();
      refreshStatus();
      return;
    }
    const player = game.getCurrentPlayer();
    const move = game.getBestMove(player, opts);
    if (move < 0) {
      updateChrome();
      refreshStatus();
      return;
    }
    placeAt(move);
    if (mode === "aivsai" && aiVsAiRunning && !game.isGameOver()) {
      scheduleAiMove({ randomChance: 0.08 });
    } else {
      if (game.isGameOver()) aiVsAiRunning = false;
      updateChrome();
    }
  }, delay);
}

function startPvp() {
  stopAiVsAi();
  mode = "pvp";
  thinking = false;
  game.reset();
  renderBoard();
  updateChrome();
  refreshStatus();
}

function startHumanAi() {
  stopAiVsAi();
  mode = "ai";
  thinking = false;
  game.reset();
  renderBoard();
  updateChrome();
  refreshStatus();
}

function toggleAiMode() {
  if (mode === "aivsai" && aiTimer != null) return;
  if (mode === "ai") startPvp();
  else startHumanAi();
}

function toggleAiVsAi() {
  if (aiVsAiRunning) {
    stopAiVsAi();
    thinking = false;
    updateChrome();
    refreshStatus();
    renderBoard();
    return;
  }

  const resume =
    mode === "aivsai" && !game.isGameOver() && game.getLastMove() != null;

  mode = "aivsai";
  thinking = false;
  aiVsAiRunning = true;
  if (!resume) {
    game.reset();
    renderBoard();
  }
  updateChrome();
  refreshStatus();
  scheduleAiMove({ randomChance: 0.08 });
}

function restartGame() {
  stopAiVsAi();
  thinking = false;
  game.reset();
  if (mode === "aivsai") mode = "pvp";
  renderBoard();
  updateChrome();
  refreshStatus();
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (mode === "aivsai") return;
    if (mode === "ai" && game.getCurrentPlayer() === "O") return;
    if (game.isGameOver() || thinking) return;
    placeAt(index);
  });
});

startAiBtn.addEventListener("click", toggleAiMode);
startAiVsAiBtn.addEventListener("click", toggleAiVsAi);
resetBtn.addEventListener("click", restartGame);

speedSlider.addEventListener("input", () => {
  gameSpeed = Number(speedSlider.value);
  speedValue.textContent = `${gameSpeed}ms`;
});

gameSpeed = Number(speedSlider.value);
speedValue.textContent = `${gameSpeed}ms`;
renderBoard();
updateChrome();
refreshStatus();
