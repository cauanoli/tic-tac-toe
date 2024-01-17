function createCell() {
  let value = null;

  function fill(symbol) {
    value = symbol;
  }

  function clear() {
    value = null;
  }

  function getValue() {
    return value;
  }

  function isEmpty() {
    return value === null;
  }

  return {
    fill,
    clear,
    getValue,
    isEmpty,
  };
}

function createPlayer(name) {
  let score = 0;

  function getName() {
    return name;
  }

  function getScore() {
    return score;
  }

  function addScore() {
    score++;
  }

  function resetScore() {
    score = 0;
  }

  return {
    getName,
    getScore,
    addScore,
    resetScore,
  };
}

const gameBoard = (function () {
  const board = [];

  function startBoard() {
    for (let i = 0; i <= 8; i++) {
      board[i] = createCell();
    }
  }

  function getBoard() {
    return [...board];
  }

  function getBoardValues() {
    return board.map((cell) => cell.getValue());
  }

  /*
    Makes a play with cell is empty returning true,
    if not returns false

    @param {string} playerName
    @param {number} position
  */
  function makePlay(playerName, position) {
    if (position === "random") {
      const validCells = getEmptyCells();
      const randomPlace = Math.floor(Math.random() * (validCells.length - 1));
      validCells[randomPlace].fill(playerName);
      return true;
    } else {
      if (board[position].isEmpty()) {
        board[position].fill(playerName);
        return true;
      } else {
        return false;
      }
    }
  }

  function getEmptyCells() {
    return board.filter((cell) => cell.isEmpty());
  }

  function clear() {
    board.forEach((cell) => {
      cell.clear();
    });
  }

  function printBoard() {
    console.log(`${String(board.map((cell) => cell.getValue() ?? "empty"))}`);
  }

  function isFull() {
    return getBoardValues().every((value) => value !== null);
  }

  startBoard();

  return {
    getBoardValues,
    makePlay,
    getEmptyCells,
    getBoard,
    printBoard,
    clear,
    isFull,
  };
})();

const computer = (function () {
  const computerPlayer = createPlayer("computer");

  function randomPlay() {
    gameBoard.makePlay(computerPlayer.getName(), "random");
  }

  return {
    ...computerPlayer,
    randomPlay,
  };
})();

const scoresBoard = (function () {
  const playerOneDisplay = document.querySelector(
    ".scores-display__player--player-one"
  );
  const playerOneScore = playerOneDisplay.querySelector(
    ".scores-display__player__score"
  );
  const playerOneName = playerOneDisplay.querySelector(
    ".scores-display__player__name"
  );

  const secondPlayerDisplay = document.querySelector(
    ".scores-display__player--player-two"
  );
  const secondPlayerScore = secondPlayerDisplay.querySelector(
    ".scores-display__player__score"
  );
  const secondPlayerName = secondPlayerDisplay.querySelector(
    ".scores-display__player__name"
  );

  function updatePlayerNames({ scores: [firstName, secondName] }) {
    playerOneName.innerText = firstName;
    secondPlayerName.innerText = secondName;
  }

  function updateScores([scoreOne, scoreTwo]) {
    playerOneScore.innerText = scoreOne;
    secondPlayerScore.innerText = scoreTwo;
  }
  events.on("gameStart", updatePlayerNames);
  events.on("scoreUpdate", updateScores);
})();

function createCellDisplay(cell) {
  const cellDiv = document.createElement("div");
  cellDiv.classList = "game-board__cell";

  function addEvent(eventName, fn) {
    cellDiv.addEventListener(eventName, fn);
  }

  function removeEvent(eventName, fn) {
    cellDiv.removeEventListener(eventName, fn);
  }

  return {
    cellDiv,
    addEvent,
    removeEvent,
  };
}

const gameBoardDisplay = (function () {
  const gameBoardContainer = document.querySelector(".game-board");

  function updateBoard({ board, firstPlayerName, secondPlayerName }) {
    gameBoardContainer.childNodes.forEach((child, i) => {
      const playerName = board[i];
      if (playerName === firstPlayerName && child.childNodes.length === 0) {
        const symbol = document.createElement("span");
        symbol.classList = "material-symbols-outlined";
        symbol.innerText = "circle";
        child.appendChild(symbol);
      }

      if (playerName === secondPlayerName && child.childNodes.length === 0) {
        const symbol = document.createElement("span");
        symbol.classList = "material-symbols-outlined";
        symbol.innerText = "close";
        child.appendChild(symbol);
      }
    });
  }

  function onPlayerClick(i) {
    events.emit("playerClick", i);
  }

  function render({ board, currentPlayerName }) {
    board.forEach((cell, i) => {
      const cellDisplay = createCellDisplay(cell, currentPlayerName);
      cellDisplay.addEvent("click", () => onPlayerClick(i));
      gameBoardContainer.appendChild(cellDisplay.cellDiv);
    });
  }

  function resetBoardState() {
    gameBoardContainer.childNodes.forEach((child) => {
      child.removeEventListener("click", onPlayerClick);
      child.innerText = "";
    });
  }

  function clearBoard() {
    resetBoardState();
    gameBoardContainer.textContent = "";
  }

  events.on("gameStart", render);
  events.on("roundFinish", resetBoardState);
  events.on("gameFinish", clearBoard);
  events.on("playerPlay", updateBoard);
})();

