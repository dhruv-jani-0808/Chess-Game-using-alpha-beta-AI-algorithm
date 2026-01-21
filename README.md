# ♟️ JS Chess Engine

A lightweight, fully functional Chess game built from scratch using HTML, CSS, and Vanilla JavaScript. It features a custom AI opponent that uses the **Minimax algorithm with Alpha-Beta pruning** to calculate moves.

<img width="3199" height="1820" alt="image" src="https://github.com/user-attachments/assets/033bd840-6f47-4c04-aeef-9c6f3b2d4bb4" />

## 🚀 Live Demo
**[Click here to play the game](https://chessgame-j.netlify.app/)**

## ✨ Features

* **Game Modes:**
    * **Player vs Player:** Classic hot-seat multiplayer.
    * **Player vs Computer:** Challenge the AI engine.
* **Smart AI:**
    * **Easy:** Makes random moves (good for testing).
    * **Medium:** Looks 2 moves ahead.
    * **Hard:** Looks 3 moves ahead and uses advanced positional evaluation.
* **Color Selection:** Choose to play as White or Black (AI automatically rotates the board).
* **Performance:** Uses **Web Workers** to run the AI calculations in a background thread, ensuring the UI never freezes or lags while the computer thinks.
* **Game Logic:** Full move validation (check, checkmate, stalemate, castling, promotion) powered by `chess.js`.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Grid Layout).
* **Logic:** Vanilla JavaScript (ES6+).
* **Multithreading:** Web API (Web Workers).
* **Library:** [Chess.js](https://github.com/jhlywa/chess.js) (for move generation and validation).

## 🧠 How the AI Works

The computer player is built on a **Minimax Algorithm** with **Alpha-Beta Pruning** to optimize performance. It evaluates the board based on:

1.  **Material Score:** Values pieces (Pawn=10, Queen=90, etc.) to calculate who has the material advantage.
2.  **Positional Strategy:**
    * **Center Control:** Bonus points for controlling the center squares (d4, e4, d5, e5).
    * **Pawn Structure:** Incentivizes advancing pawns closer to promotion.
    * **Development:** Penalties for leaving Knights and Bishops on the back rank too long.
3.  **Randomness:** Adds slight "noise" to evaluations to ensure the AI plays varied moves rather than the same game every time.

## 📂 Project Structure

```text
├── index.html      # Main game interface and DOM structure
├── style.css       # Styling, Grid board, and animations
├── script.js       # UI logic, Game loop, and Event listeners
└── worker.js       # The "Brain" - AI logic running in a separate thread
```

## 📦 How to Run Locally
Since this project uses standard web technologies, you don't need to install any dependencies (like Node.js).

1. Clone the repository:
```Bash
git clone "https://github.com/dhruv-jani-0808/Chess-Game-using-alpha-beta-AI-algorithm"
```
2. Open the game:
Simply double-click index.html to open it in your browser.
Note: Some browsers block Web Workers when running from local files (file://). If the AI doesn't move, try running it through a local server (like VS Code's "Live Server" extension).

## 🤝 Contributing

Contributions are welcome!

* **Found a bug or have an idea?** Feel free to raise an issue. If you want to work on it, just let me know in the comments and I will assign it to you.
* **Ready to code?** You can also simply fork the repository and submit a Pull Request (PR) directly.
