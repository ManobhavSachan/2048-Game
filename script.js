import Grid from "./Grid.js";
import Tile from "./Tile.js";

let gameBoard = document.getElementById("game-board");

const Score = document.getElementById("score");
const hScore = document.getElementById("hscore");
let score = 0;
let hscore = 0;
Score.innerText = `Score: ${score}`;
hScore.innerText = `High Score: ${hscore}`;


let grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
let prevGrid;
setupInput();

const start = document.getElementById("start");
start.addEventListener("click", getOption);
function getOption() {
  score = 0; 
      Score.innerText = `Score: ${score}`;
      grid.cells.forEach((cell) => cell.erase());
      grid.remove;
      console.log(gameBoard);
      gameBoard = document.getElementById("game-board");

    grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
let prevGrid;
setupInput();
}

function setupInput() {
    console.log(prevGrid);
   prevGrid = grid;
    window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
//   console.log(gameBoard);
  switch (e.key) {
    
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;

    case "w":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "s":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "a":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "d":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;

    default:
      setupInput();
      return;
  }
//   console.log(gameBoard);
  grid.cells.forEach((cell) => (score += cell.mergeTiles()));
  Score.innerText = `Score: ${score}`;
  if(hscore < score){
    hscore = score;
  }
  hScore.innerText = `High Score: ${hscore}`;

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

//   console.log(prevGrid);
  //   grid.cells.forEach((cell) => cell.erase());

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      //construct replay function
      alert("You loose");
      score = 0; 
      Score.innerText = `Score: ${score}`;
      grid.cells.forEach((cell) => cell.erase());
    // grid = prevGrid;
      grid.randomEmptyCell().tile = new Tile(gameBoard);
      grid.randomEmptyCell().tile = new Tile(gameBoard);
      setupInput();
    });
    return;
  }

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}
