export class Ship {
  constructor(type, length, coordinates) {
    this.type = type;
    this.length = length;
    this.coordinates = coordinates;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits === this.length;
  }
}

export class Gameboard {
  constructor() {
    this.coordinates = [];
    this.shipTypes = [
      'CARRIER',
      'BATTLESHIP',
      'CRUISER',
      'SUBMARINE',
      'DESTROYER',
    ];
    this.shipLengths = [5, 4, 3, 3, 2];
    this.shipCoordinates = [];
  }

  boardCoordinates() {
    for (let i = 65; i <= 74; i++) {
      for (let j = 1; j <= 10; j++) {
        this.coordinates.push([String.fromCharCode(i), j]);
      }
    }
  }

  shipPlacement() {
    for (let i = 0; i < 5; i++) {
      const orientation = Math.floor(Math.random() * 2);
      const length = this.shipLengths[i];

      if (orientation === 0) {
        // Horizontal orientaion
        const shipCoord = [];

        let firstCoordinate = [
          String.fromCharCode(Math.floor(Math.random() * 10) + 65),
          Math.floor(Math.random() * 10) + 1,
        ];
        while (this.isValidPlacement(firstCoordinate, length)) {
          let firstCoordinate = [
            String.fromCharCode(Math.floor(Math.random() * 10) + 65),
            Math.floor(Math.random() * 10) + 1,
          ];
        }
      } else {
        // Vertical orientaion
        const shipCoord = [];
      }
    }
  }

  isValidPlacement(firstCoordinate, length) {
    return this.shipCoordinates.some(
      (item) =>
        item.contains(firstCoordinate) ||
        !this.coordinates.contains([
          String.fromCharCode(firstCoordinate[0].charCodeAt(0) + (length - 1)),
          firstCoordinate[1],
        ]) ||
        item.contains([
          // String.fromCharCode(
          //   firstCoordinate[0].charCodeAt(0) + (length - 1)
          // ),
        ])
    );
  }
}
