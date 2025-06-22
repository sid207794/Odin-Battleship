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

  aiOption.addEventListener('click', () => {
    fleetPlacementOptions();

    const randomized = document.querySelector('.fleetOption .option1 .button1');
    const customCoords = document.querySelector(
      '.fleetOption .option2 .button2'
    );
    const manualMove = document.querySelector('.fleetOption .option3 .button3');

    randomized.addEventListener('click', () => {
      createGrid();
      playerVsComp();
    });
    customCoords.addEventListener('click', () => {});
    manualMove.addEventListener('click', () => {});
  });

  playerOption.addEventListener('click', () => {
    fleetPlacementOptions();
  });
})();
