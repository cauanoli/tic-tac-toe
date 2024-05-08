function createPlayer(symbol) {
    let score = 0;

    function increaseScore() {
        score++;
    }

    function getScore() {
        return score;
    }

    return {
        symbol,
        increaseScore,
        getScore,
        clear,
    };
}

const board = (function () {
    const maxBoardLength = 9;

    let full = false;
    let board = [];

    // TODO: Implement way to full board
    function placeValue() {}

    function getBoard() {
        return board;
    }

    function isFull() {
        if (board.length >= maxBoardLength) {
            full = true;
        }

        return full;
    }

    function clear() {
        board = [];
        full = false;
    }

    return {
        placeValue,
        getBoard,
        isFull,
        clear,
    };
})();

// TODO: Implement winning condition
const gameController = (function () {
    function verifyWin() {}

    return {
        verifyWin,
    };
})();

const game = (function () {
    const playerOne = createPlayer(0);
    const playerTwo = createPlayer(1);

    function resetTurn() {
        activePlayer = playerOne;
        board.clear();
    }

    function passTurn() {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    function playTurn(line, column) {
        board.placeValue(line, column, activePlayer);

        const win = verifyWin(board.getBoard());
        if (win) {
            console.log("win");
            activePlayer.increaseScore();
            resetTurn();
        } else if (board.isFull()) {
            console.log("tie");
            resetTurn();
        } else {
            passTurn();
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
