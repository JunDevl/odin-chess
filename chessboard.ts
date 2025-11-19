import { start } from "repl";
import { Queue } from "./queue";
import { visitParameterList } from "typescript";

const maxBoardWidth = 7;

const possibleKnightMoves = [
  [-2, 1], 
  [-1, 2], 
  [1, 2], 
  [2, 1], 
  [2, -1], 
  [1, -2], 
  [-1, -2], 
  [-2, -1]
]

function shortestKnightPath(startCoordinate: [number, number], 
                            endCoordinate: [number, number], 
                            queue?: Queue<[number, number]>, 
                            visitedCoordinates?: [[number, number]]): [[number, number]] | undefined {

  let resultPath: [[number, number]] | undefined = undefined;

  const [posx, posy] = startCoordinate;
  const [endx, endy] = endCoordinate;
  visitedCoordinates = visitedCoordinates ? visitedCoordinates : [[posx, posy]];

  for (let move of possibleKnightMoves) {
    //console.log(startCoordinate);
    const [movex, movey] = move;
    const [nextx, nexty] = [posx + movex, posy + movey]

    if (nextx < 0 || nexty < 0) continue;

    if (nextx === endx && nexty === endy) {
      visitedCoordinates.push([nextx, nexty]);
      resultPath = visitedCoordinates;
      break;
    };

    if (!queue) queue = new Queue()
    else if (queue.Size > 0) queue.dequeue();

    if (visitedCoordinates.length > 1) visitedCoordinates.push([posx, posy]);
  
    queue.enqueue([nextx, nexty]);
  }

  if (!queue || !queue.first) return resultPath;

  return resultPath ?? shortestKnightPath(queue.first?.data, endCoordinate, queue, visitedCoordinates);
}

console.log("Shortest path:");
console.log(shortestKnightPath([0, 0], [4, 2]));