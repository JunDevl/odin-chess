import { Queue } from "./queue";

const maxBoardWidth = 7;

class ChessSquare {
  static discoveredSquares = new Map<string, ChessSquare>();

  static readonly isImpossibleMove = (position: [number, number], moveTo: [number, number]): boolean => {
    const [posX, posY] = position;
    const [moveX, moveY] = moveTo;

    const nextX = posX + moveX, nextY = posY + moveY;

    return (nextX < 0 ||
            nextX > maxBoardWidth ||
            nextY < 0 ||
            nextY > maxBoardWidth);
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

  const queue = [finalSquare];
  while (!queue.includes(initialSquare)) {
    const currentSquare = queue.shift();

    if (!currentSquare) break;

    for (let possibleMove of currentSquare.possibleMoves) {
      const [curX, curY] = currentSquare.position;
      const [moveX, moveY] = possibleMove;

      const [nextX, nextY] = [curX + moveX, curY + moveY];

      if (ChessSquare.discoveredSquares.has(`${nextX}${nextY}`)) continue;

      const newSquare = new ChessSquare(curX + moveX, curY + moveY);

      newSquare.predecessor = currentSquare;

      queue.push(newSquare);
    }
  }
  const path = [initialSquare]
  while (!path.includes(finalSquare)) {
    const nextSquare = path[path.length - 1].predecessor;
    if (!nextSquare) continue;
    path.push(nextSquare);
  }
  console.log(`The shortest path was ${path.length - 1} moves!`);
  console.log("The moves were:");
  path.forEach(square => console.log(square.position));

  /* MY ATTEMPT, DIDN'T WORK...
  while (!searchQueue.contains(initialSquare)) {
    const currentSquare = searchQueue.first?.data;

    if (!currentSquare) break;

    searchQueue.dequeue();

    const [curX, curY] = currentSquare?.position as [number, number];

    for (let possibleMove of currentSquare?.possibleMoves!) {
      const [moveX, moveY] = possibleMove;
      const [nextX, nextY] = [curX + moveX, curY + moveY];

      let nextSquare: ChessSquare 
      
      if (ChessSquare.discoveredSquares.has(`${nextX}${nextY}`)) 
        continue; 
      
      nextSquare = new ChessSquare(nextX, nextY);

      if (nextSquare === finalSquare) continue;

      nextSquare.predecessor = currentSquare;

      searchQueue.enqueue(nextSquare);
    }
  };

  const path = [];
  let nextSquare = initialSquare;

  do {
    path.push(nextSquare.position);
    nextSquare = nextSquare!.predecessor!;
  } while (nextSquare !== finalSquare);

  path.push(finalSquare.position);
  */
  

  return path;
}

console.log("Shortest path:");
console.log(shortestKnightPath([4, 1], [6, 7]));