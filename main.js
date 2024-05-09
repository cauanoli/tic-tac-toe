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
        const isRowFull = (row) =>
            row.length >= boardSize && row.every((cell) => cell !== undefined);
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
        clear,
        boardSize,
    };
})();

const gameController = (function () {
    const isAllEqual = (array) =>
        array.every((element) => element === array[0]);

    const isNotEmpty = (array) =>
        array.find((value) => value !== undefined || value !== null);

    const isFull = (array) =>
        isNotEmpty(array) && array.length === board.boardSize;

    function verifyWin(board) {
        const rows = board.getRows();
        const columns = board.getColumns();
        const diagonals = board.getDiagonals();
        console.log({ rows, columns, diagonals });

        const rowWin = rows.find((row) => isFull(row) && isAllEqual(row));

        const columnWin = columns.find(
            (column) => isFull(column) && isAllEqual(column)
        );
        const diagonalWin = diagonals.find(
            (diagonal) => isFull(diagonal) && isAllEqual(diagonal)
        );

        const winningConditions = [rowWin, columnWin, diagonalWin];

        return winningConditions.find((condition) => {
            console.log(condition);
            return !!condition;
        });
    }

    return {
        verifyWin,
    };
})();

const game = (function () {
    const playerOne = createPlayer(0);
    const playerTwo = createPlayer(1);
    let activePlayer = playerOne;

    function resetTurn() {
        activePlayer = playerOne;
        board.clear();
    }

    function passTurn() {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    function playTurn(line, column) {
        board.placeValue(line, column, activePlayer);

        const win = gameController.verifyWin(board);

        if (win) {
            console.log("win");
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

    return {
        playTurn,
        finishGame,
    };
})();
