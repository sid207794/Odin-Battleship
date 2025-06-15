import { Ship } from '../logic.js';

let newShip;

beforeEach(() => {
  newShip = new Ship(5);
});

test('Ship was hit 3 times but did not sink!', () => {
  newShip.hit();
  newShip.hit();
  newShip.hit();
  expect(newShip.isSunk()).toBeFalsy();
});

test('Ship was hit 5 times and it sank!', () => {
  newShip.hit();
  newShip.hit();
  newShip.hit();
  newShip.hit();
  newShip.hit();
  expect(newShip.isSunk()).toBeTruthy();
});
