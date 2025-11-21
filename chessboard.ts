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
  readonly possibleMoves: [[number, number]];

  predecessor: ChessSquare | null = null;
  readonly position: [number, number];

  constructor(...position: [number, number]) {
    this.position = position;
    this.possibleMoves = <unknown>[] as [[number, number]]
    const [posX, posY] = position;

    ChessSquare.discoveredSquares.set(`${posX}${posY}`, this);

    for (const move of ChessSquare.knightMoves as [[number, number]]) {
      const [moveX, moveY] = move;

      if (ChessSquare.isImpossibleMove(position, move))
        continue;

      this.possibleMoves.push([moveX, moveY])
    }
  }
}

function shortestKnightPath(startPosition: [number, number], 
                            endPosition: [number, number]) {

  const initialSquare = new ChessSquare(...startPosition);
  const finalSquare = new ChessSquare(...endPosition);

  const searchQueue = new Queue({data: finalSquare});
  while (searchQueue.last?.data !== initialSquare) {
    const currentSquare = searchQueue.first?.data as ChessSquare;

    searchQueue.dequeue();

    const [curX, curY] = currentSquare?.position as [number, number];

    for (let possibleMove of currentSquare?.possibleMoves!) {
      const [moveX, moveY] = possibleMove;
      const [nextX, nextY] = [curX + moveX, curY + moveY];

      const nextSquare = ChessSquare.discoveredSquares.get(`${nextX}${nextY}`) ?? new ChessSquare(nextX, nextY);

      nextSquare.predecessor = currentSquare;

      searchQueue.enqueue(nextSquare);
    }
  }

  const path = [];
  let nextSquare = initialSquare.predecessor;

  do path.push(nextSquare)
  while (nextSquare !== finalSquare)
    nextSquare = nextSquare.predecessor;

  return path;
}

console.log("Shortest path:");
console.log(shortestKnightPath([0, 0], [4, 2]));