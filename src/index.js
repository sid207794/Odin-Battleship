import './style.css';
import {
  gameModeSelect,
  fleetPlacementOptions,
  createGrid,
  playerVsComp,
} from './dom.js';

(function gameStartingEventListeners() {
  const aiOption = document.querySelector('.fleetOption .option1 .button1');
  const playerOption = document.querySelector('.fleetOption .option2 .button2');
  const coordDataWrapper = document.querySelector(
    '.playerData .coordDataWrapper'
  );
  const playButton = document.querySelector('.forfeit .start');

  aiOption.addEventListener('click', () => {
    fleetPlacementOptions();
    const randomized = document.querySelector('.fleetOption .option1 .button1');
    const customCoords = document.querySelector(
      '.fleetOption .option2 .button2'
    );
    const manualMove = document.querySelector('.fleetOption .option3 .button3');

    randomized.addEventListener('click', () => {
      playButton.classList.remove('visibleWrap');
      createGrid();
      const showFleet = playerVsComp();
      showFleet.showPlayerFleet();
      showFleet.enablePlayerAttack();
    });

    customCoords.addEventListener('click', () => {
      createGrid();
      coordDataWrapper.classList.add('visibleWrap');
      playButton.classList.add('visibleWrap');
      const showFleet = playerVsComp();
      showFleet.customPlayerFleet();

      playButton.addEventListener('click', () => {
        playButton.style.pointerEvents = 'none';
        coordDataWrapper.classList.remove('visibleWrap');
        showFleet.enablePlayerAttack();
      });
    });

    manualMove.addEventListener('click', () => {});
  });

  playerOption.addEventListener('click', () => {
    fleetPlacementOptions();
  });
})();