const game = (function () {
  let player = createPlayer("player");
  let secondPlayer = null;
  let currentPlayer = player;
  let winner = null;
  let ties = 0;

  function initiateSecondPlayer(value) {
    if (value === "computer") {
      secondPlayer = computer;
    } else {
      secondPlayer = createPlayer("secondPlayer");
    }
  }

  function resetScores() {
    player.resetScore();
    if (!!secondPlayer) {
      secondPlayer.resetScore();
    }
  }

  function passTurn() {
    currentPlayer =
      currentPlayer.getName() === player.getName() ? secondPlayer : player;
  }

  function verifyForWinner() {
    const board = gameBoard.getBoardValues();

    function verifyRows() {
      if (board[0] != null && board[0] == board[1] && board[1] == board[2]) {
        winner = board[0];
        return;
      }
      if (board[3] != null && board[3] === board[4] && board[4] === board[5]) {
        winner = board[3];
        return;
      }
      if (board[6] != null && board[6] === board[7] && board[7] === board[8]) {
        winner = board[6];
        return;
      }
    }

    function verifyColumns() {
      if (board[0] != null && board[0] === board[3] && board[3] === board[6]) {
        winner = board[0];
        return;
      }
      if (board[1] != null && board[1] === board[4] && board[4] === board[7]) {
        winner = board[1];
        return;
      }
      if (board[2] != null && board[2] === board[5] && board[5] === board[8]) {
        winner = board[2];
        return;
      }
    }

    function verifyDiagonals() {
      if (board[0] != null && board[0] === board[4] && board[4] === board[8]) {
        winner = board[0];
        return;
      }

      if (board[2] != null && board[2] === board[4] && board[4] === board[6]) {
        winner = board[2];
        return;
      }
    }

    verifyRows();
    verifyColumns();
    verifyDiagonals();
  }

  function updateScores() {
    if (winner === player.getName()) {
      player.addScore();
    }

    if (winner === secondPlayer.getName()) {
      secondPlayer.addScore();
    }

    events.emit("scoreUpdate", [player.getScore(), secondPlayer.getScore()]);
  }

  function makePlay(position) {
    if (currentPlayer.getName() === computer.getName()) {
      computer.randomPlay();
    } else {
      const isSuccessFull = gameBoard.makePlay(
        currentPlayer.getName(),
        position
      );
      if (!isSuccessFull) {
        return;
      }
    }
    verifyForWinner();
    gameBoard.printBoard();

    if (winner) {
      updateScores();
      finishRound();
      events.emit("roundStart", {
        scores: [player.getName(), secondPlayer.getName()],
        currentPlayer: currentPlayer.getName(),
        board: gameBoard.getBoard(),
      });
    }

    if (!winner && gameBoard.isFull()) {
      ties++;
      finishRound();
      events.emit("roundStart", {
        scores: [player.getName(), secondPlayer.getName()],
        currentPlayer: currentPlayer.getName(),
        board: gameBoard.getBoard(),
      });
    }

    passTurn();
  }

  function reset() {
    winner = null;
    gameBoard.clear();
  }

  function start(secondPlayerValue) {
    initiateSecondPlayer(secondPlayerValue);

    events.emit("scoreUpdate", [player.getScore(), secondPlayer.getScore()]);
    events.emit("gameStart", {
      scores: [player.getName(), secondPlayer.getName()],
      currentPlayer: currentPlayer.getName(),
      board: gameBoard.getBoard(),
    });
  }
  events.on("playerClick", (position) => {
    if (currentPlayer.getName() !== computer.getName()) {
      makePlay(position);
    } else {
      makePlay();
    }

    events.emit("playerPlay", {
      board: gameBoard.getBoardValues(),
      firstPlayerName: player.getName(),
      secondPlayerName: secondPlayer.getName(),
    });
  });

  function finishRound() {
    reset();
    events.emit("roundFinish");
  }

  function finish() {
    finishRound();
    resetScores();
    events.emit("gameFinish");
  }

  return {
    makePlay,
    start,
    finish,
  };
})();

// start screen modal
(function () {
  const startGameModal = document.querySelector("dialog.start-screen-dialog");
  const selectPlayerInputs = startGameModal.querySelectorAll(
    "input[name='player-two'"
  );

  const selectThemeInputs =
    startGameModal.querySelectorAll("input[name='theme'");
  startGameModal.showModal();

  const startGameButton = startGameModal.querySelector(".start-screen__button");

  const backButton = document.querySelector(".back-button");

  backButton.addEventListener("click", () => {
    startGameModal.showModal();
    game.finish();
  });

  function setTheme(theme) {
    document.body.classList = theme;
  }

  function startGame() {
    const secondPlayer = [...selectPlayerInputs].filter(
      (input) => input.checked
    )[0].value;
    game.start(secondPlayer);
    startGameModal.close();
  }

  startGameButton.addEventListener("click", startGame);

  selectThemeInputs.forEach((input) => {
    input.addEventListener("click", (event) => {
      setTheme(event.target.value);
    });
  });
})();
