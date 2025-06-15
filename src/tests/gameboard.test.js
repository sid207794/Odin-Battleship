import { Gameboard } from '../logic.js';

const newBoard = new Gameboard();
newBoard.boardCoordinates();

test('First co-ordinate is correct.', () => {
  expect(newBoard.coordinates[0]).toEqual(['A', 1]);
});

test('Tenth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[9]).toEqual(['A', 10]);
});

test('Twentieth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[19]).toEqual(['B', 10]);
});

test('Thirtieth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[29]).toEqual(['C', 10]);
});

test('Fourtieth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[39]).toEqual(['D', 10]);
});

test('Fiftieth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[49]).toEqual(['E', 10]);
});

test('Sixtieth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[59]).toEqual(['F', 10]);
});

test('Seventieth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[69]).toEqual(['G', 10]);
});

test('Eightieth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[79]).toEqual(['H', 10]);
});

test('Ninetieth co-ordinate is correct.', () => {
  expect(newBoard.coordinates[89]).toEqual(['I', 10]);
});

test('Last co-ordinate is correct.', () => {
  expect(newBoard.coordinates[99]).toEqual(['J', 10]);
});

test('There are 100 coordinates generated.', () => {
  expect(newBoard.coordinates.length).toBe(100);
});
