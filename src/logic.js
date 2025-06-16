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
    this.allShipData = [];
    this.allHits = [];
    this.allMisses = [];
    this.sinkStatus = new Array(5).fill(false);
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

      let firstCoordinate = [
        String.fromCharCode(Math.floor(Math.random() * 10) + 65),
        Math.floor(Math.random() * 10) + 1,
      ];

      while (this.isInvalidPlacement(firstCoordinate, length, orientation)) {
        firstCoordinate = [
          String.fromCharCode(Math.floor(Math.random() * 10) + 65),
          Math.floor(Math.random() * 10) + 1,
        ];
      }

      if (orientation === 0) {
        // Horizontal orientation
        this.shipCoordinates.push(
          this.getHorizontalCoords(firstCoordinate, length)
        );
      } else {
        // Vertical orientation
        this.shipCoordinates.push(
          this.getVerticalCoords(firstCoordinate, length)
        );
      }

      const newShip = new Ship(
        this.shipTypes[i],
        this.shipLengths[i],
        this.shipCoordinates[i]
      );

      this.allShipData.push(newShip);
    }
  }

  isInvalidPlacement(firstCoordinate, length, orientation) {
    if (orientation === 0) {
      // Horizontal orientation
      const checkLength = this.coordinates.some(
        (coord) =>
          coord[0] ===
            String.fromCharCode(
              firstCoordinate[0].charCodeAt(0) + (length - 1)
            ) && coord[1] === firstCoordinate[1]
      );

      if (!checkLength) return true;

      for (let i = 0; i < length; i++) {
        const xOrdinate = String.fromCharCode(
          firstCoordinate[0].charCodeAt(0) + i
        );
        const checkCoordinateLong = this.shipCoordinates.some((item) =>
          item.some(
            (coord) =>
              (coord[0] === xOrdinate && coord[1] === firstCoordinate[1]) ||
              (coord[0] === xOrdinate && coord[1] === firstCoordinate[1] - 1) ||
              (coord[0] === xOrdinate && coord[1] === firstCoordinate[1] + 1)
          )
        );

        if (checkCoordinateLong) return true;
      }

      for (let j = 0; j < 3; j++) {
        const checkCoordinateShort = this.shipCoordinates.some((item) =>
          item.some(
            (coord) =>
              (coord[0] ===
                String.fromCharCode(firstCoordinate[0].charCodeAt(0) - 1) &&
                coord[1] === firstCoordinate[1] - 1 + j) ||
              (coord[0] ===
                String.fromCharCode(
                  firstCoordinate[0].charCodeAt(0) + length
                ) &&
                coord[1] === firstCoordinate[1] - 1 + j)
          )
        );

        if (checkCoordinateShort) return true;
      }

      return false;
    } else {
      // Vertical orientation
      const checkLength = this.coordinates.some(
        (coord) =>
          coord[0] === firstCoordinate[0] &&
          coord[1] === firstCoordinate[1] + (length - 1)
      );

      if (!checkLength) return true;

      for (let i = 0; i < length; i++) {
        const checkCoordinateLong = this.shipCoordinates.some((item) =>
          item.some(
            (coord) =>
              (coord[0] === firstCoordinate[0] &&
                coord[1] === firstCoordinate[1] + i) ||
              (coord[0] ===
                String.fromCharCode(firstCoordinate[0].charCodeAt(0) - 1) &&
                coord[1] === firstCoordinate[1] + i) ||
              (coord[0] ===
                String.fromCharCode(firstCoordinate[0].charCodeAt(0) + 1) &&
                coord[1] === firstCoordinate[1] + i)
          )
        );

        if (checkCoordinateLong) return true;
      }

      for (let j = 0; j < 3; j++) {
        const checkCoordinateShort = this.shipCoordinates.some((item) =>
          item.some(
            (coord) =>
              (coord[0] ===
                String.fromCharCode(firstCoordinate[0].charCodeAt(0) - 1 + j) &&
                coord[1] === firstCoordinate[1] - 1) ||
              (coord[0] ===
                String.fromCharCode(firstCoordinate[0].charCodeAt(0) - 1 + j) &&
                coord[1] === firstCoordinate[1] + length)
          )
        );

        if (checkCoordinateShort) return true;
      }

      return false;
    }
  }

  getHorizontalCoords(firstCoordinate, length) {
    const shipCoord = [];
    for (let j = 0; j < length; j++) {
      shipCoord.push([
        String.fromCharCode(firstCoordinate[0].charCodeAt(0) + j),
        firstCoordinate[1],
      ]);
    }
    return shipCoord;
  }

  getVerticalCoords(firstCoordinate, length) {
    const shipCoord = [];
    for (let j = 0; j < length; j++) {
      shipCoord.push([firstCoordinate[0], firstCoordinate[1] + j]);
    }
    return shipCoord;
  }

  receiveAttack(attackCoord) {
    const hitReceived = this.shipCoordinates.some((ship) =>
      ship.some((coord) => this.isSameCoord(coord, attackCoord))
    );

    const alreadyHit = this.allHits.some((hitCoord) =>
      this.isSameCoord(hitCoord, attackCoord)
    );

    const alreadyMissed = this.allMisses.some((missedCoord) =>
      this.isSameCoord(missedCoord, attackCoord)
    );

    if (hitReceived && !alreadyHit) {
      const damagedShipIndex = this.shipCoordinates.findIndex((ship) =>
        ship.some((coord) => this.isSameCoord(coord, attackCoord))
      );

      this.allShipData[damagedShipIndex].hit();
      const hasSunk = this.allShipData[damagedShipIndex].isSunk();
      if (hasSunk) this.sinkStatus[damagedShipIndex] = true;

      this.allHits.push(attackCoord);
    } else if (!hitReceived && !alreadyMissed) {
      this.allMisses.push(attackCoord);
    }
  }

  isSameCoord(coord1, coord2) {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
  }
}
