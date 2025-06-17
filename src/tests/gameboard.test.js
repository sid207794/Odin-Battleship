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

describe('Logging attack coordinates and their result.', () => {
  let newBoard;

  beforeEach(() => {
    newBoard = new Gameboard();
    newBoard.boardCoordinates();
    newBoard.shipPlacement();
  });

  test('Attack was missed and no other ship was found in the vicinity', () => {
    for (let j = 0; j < 5; j++) {
      const ship = newBoard.shipCoordinates[j];
      const coordinatesArr = newBoard.coordinates;

      const isHorizontal = ship.every(
        (coord, i, arr) =>
          i === 0 ||
          (coord[0].charCodeAt(0) === arr[i - 1][0].charCodeAt(0) + 1 &&
            coord[1] === arr[i - 1][1])
      );

      const isVertical = ship.every(
        (coord, i, arr) =>
          i === 0 ||
          (coord[0] === arr[i - 1][0] && coord[1] === arr[i - 1][1] + 1)
      );

      const isValidTopCoord = coordinatesArr.some(
        (coords) => coords[0] === ship[0][0] && coords[1] === ship[0][1] - 1
      );

      const isValidLeftCoord = coordinatesArr.some(
        (coords) =>
          coords[0].charCodeAt(0) === ship[0][0].charCodeAt(0) - 1 &&
          coords[1] === ship[0][1]
      );

      newBoard.receivedAttacks.length = 0;
      newBoard.allHits.length = 0;
      newBoard.allMisses.length = 0;
      newBoard.sinkStatus = [false, false, false, false, false];

      if (isHorizontal) {
        if (isValidTopCoord) {
          for (let k = 0; k < ship.length - 1; k++) {
            newBoard.receiveAttack([ship[k][0], ship[k][1] - 1]);
          }
          expect(
            newBoard.receiveAttack([
              ship[ship.length - 1][0],
              ship[ship.length - 1][1] - 1,
            ])
          ).toEqual({
            hit: false,
            miss: true,
            alreadyTried: false,
            shipSunk: false,
            shipType: null,
            shipIndex: null,
          });
          expect(newBoard.receivedAttacks.length).toBe(ship.length);
          expect(newBoard.allHits.length).toBe(0);
          expect(newBoard.allMisses.length).toBe(ship.length);
          expect(newBoard.sinkStatus).toEqual([
            false,
            false,
            false,
            false,
            false,
          ]);
        } else {
          for (let k = 0; k < ship.length - 1; k++) {
            newBoard.receiveAttack([ship[k][0], ship[k][1] + 1]);
          }
          expect(
            newBoard.receiveAttack([
              ship[ship.length - 1][0],
              ship[ship.length - 1][1] + 1,
            ])
          ).toEqual({
            hit: false,
            miss: true,
            alreadyTried: false,
            shipSunk: false,
            shipType: null,
            shipIndex: null,
          });
          expect(newBoard.receivedAttacks.length).toBe(ship.length);
          expect(newBoard.allHits.length).toBe(0);
          expect(newBoard.allMisses.length).toBe(ship.length);
          expect(newBoard.sinkStatus).toEqual([
            false,
            false,
            false,
            false,
            false,
          ]);
        }
      } else if (isVertical) {
        if (isValidLeftCoord) {
          newBoard.receiveAttack([
            ship[0][0].charCodeAt(0) - 1,
            ship[0][1] + 1,
          ]);
          newBoard.receiveAttack([
            ship[0][0].charCodeAt(0) - 1,
            ship[0][1] - 1,
          ]);
          expect(
            newBoard.receiveAttack([ship[0][0].charCodeAt(0) - 1, ship[0][1]])
          ).toEqual({
            hit: false,
            miss: true,
            alreadyTried: false,
            shipSunk: false,
            shipType: null,
            shipIndex: null,
          });
          expect(newBoard.receivedAttacks.length).toBe(3);
          expect(newBoard.allHits.length).toBe(0);
          expect(newBoard.allMisses.length).toBe(3);
          expect(newBoard.sinkStatus).toEqual([
            false,
            false,
            false,
            false,
            false,
          ]);
        } else {
          newBoard.receiveAttack([
            ship[ship.length - 1][0].charCodeAt(0) + 1,
            ship[ship.length - 1][1] + 1,
          ]);
          newBoard.receiveAttack([
            ship[ship.length - 1][0].charCodeAt(0) + 1,
            ship[ship.length - 1][1] - 1,
          ]);
          expect(
            newBoard.receiveAttack([
              ship[ship.length - 1][0].charCodeAt(0) + 1,
              ship[ship.length - 1][1],
            ])
          ).toEqual({
            hit: false,
            miss: true,
            alreadyTried: false,
            shipSunk: false,
            shipType: null,
            shipIndex: null,
          });
          expect(newBoard.receivedAttacks.length).toBe(3);
          expect(newBoard.allHits.length).toBe(0);
          expect(newBoard.allMisses.length).toBe(3);
          expect(newBoard.sinkStatus).toEqual([
            false,
            false,
            false,
            false,
            false,
          ]);
        }
      }
    }
  });

  test('Attack was aborted as the coordinate for each ship is already hit.', () => {
    for (let i = 0; i < 5; i++) {
      const ship = newBoard.shipCoordinates[i];

      newBoard.receivedAttacks.length = 0;
      newBoard.allHits.length = 0;
      newBoard.allMisses.length = 0;
      newBoard.sinkStatus = [false, false, false, false, false];

      newBoard.receiveAttack(ship[0]);
      expect(newBoard.receiveAttack(ship[0])).toEqual({
        hit: false,
        miss: false,
        alreadyTried: true,
        shipSunk: false,
        shipType: null,
        shipIndex: null,
      });

      expect(newBoard.receivedAttacks.length).toBe(2);
      expect(newBoard.allHits.length).toBe(1);
      expect(newBoard.allMisses.length).toBe(0);
      expect(newBoard.sinkStatus).toEqual([false, false, false, false, false]);
    }
  });

  test('Attack was aborted as the coordinate in the ocean is already missed.', () => {
    const shipArr = newBoard.shipCoordinates.flat();
    const oceanIndex = newBoard.coordinates.findIndex(
      (coord) =>
        !shipArr.some(
          (shipCoord) => coord[0] === shipCoord[0] && coord[1] === shipCoord[1]
        )
    );

    newBoard.receivedAttacks.length = 0;
    newBoard.allHits.length = 0;
    newBoard.allMisses.length = 0;
    newBoard.sinkStatus = [false, false, false, false, false];

    newBoard.receiveAttack(newBoard.coordinates[oceanIndex]);
    expect(newBoard.receiveAttack(newBoard.coordinates[oceanIndex])).toEqual({
      hit: false,
      miss: false,
      alreadyTried: true,
      shipSunk: false,
      shipType: null,
      shipIndex: null,
    });

    expect(newBoard.receivedAttacks.length).toBe(2);
    expect(newBoard.allHits.length).toBe(0);
    expect(newBoard.allMisses.length).toBe(1);
    expect(newBoard.sinkStatus).toEqual([false, false, false, false, false]);
  });

  test('All ships sink once all their coordinates are hit.', () => {
    for (let i = 0; i < 5; i++) {
      const ship = newBoard.shipCoordinates[i];

      newBoard.receivedAttacks.length = 0;
      newBoard.allHits.length = 0;
      newBoard.allMisses.length = 0;
      newBoard.sinkStatus = [false, false, false, false, false];

      for (let j = 0; j < ship.length - 1; j++) {
        newBoard.receiveAttack(ship[j]);
      }

      expect(newBoard.receiveAttack(ship[ship.length - 1])).toEqual({
        hit: true,
        miss: false,
        alreadyTried: false,
        shipSunk: true,
        shipType: newBoard.allShipData[i].type,
        shipIndex: i,
      });

      expect(newBoard.receivedAttacks.length).toBe(ship.length);
      expect(newBoard.allHits.length).toBe(ship.length);
      expect(newBoard.allMisses.length).toBe(0);
      expect(newBoard.sinkStatus[i]).toBe(true);
      expect(newBoard.isGameOver()).toBeFalsy();
    }
  });

  test('Game is over once all ships sink.', () => {
    for (let i = 0; i < 5; i++) {
      const ship = newBoard.shipCoordinates[i];

      for (let j = 0; j < ship.length; j++) {
        newBoard.receiveAttack(ship[j]);
      }
    }

    expect(newBoard.sinkStatus).toEqual([true, true, true, true, true]);
    expect(newBoard.isGameOver()).toBeTruthy();
  });
});
