import { Gameboard, Player } from './logic.js';

const fleet = document.querySelector('.fleet');
const attackArea = document.querySelector('.attackArea');

export const gameModeSelect = (function () {
  fleet.replaceChildren();
  attackArea.replaceChildren();

  const fleetOption = document.createElement('div');
  fleetOption.classList.add('fleetOption');

  fleet.appendChild(fleetOption);

  const optionsText = document.createElement('div');
  optionsText.classList.add('optionText');
  optionsText.textContent = 'SELECT GAME MODE';
  const options = document.createElement('div');
  options.classList.add('options');

  fleetOption.appendChild(optionsText);
  fleetOption.appendChild(options);

  const optionArray = ['A.I. (P-V-E)', 'PLAYER (P-V-P)'];

  for (let i = 1; i <= 2; i++) {
    const optionNum = document.createElement('div');
    optionNum.classList.add(`option${i}`);
    optionNum.innerHTML = `<button class='button${i}'>${optionArray[i - 1]}</button>`;
    options.appendChild(optionNum);
  }
})();

export const fleetPlacementOptions = function () {
  fleet.replaceChildren();
  attackArea.replaceChildren();

  const fleetOption = document.createElement('div');
  fleetOption.classList.add('fleetOption');

  fleet.appendChild(fleetOption);

  const optionsText = document.createElement('div');
  optionsText.classList.add('optionText');
  optionsText.textContent = 'SELECT FLEET PLACEMENT TYPE';
  const options = document.createElement('div');
  options.classList.add('options');

  fleetOption.appendChild(optionsText);
  fleetOption.appendChild(options);

  const optionArray = ['RANDOMIZED', 'CUSTOM COORDINATES', 'MANUAL RELOCATION'];

  for (let i = 1; i <= 3; i++) {
    const optionNum = document.createElement('div');
    optionNum.classList.add(`option${i}`);
    optionNum.innerHTML = `<button class='button${i}'>${optionArray[i - 1]}</button>`;
    options.appendChild(optionNum);
  }
};

export const createGrid = function () {
  fleet.replaceChildren();
  attackArea.replaceChildren();

  const fleetGrid = document.createElement('div');
  const attackGrid = document.createElement('div');
  fleetGrid.classList.add('fleetGrid');
  attackGrid.classList.add('attackGrid');

  fleet.appendChild(fleetGrid);
  attackArea.appendChild(attackGrid);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const fleetDdiv = document.createElement('div');
      fleetDdiv.classList.add(`${String.fromCharCode(65 + j)}${i + 1}`);
      fleetDdiv.classList.add('fleetCell');
      fleetGrid.appendChild(fleetDdiv);

      const attackDiv = document.createElement('div');
      attackDiv.classList.add(`${String.fromCharCode(65 + j)}${i + 1}`);
      attackDiv.classList.add('attackCell');
      attackGrid.appendChild(attackDiv);
    }
  }
};

