// --- WORKER SETUP ---
const AIWorker = new Worker('worker.js');

AIWorker.onmessage = function(e) {
    const bestMove = e.data;
    if(bestMove) {
        game.move(bestMove);
        renderBoard();
        checkGameStatus();
    }
};

// -------DOM elements------
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

const modeModal = document.getElementById('mode-modal');
const difficultyModal = document.getElementById('difficulty-modal');
const colorModal = document.getElementById('color-modal');

const btnPlayer = document.getElementById('btn-player');
const btnComputer = document.getElementById('btn-computer');
const btnEasy = document.getElementById('btn-easy');
const btnMedium = document.getElementById('btn-medium');
const btnHard = document.getElementById('btn-hard');
const btnWhite = document.getElementById('btn-white');
const btnBlack = document.getElementById('btn-black');

// --- GAME STATE ---
var game = new Chess();
let gameMode = null;
let difficulty = null;
let playerSide = 'w';
let selectedSquare = null;

const pieceIcons = {
    'w': { 'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕', 'k': '♔' },
    'b': { 'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚' }
};

// --- EVENT LISTENERS ---
btnPlayer.addEventListener('click', () => {
    gameMode = 'pvp';
    playerSide = 'w';
    closeModal(modeModal);
    startGame();
});

btnComputer.addEventListener('click', () => {
    gameMode ='pvc';
    closeModal(modeModal);
    openModal(difficultyModal);
});

btnEasy.addEventListener('click', () => selectDifficulty(1));
btnMedium.addEventListener('click', () => selectDifficulty(2));
btnHard.addEventListener('click', () => selectDifficulty(3));

btnWhite.addEventListener('click', () => {
    playerSide = 'w';
    closeModal(colorModal);
    startGame();
});

btnBlack.addEventListener('click', () => {
    playerSide = 'b';
    closeModal(colorModal);
    startGame();
});

resetBtn.addEventListener('click', () => {
    location.reload();
});

// --- CORE FUNCTIONS ---
function openModal(modal) { modal.classList.remove('hidden'); }
function closeModal(modal) { modal.classList.add('hidden'); }

function selectDifficulty(level) {
    difficulty = level;
    closeModal(difficultyModal);
    openModal(colorModal);
}

function startGame() {
    game.reset();
    boardElement.classList.add('active');

    if (playerSide === 'b') {
        boardElement.classList.add('flipped');
        setTimeout(makeComputerMove, 500);
    } else {
        boardElement.classList.remove('flipped');
    }
    
    renderBoard();
}

function renderBoard() {
    boardElement.innerHTML = '';
    const boardData = game.board();

    if (gameMode === 'pvc' && game.turn() !== playerSide) {
        boardElement.style.pointerEvents = 'none';
    } else {
        boardElement.style.pointerEvents = 'auto';
    }

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');

            if ((row + col) % 2 === 0) square.classList.add('light');
            else square.classList.add('dark');
            
            const piece = boardData[row][col];
            if (piece) {
                square.innerText = pieceIcons[piece.color][piece.type];
                square.dataset.color = piece.color;
            }
            
            square.addEventListener('click', () => handleSquareClick(row, col));

            const squareId = getSquareId(row, col);
            if(selectedSquare === squareId) square.classList.add('selected');

            boardElement.appendChild(square);
        }
    }
    updateStatus();
}

function handleSquareClick(row, col) {
    if(gameMode === 'pvc' && game.turn() !== playerSide) return;

    const clickedSqaureId = getSquareId(row, col);

    if(!selectedSquare) {
        const piece = game.get(clickedSqaureId);

        if(piece && piece.color === game.turn()) {
            selectedSquare = clickedSqaureId;
            renderBoard();
        }
        return;
    }

    const move = game.move({
        from: selectedSquare,
        to: clickedSqaureId,
        promotion: 'q'
    });

    if(move) {
        selectedSquare = null;
        renderBoard();

        const isGameOver = checkGameStatus();

        if(!isGameOver && gameMode === 'pvc') {
            setTimeout(makeComputerMove, 250);
        }
    } else {
        const piece = game.get(clickedSqaureId);
        if(piece && piece.color === game.turn()) {
            selectedSquare = clickedSqaureId;
            renderBoard();
        } else {
            selectedSquare = null;
            renderBoard();
        }
    }
}

function makeComputerMove() {
    if(difficulty === 1) makeRandomMove();
    else {
        const depth = difficulty === 2 ? 2 : 3;

        AIWorker.postMessage({
            fen : game.fen(),
            depth: depth,
            color: game.turn()
        });
    }
}

function makeRandomMove() {
    const possibleMoves = game.moves();

    if(possibleMoves.length == 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
    
    renderBoard();
    checkGameStatus();
}

function checkGameStatus() {
    if (game.game_over()) {
        let msg = '';
        if (game.in_checkmate()) msg = 'Game Over: Checkmate!';
        else if (game.in_draw()) msg = 'Game Over: Draw!';
        else msg = 'Game Over!';
        
        statusElement.innerText = msg;
        setTimeout(() => alert(msg), 500);
        return true;
    }
    return false;
}

function updateStatus() {
    if(game.game_over()) return;
    statusElement.innerText = (game.turn() === 'w') ? "White's Turn" : "Black's Turn";
}

function getSquareId(row, col) {
    const cols = 'abcdefgh';
    const rows = '87654321';

    return cols[col] + rows[row];
}