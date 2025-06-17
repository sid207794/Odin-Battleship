const createGrid = (function () {
  const fleetGrid = document.querySelector('.fleetGrid');
  const attackGrid = document.querySelector('.attackGrid');

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const fleeDdiv = document.createElement('div');
      fleeDdiv.classList.add(`${String.fromCharCode(65 + i)}${j + 1}`);
      fleeDdiv.classList.add('fleetCell');
      fleetGrid.appendChild(fleeDdiv);

      const attackDiv = document.createElement('div');
      attackDiv.classList.add(`${String.fromCharCode(65 + i)}${j + 1}`);
      attackDiv.classList.add('attackCell');
      attackGrid.appendChild(attackDiv);
    }
  }
})();
