importScripts('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js');

// --- CONSTANTS ---
const pieceValues = {
    'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900
};

// --- WORKER LISTENER ---
self.onmessage = function(e) {
    const { fen, depth, color } = e.data;
    const game = new Chess(fen);
    const bestMove = makeBestMove(game, depth, color === 'w');
    
    postMessage(bestMove);
};

// --- EVALUATION & AI ---
function evaluateBoard(gameBoard) {
    let totalEvaluation = 0;

    for(let row = 0; row < 8; row++) {
        for(let col = 0; col < 8; col++) {
            const piece = gameBoard[row][col];

            if(piece) {
                let value = pieceValues[piece.type];

                // Center Bonus
                if (row >= 3 && row <= 4 && col >= 3 && col <= 4) value += 10;

                // Pawn Push Bonus
                if (piece.type === 'p') {
                    value += (piece.color === 'w' ? (6 - row) : (row - 1)) * 5; 
                }
                
                // Lazy Piece Penalty
                if ((piece.type === 'n' || piece.type === 'b') && (row === 0 || row === 7)) {
                    value -= 10;
                }
                totalEvaluation += (piece.color === 'w' ? value : -value);
            }
        }
    }
    return totalEvaluation + (Math.random() - 0.5);
}

function makeBestMove(game, depth, isMaximizing) {
    const possibleMoves = game.moves();
    if(possibleMoves.length == 0) return;

    let bestMove = null;
    let bestValue = isMaximizing ? -Infinity : Infinity;

    possibleMoves.sort(() => Math.random() - 0.5);
    
    for(let i = 0; i < possibleMoves.length; i++) {
        game.move(possibleMoves[i]);

        let value = minimax(depth - 1, game, -Infinity, Infinity, !isMaximizing);
        game.undo();

        if(isMaximizing) {
            if(value > bestValue) {
                bestValue = value;
                bestMove = possibleMoves[i];
            }
        } else {
            if(value < bestValue) {
                bestValue = value;
                bestMove = possibleMoves[i];
            }
        }
    }

    return bestMove;
}

function minimax(depth, game, alpha, beta, isMaximizingPlayer) {
    if(depth === 0 || game.game_over()) {
        return evaluateBoard(game.board());
    }

    const possibleMoves = game.moves();
    
    if(isMaximizingPlayer) {
        let maxEval = -Infinity;

        for(let i = 0; i < possibleMoves.length; i++) {
            game.move(possibleMoves[i]);
            let eVal = minimax(depth - 1, game, alpha, beta, false);
            game.undo();

            maxEval = Math.max(maxEval, eVal);
            alpha = Math.max(alpha, eVal);

            if(beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;

        for(let i = 0; i < possibleMoves.length; i++) {
            game.move(possibleMoves[i]);
            let eVal = minimax(depth - 1, game, alpha, beta, true);
            game.undo();

            minEval = Math.min(minEval, eVal);
            beta = Math.min(beta, eVal);

            if(beta <= alpha) break;
        }
        return minEval;
    }
}