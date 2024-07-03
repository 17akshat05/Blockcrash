const width = 8;
const grid = document.getElementById('grid');
const stepBackBtn = document.getElementById('step-back');
const colors = ['red', 'blue', 'green', 'yellow'];
let squares = [];
let moveHistory = [];
let level = 1;

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
});

function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        square.classList.add('cell', randomColor);
        grid.appendChild(square);
        squares.push(square);
    }
    addDragEventListeners();
}

function addDragEventListeners() {
    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));
}

let colorBeingDragged;
let squareIdBeingDragged;
let squareIdBeingReplaced;

function dragStart() {
    colorBeingDragged = this.className.split(' ')[1];
    squareIdBeingDragged = parseInt(this.id);
}

function dragEnd() {
    let validMoves = [
        squareIdBeingDragged - 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + 1,
        squareIdBeingDragged + width
    ];
    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
        squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
        squares[squareIdBeingReplaced].className = squares[squareIdBeingDragged].className;
        squares[squareIdBeingDragged].className = colorBeingDragged;
    } else squares[squareIdBeingDragged].className = colorBeingDragged;
    checkForMatches();
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    squareIdBeingReplaced = parseInt(this.id);
    moveHistory.push({ from: squareIdBeingDragged, to: squareIdBeingReplaced });
    this.className = squares[squareIdBeingDragged].className;
    squares[squareIdBeingDragged].className = colorBeingDragged;
}

function checkForMatches() {
    for (let i = 0; i < 62; i++) {
        let rowOfThree = [i, i + 1, i + 2];
        let columnOfThree = [i, i + width, i + width * 2];
        let decidedColor = squares[i].className.split(' ')[1];
        const isBlank = squares[i].className === 'cell';

        if (rowOfThree.every(index => squares[index].className.includes(decidedColor) && !isBlank)) {
            rowOfThree.forEach(index => {
                squares[index].className = 'cell';
            });
        }
        if (columnOfThree.every(index => squares[index].className.includes(decidedColor) && !isBlank)) {
            columnOfThree.forEach(index => {
                squares[index].className = 'cell';
            });
        }
    }
}

stepBackBtn.addEventListener('click', () => {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        const { from, to } = lastMove;
        const fromColor = squares[from].className;
        const toColor = squares[to].className;

        squares[from].className = toColor;
        squares[to].className = fromColor;
    }
});
