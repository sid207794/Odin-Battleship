import { Gameboard, Player } from './logic.js';

const createGrid = (function () {
  const fleetGrid = document.querySelector('.fleetGrid');
  const attackGrid = document.querySelector('.attackGrid');

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const fleeDdiv = document.createElement('div');
      fleeDdiv.classList.add(`${String.fromCharCode(65 + j)}${i + 1}`);
      fleeDdiv.classList.add('fleetCell');
      fleetGrid.appendChild(fleeDdiv);

      const attackDiv = document.createElement('div');
      attackDiv.classList.add(`${String.fromCharCode(65 + j)}${i + 1}`);
      attackDiv.classList.add('attackCell');
      attackGrid.appendChild(attackDiv);
    }
  }
})();

const playerVsComp = (function () {
  const player = new Player(false);
  player.gameboard.boardCoordinates();
  player.gameboard.shipPlacement();
  const shipCoordinates = player.gameboard.shipCoordinates.flat();
  const fleetCells = document.querySelectorAll('.fleetCell');

  const computer = new Player(true);
  computer.gameboard.boardCoordinates();
  computer.gameboard.shipPlacement();
  const attackCells = document.querySelectorAll('.attackCell');

  (function showPlayerFleet() {
    for (let child of fleetCells) {
      const cellCoord = [
        child.classList[0].charAt(0),
        Number(child.classList[0].slice(1)),
      ];

      child.style.pointerEvents = 'none';

      const isShip = shipCoordinates.some(
        (coord) => coord[0] === cellCoord[0] && coord[1] === cellCoord[1]
      );
      if (isShip) {
        child.style.backgroundColor = 'white';
      }
    }
  })();

  (function enablePlayerAttack() {
    const shipStatusRight = document.querySelectorAll(
      '.rightPanel .shipStatus .shipWrap'
    );

    const rightShipHits = Array.from(
      document.querySelectorAll('.rightPanel .shipStatus .shipWrap')
    ).map((wrap) => Array.from(wrap.querySelectorAll('.coordStatus div')));

    for (let child of attackCells) {
      const cellCoord = [
        child.classList[0].charAt(0),
        Number(child.classList[0].slice(1)),
      ];

      child.addEventListener('click', () => {
        const result = computer.gameboard.receiveAttack(cellCoord);

        if (result.alreadyTried) {
          return;
        }

        updateHitStatus({
          isPlayer: false,
          panel: 'rightPanel',
          cell: child,
          result: result,
          shipStatus: shipStatusRight,
          shipHits: rightShipHits,
          turn: computer,
        });

        if (computer.gameboard.isGameOver()) {
          console.log('GAME OVER!');
          lockAttackGrid();
        } else {
          setTimeout(() => {
            dumbAttackOnPlayer();
          }, 500);
          lockAttackGrid();
        }
      });
    }
  })();

  const dumbAttackOnPlayer = function () {
    const xRandom = Math.floor(Math.random() * 10);
    const yRandom = Math.floor(Math.random() * 10) + 1;
    const compCellCoord = [String.fromCharCode(65 + xRandom), yRandom];
    const child = document.querySelector(
      `.fleetGrid .${compCellCoord[0]}${compCellCoord[1]}`
    );
    const compAttackResult = player.gameboard.receiveAttack(compCellCoord);
    const shipStatusLeft = document.querySelectorAll(
      '.leftPanel .shipStatus .shipWrap'
    );

    const leftShipHits = Array.from(
      document.querySelectorAll('.leftPanel .shipStatus .shipWrap')
    ).map((wrap) => Array.from(wrap.querySelectorAll('.coordStatus div')));

    if (compAttackResult.alreadyTried) {
      dumbAttackOnPlayer();
      return;
    }

    updateHitStatus({
      isPlayer: true,
      panel: 'leftPanel',
      cell: child,
      result: compAttackResult,
      shipStatus: shipStatusLeft,
      shipHits: leftShipHits,
      turn: player,
    });

    if (player.gameboard.isGameOver()) {
      console.log('GAME OVER!');
      lockAttackGrid();
    } else {
      unlockAttackGrid();
    }
  };

  function updateHitStatus({
    isPlayer,
    panel,
    cell,
    result,
    shipStatus,
    shipHits,
    turn,
  }) {
    if (result.hit) {
      cell.style.backgroundColor = 'red';
      const hitCount = turn.gameboard.allShipData[result.shipIndex].hits;
      shipHits[result.shipIndex][hitCount - 1].style.backgroundColor = 'red';
    } else {
      cell.style.backgroundColor = 'aqua';
    }

    if (result.shipSunk) {
      const carrierStatus = document.querySelector(
        `.${panel} .${shipStatus[result.shipIndex].classList[0]} .carrierStatus`
      );
      const carrierStatusImg = document.querySelector(
        `.${panel} .${shipStatus[result.shipIndex].classList[0]} .carrierStatus img`
      );

      carrierStatus.classList.add(isPlayer ? 'sunkLeft' : 'sunkRight');
      carrierStatusImg.classList.add(isPlayer ? 'sunkLeftImg' : 'sunkRightImg');
    }

    cell.style.pointerEvents = 'none';
    cell.style.cursor = 'default';
    cell.style.filter = 'brightness(100%)';
  }

  function lockAttackGrid() {
    attackCells.forEach((child) => (child.style.pointerEvents = 'none'));
  }

  function unlockAttackGrid() {
    attackCells.forEach((child) => (child.style.pointerEvents = 'auto'));
  }
})();
