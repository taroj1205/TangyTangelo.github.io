const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restart");
const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7 ,8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
const slider = document.getElementById("difficultySlider");
const output = document.getElementById("titleDifficulty");
const maxDepth = 9;

let mainBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let AIPlayer = "O";
let HumanPlayer = "X";
let gameRunning = false;
let scores = {
    X: 10,
    O: -10,
    tie: 0
};

function initGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    gameRunning = true;
};

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (mainBoard[cellIndex] != "" || !gameRunning) {
        return;
    };
    updateCell(this, cellIndex);
};

function updateCell(cell, index) {
    mainBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkWinner(mainBoard);
};

function changePlayer() {    
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
};

function checkWinner(board) {
    let roundWon = false;
    let winner = null;
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = board[condition[0]];
        const cellB = board[condition[1]];
        const cellC = board[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        };
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            winner = currentPlayer
            break;
        };
    };

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        gameRunning = false;
        cells.forEach(cell => cell.removeEventListener("click", cellClicked))
        return winner;
    } else if (!board.includes("")) {
        statusText.textContent = `draw!`;
        gameRunning = false;
        return 'tie';
    } else {
        continueGameMode();
    };
};

function continueGameMode() {
    if (Number(slider.value) === 1) changePlayer();
    if (Number(slider.value) === 2) {
        changePlayer();
        if (currentPlayer == AIPlayer) randomAIMove();
    };
    if (Number(slider.value) === 3) {
        changePlayer();
        let tempBoard = mainBoard.slice();
        if (currentPlayer == AIPlayer) {
            let bestMove = -1;
            let bestScore = -Infinity;
            for (let i = 0; i < mainBoard.length; i++) {
                if (tempBoard[i] === "") {
                tempBoard[i] = AIPlayer;
                let score = minimax(tempBoard, 0, false);
                tempBoard[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                };
            };
        };
        updateCell(document.querySelector(`[cellIndex="${bestMove}"]`), bestMove);
        };
    };
};

function restartGame() {
    currentPlayer = "X";
    mainBoard = ["", "", "", "", "", "", "", "", ""];
    gameRunning = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    cells.forEach(cell => cell.addEventListener("click", cellClicked))
};

function randomAIMove() {
    let available = [];
    for (let i = 0; i < 9; i++) {
        if (mainBoard[i] == "") {
            available.push(i);
        }
    }
    let value = available[Math.floor(Math.random()*available.length)];
    updateCell(document.querySelector(`[cellIndex="${value}"]`), value);
};

function minimax(board, depth, isMaximizingPlayer) {
    let result = checkWinner(board);
    if (result !== null) {
      return scores[result];
    }
  
    if (depth >= maxDepth) {
      return 0;
    }
  
    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = AIPlayer;
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore - depth;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = HumanPlayer;
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore + depth;
    }
  }
  
slider.oninput = function() {restartGame()};

initGame();