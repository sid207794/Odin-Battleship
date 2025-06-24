import { Gameboard, Player, Ship } from './logic.js';

const fleet = document.querySelector('.fleet');
const attackArea = document.querySelector('.attackArea');
const fleetScale = document.querySelector('.fleetScale');
const attackScale = document.querySelector('.attackScale');
const yScale = document.querySelector('.yScale .midScale');

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

  for (let i = 0; i < 10; i++) {
    const fleetScaleDdiv = document.createElement('div');
    fleetScaleDdiv.textContent = String.fromCharCode(65 + i);
    fleetScaleDdiv.classList.add(`${String.fromCharCode(65 + i)}`);
    fleetScaleDdiv.classList.add('fleetScaleCell');
    fleetScale.appendChild(fleetScaleDdiv);

    const attackScaleDdiv = document.createElement('div');
    attackScaleDdiv.textContent = String.fromCharCode(65 + i);
    attackScaleDdiv.classList.add(`${String.fromCharCode(65 + i)}`);
    attackScaleDdiv.classList.add('attackScaleCell');
    attackScale.appendChild(attackScaleDdiv);

    const yScaleDdiv = document.createElement('div');
    yScaleDdiv.textContent = i + 1;
    yScaleDdiv.classList.add(`yScale${i + 1}`);
    yScaleDdiv.classList.add('yScaleCell');
    yScale.appendChild(yScaleDdiv);
  }

  yScale.style.height = '25vw';
  yScale.style.width = '2vw';
};