export const playerVsComp = function () {
  let bannedCoords = [];

  const player = new Player(false);
  player.gameboard.boardCoordinates();
  player.gameboard.boardRowCoords();
  player.gameboard.boardColCoords();
  player.gameboard.shipPlacement();
  const shipCoordinates = player.gameboard.shipCoordinates.flat();
  const fleetCells = document.querySelectorAll('.fleetCell');

  const computer = new Player(true);
  computer.gameboard.boardCoordinates();
  computer.gameboard.shipPlacement();
  const attackCells = document.querySelectorAll('.attackCell');

  let aiMemory = {
    chasing: false,
    firstHit: null,
    origin: null,
    directionIndex: 0,
    directions: [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ],
  };

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
          isPlayerShip: false,
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
        } else if (result.hit) {
          return;
        } else if (aiMemory.chasing) {
          lockAttackGrid();
          setTimeout(() => {
            findPlayerShipOnHit();
          }, 500);
        } else {
          lockAttackGrid();
          setTimeout(() => {
            enableCompAttack();
          }, 500);
        }
      });
    }
  })();

  function getNewRandomCoord() {
    let smartCoord;

    do {
      const xRandom = Math.floor(Math.random() * 10);
      const yRandom = Math.floor(Math.random() * 10) + 1;
      const coord = [String.fromCharCode(65 + xRandom), yRandom];
      const viableZones = player.gameboard.getValidFireZones(coord);
      const viableCoords = viableZones.flat();

      if (viableCoords.length === 0) {
        smartCoord = null;
        continue;
      }

      const randomIndex = Math.floor(Math.random() * viableCoords.length);
      smartCoord = viableCoords[randomIndex];
    } while (
      !smartCoord ||
      player.gameboard.isAlreadyTried(smartCoord) ||
      bannedCoords.includes(smartCoord.join(''))
    );

    return smartCoord;
  }

  function getValidChaseDirections(coord) {
    const smallestShipLength = player.gameboard.smallestUnsunkShip();
    if (!smallestShipLength) return [];

    const dirPairs = [
      [
        [0, 1],
        [0, -1],
      ],
      [
        [1, 0],
        [-1, 0],
      ],
    ];

    const validDirs = [];

    for (let [dirA, dirB] of dirPairs) {
      let count = 1;

      count += countValidSteps(coord, dirA);
      count += countValidSteps(coord, dirB);

      if (count >= smallestShipLength) {
        if (isValidDirection(coord, dirA)) validDirs.push(dirA);
        if (isValidDirection(coord, dirB)) validDirs.push(dirB);
      }
    }

    return shuffle(validDirs);

    function countValidSteps(start, [x, y]) {
      let steps = 0;
      let [col, row] = [start[0].charCodeAt(0), start[1]];
      for (let i = 1; i < smallestShipLength; i++) {
        const newCol = String.fromCharCode(col + x * i);
        const newRow = row + y * i;
        const nextCoord = [newCol, newRow];

        if (
          !isValidCoord(nextCoord) ||
          player.gameboard.isAlreadyTried(nextCoord) ||
          bannedCoords.includes(nextCoord.join(''))
        ) {
          break;
        }
        steps++;
      }
      return steps;
    }

    function isValidDirection(start, [x, y]) {
      const newCol = String.fromCharCode(start[0].charCodeAt(0) + x);
      const newRow = start[1] + y;
      const next = [newCol, newRow];
      return (
        isValidCoord(next) &&
        !player.gameboard.isAlreadyTried(next) &&
        !bannedCoords.includes(next.join(''))
      );
    }
  }

  function shuffle(dirs) {
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }

    return dirs;
  }

  const enableCompAttack = function () {
    let compCellCoord = getNewRandomCoord();
    const attackItems = compAttackItems(compCellCoord);

    updateHitStatus({
      isPlayerShip: true,
      panel: 'leftPanel',
      cell: attackItems.child,
      result: attackItems.result,
      shipStatus: attackItems.shipStatusLeft,
      shipHits: attackItems.leftShipHits,
      turn: player,
    });

    if (player.gameboard.isGameOver()) {
      console.log('GAME OVER!');
      lockAttackGrid();
    } else if (attackItems.result.hit && !attackItems.result.shipSunk) {
      lockAttackGrid();

      const smartDirections = getValidChaseDirections(compCellCoord);

      aiMemory = {
        chasing: true,
        firstHit: compCellCoord,
        origin: compCellCoord,
        directionIndex: 0,
        directions: smartDirections,
      };
      setTimeout(() => {
        findPlayerShipOnHit();
      }, 500);
    } else if (attackItems.result.hit && attackItems.result.shipSunk) {
      markSurroundingAsBanned(
        player.gameboard.shipCoordinates[attackItems.result.shipIndex]
      );

      setTimeout(() => {
        fireBonusRandomShot();
      }, 500);
    } else {
      unlockAttackGrid();
    }
  };

  function compAttackItems(coord) {
    const child = document.querySelector(`.fleetGrid .${coord[0]}${coord[1]}`);
    const result = player.gameboard.receiveAttack(coord);
    const shipStatusLeft = document.querySelectorAll(
      '.leftPanel .shipStatus .shipWrap'
    );

    const leftShipHits = Array.from(
      document.querySelectorAll('.leftPanel .shipStatus .shipWrap')
    ).map((wrap) => Array.from(wrap.querySelectorAll('.coordStatus div')));

    return {
      child: child,
      result: result,
      shipStatusLeft: shipStatusLeft,
      leftShipHits: leftShipHits,
    };
  }

  function updateHitStatus({
    isPlayerShip,
    panel,
    cell,
    result,
    shipStatus,
    shipHits,
    turn,
  }) {
    if (result.alreadyTried) return;

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

      carrierStatus.classList.add(isPlayerShip ? 'sunkLeft' : 'sunkRight');
      carrierStatusImg.classList.add(
        isPlayerShip ? 'sunkLeftImg' : 'sunkRightImg'
      );
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

  function findPlayerShipOnHit() {
    if (!aiMemory.chasing) return;

    let origin = aiMemory.origin;
    let direction = aiMemory.directions[aiMemory.directionIndex];

    let nextCoord = [
      String.fromCharCode(origin[0].charCodeAt(0) + direction[0]),
      origin[1] + direction[1],
    ];

    while (
      aiMemory.directionIndex < aiMemory.directions.length &&
      (!isValidCoord(nextCoord) ||
        player.gameboard.isAlreadyTried(nextCoord) ||
        bannedCoords.includes(nextCoord.join('')))
    ) {
      aiMemory.directionIndex++;
      aiMemory.origin = aiMemory.firstHit;

      if (aiMemory.directionIndex < aiMemory.directions.length) {
        direction = aiMemory.directions[aiMemory.directionIndex];
        origin = aiMemory.origin;
        nextCoord = [
          String.fromCharCode(origin[0].charCodeAt(0) + direction[0]),
          origin[1] + direction[1],
        ];
      }
    }

    if (aiMemory.directionIndex >= aiMemory.directions.length) {
      aiMemory.chasing = false;
      unlockAttackGrid();
      return;
    }

    const attackItems = compAttackItems(nextCoord);

    updateHitStatus({
      isPlayerShip: true,
      panel: 'leftPanel',
      cell: attackItems.child,
      result: attackItems.result,
      shipStatus: attackItems.shipStatusLeft,
      shipHits: attackItems.leftShipHits,
      turn: player,
    });

    if (attackItems.result.hit && !attackItems.result.shipSunk) {
      const hitDir = aiMemory.directions[aiMemory.directionIndex];
      const oppositeDir = [-hitDir[0], -hitDir[1]];

      const hasOpposite = aiMemory.directions.find(
        (dir) => dir[0] === oppositeDir[0] && dir[1] === oppositeDir[1]
      );

      if (hasOpposite) {
        aiMemory.directions = [hitDir, oppositeDir];
      } else {
        aiMemory.directions = [hitDir];
      }

      aiMemory.directionIndex = 0;
      aiMemory.origin = nextCoord;
      setTimeout(() => findPlayerShipOnHit(), 500);
    } else if (player.gameboard.isGameOver()) {
      lockAttackGrid();
      console.log('GAME OVER! AI wins');
    } else if (attackItems.result.shipSunk) {
      markSurroundingAsBanned(
        player.gameboard.shipCoordinates[attackItems.result.shipIndex]
      );
      aiMemory.chasing = false;
      setTimeout(() => {
        fireBonusRandomShot();
      }, 500);
    } else {
      aiMemory.directionIndex++;
      aiMemory.origin = aiMemory.firstHit;
      unlockAttackGrid();
    }
  }

  function isValidCoord(coord) {
    return (
      coord &&
      coord[0].charCodeAt(0) >= 65 &&
      coord[0].charCodeAt(0) <= 74 &&
      coord[1] >= 1 &&
      coord[1] <= 10
    );
  }

  function fireBonusRandomShot() {
    let coord = getNewRandomCoord();
    const attackItems = compAttackItems(coord);

    updateHitStatus({
      isPlayerShip: true,
      panel: 'leftPanel',
      cell: attackItems.child,
      result: attackItems.result,
      shipStatus: attackItems.shipStatusLeft,
      shipHits: attackItems.leftShipHits,
      turn: player,
    });

    if (player.gameboard.isGameOver()) {
      lockAttackGrid();
      console.log('GAME OVER! AI wins');
      return;
    }

    if (attackItems.result.hit && !attackItems.result.shipSunk) {
      const smartDirections = getValidChaseDirections(coord);
      aiMemory = {
        chasing: true,
        firstHit: coord,
        origin: coord,
        directionIndex: 0,
        directions: smartDirections,
      };
      setTimeout(() => {
        findPlayerShipOnHit();
      }, 500);
    } else if (attackItems.result.hit && attackItems.result.shipSunk) {
      markSurroundingAsBanned(
        player.gameboard.shipCoordinates[attackItems.result.shipIndex]
      );
      setTimeout(() => {
        fireBonusRandomShot();
      }, 500);
    } else {
      setTimeout(() => {
        unlockAttackGrid();
      }, 500);
    }
  }

  function markSurroundingAsBanned(coords) {
    const adjacents = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1],
    ];

    for (let coord of coords) {
      let [row, col] = coord;

      for (let [x, y] of adjacents) {
        const newRow = String.fromCharCode(row.charCodeAt(0) + x);
        const newCol = col + y;
        const newCoord = [newRow, newCol];

        if (
          isValidCoord(newCoord) &&
          !player.gameboard.isAlreadyTried(newCoord) &&
          !bannedCoords.includes(newCoord.join(''))
        ) {
          bannedCoords.push(newCoord.join(''));
        }
      }
    }
  }
};
