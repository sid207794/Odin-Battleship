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
  const shipPlacementPlayer = (function () {
    const player = new Player(false);
    player.gameboard.boardCoordinates();
    player.gameboard.shipPlacement();

    const shipCoordinates = player.gameboard.shipCoordinates.flat();
    const fleetCells = document.querySelectorAll('.fleetCell');

    for (let coord of shipCoordinates) {
      fleetCells.forEach((child) => {
        if (child.classList[0] === `${coord[0]}${coord[1]}`) {
          child.style.backgroundColor = 'white';
        }
      });
    }
  })();

  const shipPlacementComp = (function () {
    const computer = new Player(true);
    computer.gameboard.boardCoordinates();
    computer.gameboard.shipPlacement();

    const attackCells = document.querySelectorAll('.attackCell');
    const shipStatusRight = document.querySelectorAll(
      '.rightPanel .shipStatus .shipWrap'
    );

    for (let child of attackCells) {
      const cellCoord = [
        child.classList[0].charAt(0),
        Number(child.classList[0].slice(1)),
      ];

      child.addEventListener('click', () => {
        const result = computer.gameboard.receiveAttack(cellCoord);

        if (result.alreadyTried) {
          child.style.pointerEvents = 'none';
          return;
        }

        if (result.hit) {
          child.style.backgroundColor = 'red';
          child.style.pointerEvents = 'none';

          const coordStatusDiv = document.querySelectorAll(
            `.rightPanel .${shipStatusRight[result.shipIndex].classList[0]} .coordStatus div`
          );

          coordStatusDiv[
            computer.gameboard.allShipData[result.shipIndex].hits - 1
          ].style.backgroundColor = 'red';
        } else {
          child.style.backgroundColor = 'aqua';
          child.style.pointerEvents = 'none';
        }

        if (result.shipSunk) {
          const carrierStatus = document.querySelector(
            `.rightPanel .${shipStatusRight[result.shipIndex].classList[0]} .carrierStatus`
          );
          const carrierStatusImg = document.querySelector(
            `.rightPanel .${shipStatusRight[result.shipIndex].classList[0]} .carrierStatus img`
          );

          carrierStatus.classList.add('sunkRight');
          carrierStatusImg.classList.add('sunkRightImg');
        }

        if (computer.gameboard.isGameOver()) {
          console.log('GAME OVER!');
        }
      });
    }
  })();
})();