export const playerVsComp = function () {
  let bannedCoords = [];

  const player = new Player(false);
  player.gameboard.boardCoordinates();
  player.gameboard.boardRowCoords();
  player.gameboard.boardColCoords();
  let shipCoordinates;
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

  function whiteWashShipCell() {
    shipCoordinates = player.gameboard.shipCoordinates.flat();

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
  }

  function showPlayerFleet() {
    player.gameboard.shipPlacement();
    whiteWashShipCell();
  }

  function customPlayerFleet() {
    const shipNames = player.gameboard.shipTypes;

    const endCoords = document.querySelector(
      '.playerData .coordDataWrapper .endCoord .viewBox'
    );
    const confirmButton = document.querySelector('.clearOrConfirm .confirm');
    const playButton = document.querySelector('.forfeit .start');

    let customShipCoordinates = [[], [], [], [], []];
    let customShipData = new Array(5).fill(null);

    let finalShipIndex = null;
    let finalXOrdinate = null;
    let finalYOrdinate = null;
    let finalOrientation = null;

    (function shipSelector() {
      const shipSelectLeft = document.querySelector(
        '.playerData .coordDataWrapper .shipSelect .leftScrollButton'
      );
      const shipSelectView = document.querySelector(
        '.playerData .coordDataWrapper .shipSelect .viewBox'
      );
      const shipSelectRight = document.querySelector(
        '.playerData .coordDataWrapper .shipSelect .rightScrollButton'
      );

      shipSelectView.textContent = 'SELECT SHIP';
      let index = 0;

      shipSelectRight.addEventListener('click', () => {
        shipSelectView.textContent = shipNames[index];
        finalShipIndex = index;
        if (index < 4) {
          index++;
        } else {
          index = 0;
        }
        previewPlacement();
      });

      shipSelectLeft.addEventListener('click', () => {
        if (index > 1) {
          index--;
        } else if (
          index === 1 ||
          (index === 0 && shipSelectView.textContent === 'SELECT SHIP')
        ) {
          index = 5;
        } else if (index === 0) {
          index = 4;
        }

        shipSelectView.textContent = shipNames[index - 1];
        finalShipIndex = index - 1;

        if (index === 5) index = 0;
        previewPlacement();
      });

      return finalShipIndex;
    })();

    (function xStartCoord() {
      const xStartCoordLeft = document.querySelector(
        '.playerData .coordDataWrapper .startCoord .xOrdinate .leftScrollButton'
      );
      const xStartCoordView = document.querySelector(
        '.playerData .coordDataWrapper .startCoord .xOrdinate .viewBox'
      );
      const xStartCoordRight = document.querySelector(
        '.playerData .coordDataWrapper .startCoord .xOrdinate .rightScrollButton'
      );

      xStartCoordView.textContent = 'X';
      let charCode = 65;

      xStartCoordRight.addEventListener('click', () => {
        xStartCoordView.textContent = String.fromCharCode([charCode]);
        finalXOrdinate = String.fromCharCode([charCode]);
        if (charCode < 74) {
          charCode++;
        } else {
          charCode = 65;
        }
        previewPlacement();
      });

      xStartCoordLeft.addEventListener('click', () => {
        if (charCode > 66) {
          charCode--;
        } else if (
          charCode === 66 ||
          (charCode === 65 && xStartCoordView.textContent === 'X')
        ) {
          charCode = 75;
        } else if (charCode === 65) {
          charCode = 74;
        }

        xStartCoordView.textContent = String.fromCharCode([charCode - 1]);
        finalXOrdinate = String.fromCharCode([charCode - 1]);

        if (charCode === 75) charCode = 65;
        previewPlacement();
      });

      return finalXOrdinate;
    })();

    (function yStartCoord() {
      const yStartCoordLeft = document.querySelector(
        '.playerData .coordDataWrapper .startCoord .yOrdinate .leftScrollButton'
      );
      const yStartCoordView = document.querySelector(
        '.playerData .coordDataWrapper .startCoord .yOrdinate .viewBox'
      );
      const yStartCoordRight = document.querySelector(
        '.playerData .coordDataWrapper .startCoord .yOrdinate .rightScrollButton'
      );

      yStartCoordView.textContent = 'Y';
      let num = 1;

      yStartCoordRight.addEventListener('click', () => {
        yStartCoordView.textContent = num;
        finalYOrdinate = num;
        if (num < 10) {
          num++;
        } else {
          num = 1;
        }
        previewPlacement();
      });

      yStartCoordLeft.addEventListener('click', () => {
        if (num > 2) {
          num--;
        } else if (
          num === 2 ||
          (num === 1 && yStartCoordView.textContent === 'Y')
        ) {
          num = 11;
        } else if (num === 1) {
          num = 10;
        }

        yStartCoordView.textContent = num - 1;
        finalYOrdinate = num - 1;

        if (num === 11) num = 1;
        previewPlacement();
      });

      return finalYOrdinate;
    })();

    (function orientation() {
      const orientationLeft = document.querySelector(
        '.playerData .coordDataWrapper .orientation .leftScrollButton'
      );
      const orientationView = document.querySelector(
        '.playerData .coordDataWrapper .orientation .viewBox'
      );
      const orientationRight = document.querySelector(
        '.playerData .coordDataWrapper .orientation .rightScrollButton'
      );

      orientationView.textContent = 'ORIENTATION';
      let orientationArray = ['HORIZONTAL', 'VERTICAL'];
      let index = 0;

      orientationRight.addEventListener('click', () => {
        orientationView.textContent = orientationArray[index];
        finalOrientation = index;
        if (index === 0) {
          index++;
        } else {
          index = 0;
        }
        previewPlacement();
      });

      orientationLeft.addEventListener('click', () => {
        if (
          index === 1 ||
          (index === 0 && orientationView.textContent === 'ORIENTATION')
        ) {
          index = 2;
        } else if (index === 0) {
          index = 1;
        }

        orientationView.textContent = orientationArray[index - 1];
        finalOrientation = index - 1;

        if (index === 2) index = 0;
        previewPlacement();
      });

      return finalOrientation;
    })();

    function previewPlacement() {
      if (
        finalShipIndex === null ||
        finalXOrdinate === null ||
        finalYOrdinate === null ||
        finalOrientation === null
      )
        return;

      let isInvalidCustomPlacement = player.gameboard.isInvalidPlacement(
        [finalXOrdinate, finalYOrdinate],
        player.gameboard.shipLengths[finalShipIndex],
        finalOrientation
      );

      for (let child of fleetCells) {
        child.style.backgroundColor = 'rgb(0, 140, 255)';
      }

      whiteWashShipCell();

      if (!isInvalidCustomPlacement) {
        confirmButton.style.backgroundColor = 'lime';
        confirmButton.style.color = 'black';
        confirmButton.style.borderColor = 'green';
        confirmButton.style.pointerEvents = 'auto';

        if (finalOrientation === 0) {
          const horizontalArray = horizontalCoords();
          endCoords.classList.remove('invalidCoords');
          endCoords.textContent = `${horizontalArray[horizontalArray.length - 1]}`;
          highlightCells(horizontalArray, 'lime');
        } else {
          const verticalArray = verticalCoords();
          endCoords.classList.remove('invalidCoords');
          endCoords.textContent = `${verticalArray[verticalArray.length - 1]}`;
          highlightCells(verticalArray, 'lime');
        }
      } else {
        confirmButton.style.backgroundColor = 'red';
        confirmButton.style.color = 'white';
        confirmButton.style.borderColor = 'maroon';
        confirmButton.style.pointerEvents = 'none';

        if (finalOrientation === 0) {
          const rawHorizontalArray = horizontalCoords();
          endCoords.textContent = `${rawHorizontalArray[rawHorizontalArray.length - 1]}`;
          endCoords.classList.add('invalidCoords');
          const horizontalArray = rawHorizontalArray.filter((coord) =>
            isValidCoord(coord)
          );
          highlightCells(horizontalArray, 'red');
        } else {
          const rawVerticalArray = verticalCoords();
          endCoords.textContent = `${rawVerticalArray[rawVerticalArray.length - 1]}`;
          endCoords.classList.add('invalidCoords');
          const verticalArray = rawVerticalArray.filter((coord) =>
            isValidCoord(coord)
          );
          highlightCells(verticalArray, 'red');
        }
      }

      function horizontalCoords() {
        const horCoords = player.gameboard.getHorizontalCoords(
          [finalXOrdinate, finalYOrdinate],
          player.gameboard.shipLengths[finalShipIndex]
        );
        return horCoords;
      }

      function verticalCoords() {
        const verCoords = player.gameboard.getVerticalCoords(
          [finalXOrdinate, finalYOrdinate],
          player.gameboard.shipLengths[finalShipIndex]
        );
        return verCoords;
      }

      function highlightCells(array, color) {
        for (let i = 0; i < array.length; i++) {
          const cellCoord = document.querySelector(
            `.fleetGrid .${array[i].join('')}`
          );
          cellCoord.style.backgroundColor = color;
        }
      }

      return { horizontalCoords, verticalCoords };
    }

    (function confirmSelection() {
      confirmButton.addEventListener('click', () => {
        const previewFunction = previewPlacement();
        const isInvalid = player.gameboard.isInvalidPlacement(
          [finalXOrdinate, finalYOrdinate],
          player.gameboard.shipLengths[finalShipIndex],
          finalOrientation
        );

        if (!isInvalid) {
          if (finalOrientation === 0) {
            customShipCoordinates[finalShipIndex] =
              previewFunction.horizontalCoords();
          } else {
            customShipCoordinates[finalShipIndex] =
              previewFunction.verticalCoords();
          }
        }

        player.gameboard.shipCoordinates = customShipCoordinates;

        const newShip = new Ship(
          player.gameboard.shipTypes[finalShipIndex],
          player.gameboard.shipLengths[finalShipIndex],
          player.gameboard.shipCoordinates[finalShipIndex]
        );

        customShipData[finalShipIndex] = newShip;
        player.gameboard.allShipData = customShipData;

        for (let child of fleetCells) {
          child.style.backgroundColor = 'rgb(0, 140, 255)';
        }

        whiteWashShipCell();

        if (
          player.gameboard.allShipData.length !== 0 &&
          player.gameboard.allShipData.every((item) => item !== null)
        ) {
          playButton.style.backgroundColor = 'lime';
          playButton.style.color = 'black';
          playButton.style.borderColor = 'green';
          playButton.style.pointerEvents = 'auto';
        }
        console.log('shipCoordinates', player.gameboard.shipCoordinates);
        console.log('allShipData', player.gameboard.allShipData);
      });
    })();
  }

  function enablePlayerAttack() {
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
  }

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

  return { showPlayerFleet, customPlayerFleet, enablePlayerAttack };
};
