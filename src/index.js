import './style.css';
import {
  gameModeSelect,
  fleetPlacementOptions,
  createGrid,
  playerVsComp,
  createCustomButtons,
} from './dom.js';

(function gameStartingEventListeners() {
  const aiOption = document.querySelector('.fleetOption .option1 .button1');
  const playerOption = document.querySelector('.fleetOption .option2 .button2');
  const coordDataWrapper = document.querySelector(
    '.playerData .coordDataWrapper'
  );
  const attackArea = document.querySelector('.attackArea');
  const shipStatus = document.querySelectorAll('.shipStatus');
  const shipWrapsLeft = document.querySelectorAll('.leftPanel .shipWrap');
  const shipWrapsRight = document.querySelectorAll('.rightPanel .shipWrap');
  const coordStatus = document.querySelectorAll('.coordStatus');
  const playButton = document.querySelector('.forfeit .start');
  const stopButton = document.querySelector('.forfeit .stop');

  aiOption.addEventListener('click', () => {
    fleetPlacementOptions();
    const randomized = document.querySelector('.fleetOption .option1 .button1');
    const customCoords = document.querySelector(
      '.fleetOption .option2 .button2'
    );
    let showFleet;

    randomized.addEventListener('click', () => {
      shipStatus.forEach((side) => side.classList.add('visibleWrap'));
      playButton.classList.remove('visibleWrap');
      createGrid();
      showFleet = playerVsComp();
      showFleet.showPlayerFleet();
      showFleet.enablePlayerAttack();
    });

    customCoords.addEventListener('click', () => {
      coordDataWrapper.classList.add('visibleWrap');
      shipStatus.forEach((side) => side.classList.add('visibleWrap'));
      playButton.classList.add('visibleWrap');
      createGrid();
      attackArea.style.pointerEvents = 'none';
      showFleet = playerVsComp();
      showFleet.customPlayerFleet();
    });

    playButton.addEventListener('click', () => {
      playButton.style.pointerEvents = 'none';
      coordDataWrapper.classList.remove('visibleWrap');
      playButton.classList.remove('visibleWrap');
      stopButton.classList.add('visibleWrap');
      stopButton.style.pointerEvents = 'auto';
      attackArea.style.pointerEvents = 'auto';
      showFleet.whiteWashShipCell();
      showFleet.enablePlayerAttack();
    });

    stopButton.addEventListener('click', () => {
      stopButton.style.pointerEvents = 'none';
      coordDataWrapper.classList.add('visibleWrap');
      stopButton.classList.remove('visibleWrap');
      playButton.classList.add('visibleWrap');
      playButton.style.backgroundColor = 'red';
      playButton.style.color = 'white';
      playButton.style.borderColor = 'maroon';
      shipWrapsLeft.forEach((shipWrap) => {
        shipWrap.children[1].classList.remove('sunkLeft');
        shipWrap.children[1].children[0].classList.remove('sunkLeftImg');
      });
      shipWrapsRight.forEach((shipWrap) => {
        shipWrap.children[0].classList.remove('sunkRight');
        shipWrap.children[0].children[0].classList.remove('sunkRightImg');
      });
      coordStatus.forEach((shipHealth) =>
        Array.from(shipHealth.children).forEach(
          (child) => (child.style.backgroundColor = 'white')
        )
      );
      createGrid();
      attackArea.style.pointerEvents = 'none';
      showFleet = playerVsComp();
      showFleet.resetShipData();
      showFleet.customPlayerFleet();
    });
  });

  playerOption.addEventListener('click', () => {
    fleetPlacementOptions();
  });
})();
