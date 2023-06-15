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
const maxDepth = 7;

let mainBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let AIPlayer = "O";
let HumanPlayer = "X";
let gameRunning = false;
let minimaxStep;
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
    minimaxStep = 0;
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
    var roundWon = false;
    roundWon = checkWinner(mainBoard);

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        gameRunning = false;
        cells.forEach((cell) => cell.removeEventListener("click", cellClicked));
    } else if (!mainBoard.includes("")) {
        statusText.textContent = `Draw!`;
        gameRunning = false;
    } else {
        continueGameMode();
    }
};

function changePlayer() {    
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
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
        }
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            winner = currentPlayer;
            break;
        }
    }
  
    if (roundWon) {
        return winner;
    } else if (!board.includes("")) {
        return "tie";
    } else {
        return null;
    }
}
  
function continueGameMode() {
    if (Number(slider.value) === 1) {
        changePlayer();
    } else if (Number(slider.value) === 2) {
        changePlayer();
        if (currentPlayer == AIPlayer) {
            randomAIMove();
        }
    } else if (Number(slider.value) === 3) {
        changePlayer();
        if (currentPlayer === AIPlayer) {
            console.log("its ai's turn")
            makeAIMove()
        };
    };
};

function makeAIMove() {
    let bestMove = getBestMove();
    updateCell(document.querySelector(`[cellIndex="${bestMove}"]`), bestMove);
    console.log('hmmmmm')
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < mainBoard.length; i++) {
        if (mainBoard[i] === "") {
            mainBoard[i] = AIPlayer;
            let score = minimax(mainBoard, 0, false);
            mainBoard[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            };
        };
    };
    return bestMove;
};

function restartGame() {
    currentPlayer = "X";
    mainBoard = ["", "", "", "", "", "", "", "", ""];
    minimaxStep = 0;
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
        return bestScore;
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
        return bestScore;
    }
}

slider.oninput = function() {restartGame()};

initGame();