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

  return {
    getName,
    getScore,
    addScore,
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
    return board.map((cell) => cell.getValue());
  }

  function makePlay(playerName, position) {
    if (position === "random") {
      const validCells = getEmptyCells();
      const randomPlace = Math.floor(Math.random() * (validCells.length - 1));
      validCells[randomPlace].fill(playerName);
    } else {
      board[position].fill(playerName);
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

  startBoard();

  return {
    getBoard,
    makePlay,
    getEmptyCells,
    printBoard,
    clear,
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

  function updatePlayerNames([firstName, secondName]) {
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

const game = (function () {
  const player = createPlayer("cauan");
  const secondPlayer = computer;
  let currentPlayer = player;
  let winner = null;

  function passTurn() {
    currentPlayer =
      currentPlayer.getName() === player.getName() ? secondPlayer : player;
  }

  function verifyForWinner() {
    const board = gameBoard.getBoard();

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

      if (board[0] != null && board[2] === board[4] && board[4] === board[6]) {
        winner = board[2];
        return;
      }
    }

    verifyRows();
    verifyColumns();
    verifyDiagonals();
  }

  function announceWinner() {
    console.log(console.log("winner is " + winner));
    console.log(
      `Player1: ${player.getScore()}\nPlayer2: ${secondPlayer.getScore()}`
    );
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
      gameBoard.makePlay(currentPlayer.getName(), position);
    }

    gameBoard.printBoard();
    verifyForWinner();

    if (winner) {
      updateScores();
      announceWinner();
      winner = null;
      gameBoard.clear();
    }

    passTurn();
  }

  function reset() {
    winner = null;
    gameBoard.clear();
  }

  events.emit("scoreUpdate", [player.getScore(), secondPlayer.getScore()]);
  events.emit("gameStart", [player.getName(), secondPlayer.getName()]);

  return {
    makePlay,
  };
})();
