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

let board = ["", "", "", "", "", "", "", "", ""];
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

    if (board[cellIndex] != "" || !gameRunning) {
        return;
    };
    updateCell(this, cellIndex);
};

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkWinner();
};

function changePlayer() {    
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
};

function checkWinner() {
    let roundWon = false;
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
            break;
        };
    };

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        gameRunning = false;
        cells.forEach(cell => cell.removeEventListener("click", cellClicked))
        return currentPlayer;
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
        if (currentPlayer == AIPlayer) {
            let bestMove = -1;
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                board[i] = AIPlayer;
                let score = minimax(board, 0, false);
                board[i] = "";
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
    board = ["", "", "", "", "", "", "", "", ""];
    gameRunning = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    cells.forEach(cell => cell.addEventListener("click", cellClicked))
};

function randomAIMove() {
    let available = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] == "") {
            available.push(i);
        }
    }
    let value = available[Math.floor(Math.random()*available.length)];
    updateCell(document.querySelector(`[cellIndex="${value}"]`), value);
};

function minimax(board, depth, isMaximizingPlayer) {
    let result = checkWinner();
    if (result !== null) {
      return scores[result];
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
  

/*function bestAIMove() {
    if (currentPlayer !== AIPlayer) {
        return;
    }
    let bestScore = -Infinity;
    let bestMove = 0;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = AIPlayer;
            let score = Minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            };
        };
    };
    updateCell(document.querySelector(`[cellIndex="${bestMove}"]`), bestMove);
};

function Minimax(board, isMaximising) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    };

    if (isMaximising) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                board[i] = "O";
                let score = Minimax(board, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            };
        };
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                board[i] = "X";
                let score = Minimax(board, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            };
        };
        return bestScore;
    };
};*/

slider.oninput = function() {restartGame()};

initGame();