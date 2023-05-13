/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(p1, p2, HEIGHT, WIDTH) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  };
  
  makeBoard() {
    this.board = [];
    for (let i=0; i < this.HEIGHT; i++) {
      const r = [];
      for (let x=0; x < this.WIDTH; x++){
        r.push(null);
      }
      this.board.push(r)
    }
    return board;
  };

  makeHtmlBoard() {
    let htmlBoard = document.getElementById('board');
  
    const top = document.createElement("tr"); //creates a top row
    top.setAttribute("id", "column-top"); //gives an id of column-top
    this.bindClick = this.handleClick.bind(this);
    top.addEventListener("click", this.bindClick); //gives event listener and links it to handleClick function below
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);
  
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr"); //Loops a number of times based on height. Creates a row for each loop.
      for (let x = 0; x < this.WIDTH; x++) { //loops a number of times based on width. Creates an html cell in a row for each loop
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`); //gives id of a grid position based on the row number and cell number
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  };

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--){
      if (!this.board[y][x]){
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    let div = document.createElement('div');
    div.classList.add('piece');
    div.style.backgroundColor = this.currPlayer.color;
    let spot = document.getElementById(`${y}-${x}`);
    spot.append(div);
  };

  endGame(msg) {
    setTimeout(function () {
      alert(msg);
    }, 250)
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.bindClick);
  };

  handleClick(evt) {
    let x = evt.target.id;
    let y = this.findSpotForCol(x);

    if (y === null) {
      return;
    }
  
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
  
    if (this.checkForWin()) {
      this.gameOver = true;
      this.endGame(`Player ${this.currPlayer.color} won!`);
    }
  
    if(this.board.every(value => value.every(cell => cell))) {
      alert('Both players have tied!');
    }
  
   this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  };
  
  checkForWin() {
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
  
    for (let y = 0; y < this.HEIGHT; y++) { 
      for (let x = 0; x < this.WIDTH; x++) { 
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; 
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; 
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; 
  
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  };
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.getElementById('start-game').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('p1Color').value);
  let p2 = new Player(document.getElementById('p2Color').value);
  new Game (p1, p2, 6, 7);
});
