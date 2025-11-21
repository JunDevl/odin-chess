import { Queue } from "./queue";

const maxBoardWidth = 7;

class ChessSquare {
  static discoveredSquares = new Map<string, ChessSquare>();

  static readonly isImpossibleMove = (position: [number, number], moveTo: [number, number]): boolean => {
    const [posX, posY] = position;
    const [moveX, moveY] = moveTo;

    return (posX + moveX < 0 || posX + moveX > maxBoardWidth || posY + moveY < 0 || posY + moveY > maxBoardWidth);
  }
  static readonly knightMoves = [
    [-2, 1], [-1, 2], [1, 2], [2, 1], 
    [2, -1], [1, -2], [-1, -2], [-2, -1]
  ]
  readonly possibleMoves: [[number, number]] | null = null;

  predecessor: ChessSquare | null = null;
  readonly position: [number, number] | null = null;

  constructor(...position: [number, number]) {
    this.position = position;
    const [posX, posY] = position;

    ChessSquare.discoveredSquares.set(`${posX}${posY}`, this);

    for (const move of ChessSquare.knightMoves as [[number, number]]) {
      const [moveX, moveY] = move;

      if (ChessSquare.isImpossibleMove(position, move))
        continue;

      if (this.possibleMoves) this.possibleMoves.push(position);
      else this.possibleMoves = [position];
    }
  }
}

function shortestKnightPath(startPosition: [number, number], 
                            endPosition: [number, number]): any {

  const initialSquare = new ChessSquare(...startPosition);
  const finalSquare = new ChessSquare(...endPosition);

  const searchQueue = [finalSquare];
  while (!searchQueue.includes(initialSquare)) {
    const currentSquare = searchQueue.shift() as ChessSquare;

    const [curX, curY] = currentSquare?.position as [number, number];

    for (let possibleMove of currentSquare?.possibleMoves!) {
      const [moveX, moveY] = possibleMove;
      const [nextX, nextY] = [curX + moveX, curY + moveY];

      if (ChessSquare.isImpossibleMove(currentSquare?.position as [number, number], possibleMove)) continue;

      const nextSquare = ChessSquare.discoveredSquares.get(`${nextX}${nextY}`) ?? new ChessSquare(nextX, nextY);
      nextSquare.predecessor = currentSquare;
    }
  }
}

console.log("Shortest path:");
console.log(shortestKnightPath([0, 0], [4, 2]));