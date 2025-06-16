import { Gameboard } from '../logic.js';

describe('Board Coordinates', () => {
  let newBoard;

  beforeEach(() => {
    newBoard = new Gameboard();
    newBoard.boardCoordinates();
  });

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
});

describe('Ship coordinate placement', () => {
  let newBoard;

  beforeEach(() => {
    newBoard = new Gameboard();
    newBoard.boardCoordinates();
    newBoard.shipPlacement();
  });

  test('There are 5 groups of coordinates.', () => {
    expect(newBoard.shipCoordinates.length).toBe(5);
  });

  test('There are 5 coordinates of CARRIER.', () => {
    expect(newBoard.shipCoordinates[0].length).toBe(5);
  });

  test('There are 4 coordinates of BATTLESHIP.', () => {
    expect(newBoard.shipCoordinates[1].length).toBe(4);
  });

  test('There are 3 coordinates of CRUISER.', () => {
    expect(newBoard.shipCoordinates[2].length).toBe(3);
  });

  test('There are 3 coordinates of SUBMARINE.', () => {
    expect(newBoard.shipCoordinates[3].length).toBe(3);
  });

  test('There are 2 coordinates of DESTROYER.', () => {
    expect(newBoard.shipCoordinates[4].length).toBe(2);
  });

  test('All ships have continuous coordinates.', () => {
    newBoard.shipCoordinates.forEach((shipCoords) => {
      const isHorizontal = shipCoords.every(
        (coord, i, arr) =>
          i === 0 ||
          (coord[0].charCodeAt(0) === arr[i - 1][0].charCodeAt(0) + 1 &&
            coord[1] === arr[i - 1][1])
      );

      const isVertical = shipCoords.every(
        (coord, i, arr) =>
          i === 0 ||
          (coord[0] === arr[i - 1][0] && coord[1] === arr[i - 1][1] + 1)
      );

      expect(isHorizontal || isVertical).toBeTruthy();
    });
  });

  test('All ships have correct data', () => {
    for (let i = 0; i < 5; i++) {
      expect(newBoard.allShipData[i]).toEqual({
        type: newBoard.shipTypes[i],
        length: newBoard.shipLengths[i],
        coordinates: newBoard.shipCoordinates[i],
        hits: 0,
      });
    }
  });
});
