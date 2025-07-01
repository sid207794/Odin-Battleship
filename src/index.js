import './style.css';
import {
  gameModeSelect,
  fleetPlacementOptions,
  createGrid,
  playerVsComp,
  createCustomButtons,
  scoreboard,
} from './dom.js';

let currentTyping = false;

export function typewriterEffect(text, element) {
  if (currentTyping) clearInterval(currentTyping);
  let index = 0;
  element.innerHTML = '';

  currentTyping = setInterval(() => {
    let visibleText = text.slice(0, index);
    visibleText = visibleText.replace(/\n/g, '<br>');
    element.innerHTML = visibleText + '_';
    index++;

    if (index > text.length) {
      clearInterval(currentTyping);
      currentTyping = false;
    }
  }, 25);
}

(function gameStartingEventListeners() {
  const aiOption = document.querySelector('.fleetOption .option1 .button1');
  const playerOption = document.querySelector('.fleetOption .option2 .button2');
  const scores = document.querySelector('.playerData .scores');
  const leftReport = document.querySelector(
    '.videoResponse .matchHistory .leftReport'
  );
  const leftOutcome = document.querySelector(
    '.videoResponse .matchOutcome .leftOutcome'
  );
  const rightOutcome = document.querySelector(
    '.videoResponse .matchOutcome .rightOutcome'
  );
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

  aiOption.addEventListener('mouseenter', () => {
    typewriterEffect(
      `MODE: SINGLE PLAYER\n` +
        `Engage an adaptive enemy in strategic naval warfare.\n` +
        `Deploy your fleet. Scout the unknown. Eliminate threats.\n` +
        `Your wits are the only thing between victory and a watery grave.`,
      leftReport
    );
  });

  playerOption.addEventListener('mouseenter', () => {
    // typewriterEffect(
    //   `MODE: LOCAL MULTIPLAYER\n` +
    //     `Two commanders. One battlefield.\n` +
    //     `Alternate turns. Place your ships. Outsmart your rival.\n` +
    //     `Trust no one. There are no friends at sea.`,
    //   leftReport
    // );
    typewriterEffect(
      `COMING SOON\n
      STAY TUNED!`,
      leftReport
    );
  });

  aiOption.addEventListener('click', () => {
    fleetPlacementOptions();
    const randomized = document.querySelector('.fleetOption .option1 .button1');
    const customCoords = document.querySelector(
      '.fleetOption .option2 .button2'
    );

    let showFleet;

    randomized.addEventListener('mouseenter', () => {
      typewriterEffect(
        `MODE: RANDOMIZED PLACEMENT\n` +
          `Fleet coordinates scrambled via command protocol.\n` +
          `Ships deployed instantly across the grid.\n` +
          `Strategic placement: automated. Let chaos guide your tactics.`,
        leftReport
      );
    });

    randomized.addEventListener('click', () => {
      shipStatus.forEach((side) => side.classList.add('visibleWrap'));
      playButton.classList.remove('visibleWrap');
      scores.classList.add('visibleWrap');
      createGrid();
      scoreboard();
      showFleet = playerVsComp();
      showFleet.showPlayerFleet();
      showFleet.enablePlayerAttack();
      playButton.style.pointerEvents = 'none';
      stopButton.style.pointerEvents = 'auto';
      stopButton.classList.add('visibleWrap');

      let hasForfeit = false;
      stopButton.addEventListener('click', () => {
        if (!hasForfeit) {
          showFleet.lockAttackGrid();
          showFleet.aiWinsDisplay();
          stopButton.textContent = 'RETRY';
          hasForfeit = true;
        } else {
          hasForfeit = false;
          typewriterEffect(
            `MODE: RANDOMIZED PLACEMENT\n` +
              `Fleet coordinates scrambled via command protocol.\n` +
              `Ships deployed instantly across the grid.\n` +
              `Strategic placement: automated. Let chaos guide your tactics.`,
            leftReport
          );
          stopButton.textContent = 'FORFEIT';
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
          leftOutcome.textContent = '';
          rightOutcome.textContent = '';
          createGrid();
          scoreboard();
          showFleet = playerVsComp();
          showFleet.showPlayerFleet();
          showFleet.enablePlayerAttack();
        }
      });
    });

    customCoords.addEventListener('mouseenter', () => {
      typewriterEffect(
        `MODE: MANUAL FLEET SETUP\n` +
          `Awaiting input...\n` +
          `Position each vessel with surgical precision.\n` +
          `Victory is forged before the first shot is fired.`,
        leftReport
      );
    });

    customCoords.addEventListener('click', () => {
      coordDataWrapper.classList.add('visibleWrap');
      shipStatus.forEach((side) => side.classList.add('visibleWrap'));
      playButton.classList.add('visibleWrap');
      createGrid();
      attackArea.style.pointerEvents = 'none';
      scoreboard();
      showFleet = playerVsComp();
      showFleet.customPlayerFleet();

      playButton.addEventListener('click', () => {
        playButton.style.pointerEvents = 'none';
        coordDataWrapper.classList.remove('visibleWrap');
        scores.classList.add('visibleWrap');
        playButton.classList.remove('visibleWrap');
        stopButton.classList.add('visibleWrap');
        stopButton.style.pointerEvents = 'auto';
        attackArea.style.pointerEvents = 'auto';
        showFleet.whiteWashShipCell();
        showFleet.enablePlayerAttack();
      });

      let hasForfeit = false;
      stopButton.addEventListener('click', () => {
        if (!hasForfeit) {
          showFleet.lockAttackGrid();
          showFleet.aiWinsDisplay();
          stopButton.textContent = 'RETRY';
          hasForfeit = true;
        } else {
          hasForfeit = false;
          typewriterEffect(
            `MODE: MANUAL FLEET SETUP\n` +
              `Awaiting input...\n` +
              `Position each vessel with surgical precision.\n` +
              `Victory is forged before the first shot is fired.`,
            leftReport
          );
          stopButton.textContent = 'FORFEIT';
          stopButton.style.pointerEvents = 'none';
          coordDataWrapper.classList.add('visibleWrap');
          scores.classList.remove('visibleWrap');
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
          leftOutcome.textContent = '';
          rightOutcome.textContent = '';
          createGrid();
          attackArea.style.pointerEvents = 'none';
          scoreboard();
          showFleet = playerVsComp();
          showFleet.resetShipData();
          showFleet.customPlayerFleet();
        }
      });
    });
  });

  playerOption.addEventListener('click', () => {
    // fleetPlacementOptions();
  });
})();
