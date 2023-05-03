/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (i=0; i<HEIGHT; i++) {
    r = [];
    for (x=0; x<WIDTH; x++){
      r.push(null);
    }
    board.push(r)
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.getElementById('board');

  const top = document.createElement("tr"); //creates a top row
  top.setAttribute("id", "column-top"); //gives an id of column-top
  top.addEventListener("click", handleClick); //gives event listener and links it to handleClick function below

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); //Loops a number of times based on height. Creates a row for each loop.
    for (let x = 0; x < WIDTH; x++) { //loops a number of times based on width. Creates an html cell in a row for each loop
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`); //gives id of a grid position based on the row number and cell number
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (y = HEIGHT-1; y >= 0; y--){
    if (!board[y][x]){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let div = document.createElement('div');
  div.classList.add('piece');
  div.classList.add(`p${currPlayer}`)
  let spot = document.getElementById(`${y}-${x}`);
  spot.append(div);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id; //the + forces the target into a number

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x]= currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(board.every(value => value.every(cell => cell))) {
    alert('Both players have tied!');
  }

  // switch players
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) { //Loops through each row
    for (let x = 0; x < WIDTH; x++) { //Loops through each cell in a row
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //checks horizontal win
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //checks vertical win
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //checks diagonal to the right win
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //checks diagonal to the left win

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true; //if any wins, return true and end game
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
