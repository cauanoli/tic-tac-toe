function createPlayer(symbol) {
    let score = 0;

    function resetScore() {
        score = 0;
    }

    function increaseScore() {
        score++;
    }

    function getScore() {
        return score;
    }

    function clear() {
        resetScore();
    }

    return {
        symbol,
        increaseScore,
        getScore,
        clear,
    };
}

const board = (function () {
    const boardSize = 3; // size x size board

    let full = false;
    let board = [[], [], []];

    function placeValue(line, column, symbol) {
        board[line][column] = symbol;
    }

    function isCellFull(line, column) {
        return board[line][column] !== undefined;
    }

    function getBoard() {
        return board;
    }

    function getRows() {
        return board;
    }

    function getColumns() {
        const columns = [...board.map((_) => [])];

        const addElementToColumns = (row, rowIndex) => {
            row.forEach((rowElement, rowElementIndex) => {
                columns[rowElementIndex][rowIndex] = rowElement;
            });
        };

        getRows().forEach((row, rowIndex) => {
            addElementToColumns(row, rowIndex);
        });

        return columns;
    }

    function getDiagonals() {
        const firstDiagonal = [];
        const secondDiagonal = [];

        for (let i = 0; i <= board.length - 1; i++) {
            firstDiagonal.push(board[i][board.length - i - 1]);
            secondDiagonal.push(board[i][i]);
        }

        return [firstDiagonal, secondDiagonal];
    }

    function isFull() {
        // Verify if all row has all cells
        const isRowFull = (row) => row.flat().length >= boardSize;

        full = board.every((row) => isRowFull(row));

        return full;
    }

    function clear() {
        board = [[], [], []];
        full = false;
    }

    return {
        placeValue,
        getBoard,
        getRows,
        getColumns,
        getDiagonals,
        isFull,
        isCellFull,
        clear,
        boardSize,
    };
})();

const gameController = (function () {
    const isAllEqual = (array) =>
        array.every((element) => element === array[0]);

    const isNotEmpty = (array) =>
        array.find((value) => value !== undefined && value !== null);

    const isFull = (array) =>
        isNotEmpty(array) && array.flat().length === board.boardSize;

    function verifyWin(board) {
        const rows = board.getRows();
        const columns = board.getColumns();
        const diagonals = board.getDiagonals();

        const rowWin = rows.find((row) => isFull(row) && isAllEqual(row));

        const columnWin = columns.find(
            (column) => isFull(column) && isAllEqual(column)
        );
        const diagonalWin = diagonals.find(
            (diagonal) => isFull(diagonal) && isAllEqual(diagonal)
        );

        function hasWon() {
            if (rowWin !== undefined) {
                console.log("row win");
                return true;
            }

            if (columnWin !== undefined) {
                console.log("column win");
                return true;
            }
            if (diagonalWin !== undefined) {
                console.log("diagonal win");
                return true;
            }
        }

        return hasWon();
    }

    return {
        verifyWin,
    };
})();

const game = (function () {
    const playerOne = createPlayer(0);
    const playerTwo = createPlayer(1);
    let activePlayer = playerOne;

    function getActivePlayer() {
        return activePlayer;
    }

    function resetTurn() {
        activePlayer = playerOne;
        board.clear();
        displayController.resetGameBoard();
        displayController.updateScoreBoard(...getPlayers());
    }

    function passTurn() {
        console.log({ activePlayer });
        activePlayer =
            activePlayer.symbol === playerOne.symbol ? playerTwo : playerOne;
        console.log({ activePlayer });
    }

    function playTurn(line, column) {
        if (board.isCellFull(line, column)) {
            return;
        }

        board.placeValue(line, column, activePlayer);
        const win = gameController.verifyWin(board);

        if (win) {
            activePlayer.increaseScore();
            resetTurn();
        } else if (board.isFull()) {
            console.log("tie");
            resetTurn();
        } else {
            passTurn();
            console.log("Player Turn:" + activePlayer.symbol);
        }
    }

    function finishGame() {
        resetTurn();
        playerOne.clear();
        playerTwo.clear();
    }

    function getPlayers() {
        return [playerOne, playerTwo];
    }

    return {
        playTurn,
        finishGame,
        getActivePlayer,
        getPlayers,
    };
})();

const displayController = (function () {
    const symbolMap = {
        0: "x",
        1: "o",
    };

    function getSymbol(player) {
        console.log(player.symbol);
        return symbolMap[player.symbol];
    }

    const gameBoard = document.querySelector("#board");

    function placeSymbolOnCell({ rowNumber, columnNumber, cellElement }) {
        const playerSymbol = getSymbol(game.getActivePlayer());
        cellElement.textContent = playerSymbol;

        game.playTurn(rowNumber, columnNumber);
    }

    function renderScoreboard(playerOne, playerTwo) {
        const scoreBoard = document.querySelector(".scoreboard");
        const playerOneName = scoreBoard.querySelector(".player-one-symbol");
        const playerOneScoreboard =
            scoreBoard.querySelector(".player-one-score");
        const playerTwoName = scoreBoard.querySelector(".player-two-symbol");
        const playerTwoScoreboard =
            scoreBoard.querySelector(".player-two-score");

        playerOneName.textContent = getSymbol(playerOne);
        playerOneScoreboard.textContent = playerOne.getScore();

        playerTwoName.textContent = getSymbol(playerTwo);
        playerTwoScoreboard.textContent = playerTwo.getScore();
    }

    function updateScoreBoard(playerOne, playerTwo) {
        renderScoreboard(playerOne, playerTwo);
    }

    function renderGameBoard(boardArray) {
        function renderRow(row, rowNumber) {
            const rowElement = document.createElement("div");
            rowElement.classList.add("row");

            if (row.length < board.boardSize) {
                for (let i = 0; i < board.boardSize; i++) {
                    const cellElement = renderCell(row[i], {
                        rowNumber,
                        columnNumber: i,
                    });
                    rowElement.appendChild(cellElement);
                }
            } else {
                row.forEach((cell) => {
                    const cellElement = renderCell(cell);
                    rowElement.appendChild(cellElement);
                });
            }

            return rowElement;
        }

        function renderCell(cellSymbol, { rowNumber, columnNumber }) {
            const symbol = symbolMap[cellSymbol];
            const cellElement = document.createElement("div");

            cellElement.classList.add("cell");
            cellElement.textContent = symbol;

            if (!symbol) {
                cellElement.addEventListener("click", (event) =>
                    placeSymbolOnCell({
                        rowNumber,
                        columnNumber,
                        cellElement: event.target,
                    })
                );
            }

            return cellElement;
        }

        boardArray.forEach((row, i) => {
            const rowElement = renderRow(row, i);
            gameBoard.appendChild(rowElement);
        });
    }

    function clearGameBoard() {
        const gameBoard = document.querySelector("#board");
        Array.from(gameBoard.childNodes).forEach((row) => {
            Array.from(row.childNodes).forEach((cell) => {
                cell.removeEventListener("click", placeSymbolOnCell);
                row.removeChild(cell);
            });
        });
    }

    function resetGameBoard() {
        clearGameBoard();
        renderGameBoard(board.getBoard());
    }

    return {
        renderGameBoard,
        renderScoreboard,
        resetGameBoard,
        updateScoreBoard,
    };
})();

(function () {
    displayController.renderGameBoard(board.getBoard());
    displayController.renderScoreboard(...game.getPlayers());
})();
