const pb = ['p', 'b', true, false, false];
const eb = ['e', 'b', false, false, false];
const hb = ['h', 'b', false, false, false];
const rb = ['r', 'b', true, false, false];
const qb = ['q', 'b', false, false, false];
const kb = ['k', 'b', true, false, false];

const pw = ['p', 'w', true, false, false];
const ew = ['e', 'w', false, false, false];
const hw = ['h', 'w', false, false, false];
const rw = ['r', 'w', true, false, false];
const qw = ['q', 'w', false, false, false];
const kw = ['k', 'w', true, false, false];

const em = ['', '', false, false, false];

const defaultPos = 
[

/*           A   B   C   D   E   F   G   H             */

/* 8 */    [ rb, hb, eb, qb, kb, eb, hb, rb ],    /* 8 */

/* 7 */    [ pb, pb, pb, pb, pb, pb, pb, pb ],    /* 7 */

/* 6 */    [ em, em, em, em, em, em, em, em ],    /* 6 */

/* 5 */    [ em, em, em, em, em, em, em, em ],    /* 5 */

/* 4 */    [ em, em, em, em, qw, em, qb, em ],    /* 4 */

/* 3 */    [ em, em, em, em, em, em, em, em ],    /* 3 */

/* 2 */    [ pw, pw, pw, em, em, pw, pw, pw ],    /* 2 */

/* 1 */    [ rw, em, em, kw, em, ew, hw, rw ]     /* 1 */

/*           A   B   C   D   E   F   G   H             */

];

function allMovesOfFigure(figure, color, x, y, firstStep, testForState, board) {
    let uncolor;
    color === 'w' ? uncolor = 'b' : uncolor = 'w';
    let moves = [];
    switch (figure) {
        case 'q':
            for (let q = -1; q < 2; q++) {
                for (let p = -1; p < 2; p++) {
                    for (let i = 1; i < 8; i++) {
                        const newX = x + p * i;
                        const newY = y + q * i;
                        if (board[newY] !== undefined && board[newY][newX] !== undefined) {
                            const newCell = board[newY][newX];
                            if (newCell[1] === uncolor) {
                                moves.push([newY, newX]);
                                break;
                            } else if (newCell[1] === '') {
                                moves.push([newY, newX]);
                            } else {
                                if (testForState) {
                                    moves.push([newY, newX]);
                                }
                                break;
                            }
                        } else {break;}
                    }
                }
            }
        break;
        case 'r':
            for (let q = -1; q < 2; q++) {
                for (let p = -1; p < 2; p++) {
                    if (p !== q && p !== -q) {
                        for (let i = 1; i < 8; i++) {
                            const newX = x + p * i;
                            const newY = y + q * i;
                            if (board[newY] !== undefined && board[newY][newX] !== undefined) {
                                const newCell = board[newY][newX];
                                if (newCell[1] === uncolor) {
                                    moves.push([newY, newX]);
                                    break;
                                } else if (newCell[1] === '') {
                                    moves.push([newY, newX]);
                                } else {
                                    if (testForState) {
                                        moves.push([newY, newX]);
                                    }
                                    break;
                                }
                            } else {break;}
                        }
                    }
                }
            }
        break;
        case 'e':
            for (let q = -1; q < 2; q++) {
                for (let p = -1; p < 2; p++) {
                    if (p === q || p === -q) {
                        for (let i = 1; i < 8; i++) {
                            const newX = x + p * i;
                            const newY = y + q * i;
                            if (board[newY] !== undefined && board[newY][newX] !== undefined) {
                                const newCell = board[newY][newX];
                                if (newCell[1] === uncolor) {
                                    moves.push([newY, newX]);
                                    break;
                                } else if (newCell[1] === '') {
                                    moves.push([newY, newX]);
                                } else {
                                    if (testForState) {
                                        moves.push([newY, newX]);
                                    }
                                    break;
                                }
                            } else {break;}
                        }
                    }
                }
            }
        break;
        case 'h':
            for (let q = -2; q < 3; q++) {
                for (let p = -2; p < 3; p++) {
                    if (p !== q && p !== -q && p !== 0 && q !== 0) {
                        const newX = x + p;
                        const newY = y + q;
                        if (board[newY] !== undefined && board[newY][newX] !== undefined) {
                            const newCell = board[newY][newX];
                            if (newCell[1] !== color || testForState) {
                                moves.push([newY, newX]);
                            }
                        }
                    }
                }
            }
        break;
        case 'p':
            let p;
            p = color === 'w'? -1: 1;
            if (board[y + p] !== undefined && board[y + p][x] !== undefined && board[y + p][x][1] === '') {
                moves.push([y + p, x]);
                if (board[y + p] !== undefined && board[y + 2 * p][x] !== undefined && board[y + 2 * p][x][1] === '' && firstStep) {
                    moves.push([y + 2 * p, x]);
                }
            }
            if (board[y + p] !== undefined && board[y + p][x + 1] !== undefined && (board[y + p][x + 1][1] === 'b' || board[y + p][x + 1][4] || testForState)) {
                moves.push([y + p, x + 1]);
            }
            if (board[y + p] !== undefined && board[y + p][x - 1] !== undefined && (board[y + p][x - 1][1] === 'b' || board[y + p][x - 1][4] || testForState)) {
                moves.push([y + p, x - 1]);
            }
        break;
        case 'k':
            for (let q = -1; q < 2; q++) {
                for (let p = -1; p < 2; p++) {
                    const newX = x + p;
                    const newY = y + q;
                    if (board[newY] !== undefined && board[newY][newX] !== undefined) {
                        const newCell = board[newY][newX];
                        if (newCell[1] !== color) {
                            moves.push([newY, newX]);
                        }
                    }
                }
            }
            if (firstStep) {
                const r = ['r', color, true, false, false];
                board.forEach((j) => {
                    j.forEach((i, index) => {
                        if (JSON.stringify(i) === JSON.stringify(r) && i[2]) {
                            let canCastleLeft = true;
                            let canCastleRight = true;
                            if (index < x) {
                                for (let p = index + 1; p < x; p++) {
                                    if (board[y][p][0] !== '') {
                                        canCastleLeft = false;
                                        break;
                                    }
                                }
                                if (canCastleLeft) { moves.push([y, x - 2]); }
                            } else {
                                for (let p = x + 1; p < index; p++) {
                                    if (board[y][p][0] !== '') {
                                        canCastleRight = false;
                                        break;
                                    }
                                }
                                if (canCastleRight) { moves.push([y, x + 2]); }
                            }
                        }
                    });
                });
            }
        break;
        default:
            moves = [];
        break;
    }
    return moves;
}

function deleteImpossibleMoves(figure, color, x, y, firstStep, testForState, state, allMoves, board) {
    let validMoves = allMoves;
    let allowedIndexes = [];
    let allMovesInvalid = false;
    let uncolor;
    let numberOfCheckingFigures = 0;
    let castlingRightBlocked = false;
    let castlingLeftBlocked = false;
    color === 'w' ? uncolor = 'b' : uncolor = 'w';
    if (state === 'check') {
        allMovesInvalid = true;
        board.forEach((j, newY) => {
            j.forEach((f, newX) => {
                if (f[1] === uncolor) {
                    allMovesOfFigure(f[0], uncolor, newX, newY, f[2], testForState, board).forEach((e) => {
                        if (board[e[0]][e[1]][0] === 'k' && board[e[0]][e[1]][1] === color) {
                            numberOfCheckingFigures++;
                            let cellY = e[0];
                            let cellX = e[1];
                            let direction = ''; // direction of checking
                            if (newY > cellY) {
                                if (newX > cellX) {direction = 'up-left';}
                                else if (newX < cellX) {direction = 'up-right';}
                                else {direction = 'up';}
                            } else if (newY < cellY) {
                                if (newX > cellX) {direction = 'down-left';}
                                else if (newX < cellX) {direction = 'down-right';}
                                else {direction = 'down';}
                            } else {
                                if (newX > cellX) {direction = 'left';}
                                else if (newX < cellX) {direction = 'right';}
                            }
                            allMovesOfFigure(f[0], uncolor, newX, newY, f[2], testForState, board).forEach((m) => {
                                for (let i = 0; i < validMoves.length; i++) {
                                    if (JSON.stringify(validMoves[i]) === JSON.stringify(m)) {
                                        if (figure === 'k') {
                                            validMoves.splice(i, 1);
                                            i--;
                                        } else {
                                            if (direction === 'up' && (newY > m[0] && newX === m[1])) {
                                                allowedIndexes.push(i);
                                            } else if (direction === 'up-right' && (newY > m[0] && newX < m[1])) {
                                                allowedIndexes.push(i);
                                            } else if (direction === 'up-left' && (newY > m[0] && newX > m[1])) {
                                                allowedIndexes.push(i);
                                            } else if (direction === 'right' && (newY === m[0] && newX < m[1])) {
                                                allowedIndexes.push(i);
                                            } else if (direction === 'left' && (newY === m[0] && newX > m[1])) {
                                                allowedIndexes.push(i);
                                            } else if (direction === 'down' && (newY < m[0] && newX === m[1])) {
                                                allowedIndexes.push(i);
                                            } else if (direction === 'down-right' && (newY < m[0] && newX < m[1])) {
                                                allowedIndexes.push(i);
                                            } else if (direction === 'down-left' && (newY < m[0] && newX > m[1])) {
                                                allowedIndexes.push(i);
                                            }
                                        }
                                    }
                                }
                            });
                            validMoves.forEach((m, index) => {
                                if (JSON.stringify(m) === JSON.stringify([newY, newX])) {
                                    allMovesInvalid = true;
                                    allowedIndexes.push(index);
                                }
                            });
                        }
                    });
                }
            });
        });
    } else if (figure !== 'k') {
        for (let q = -1; q < 2; q++) {
            for (let p = -1; p < 2; p++) {
                for (let i = 1; i < 8; i++) {
                    const newX = x + p * i;
                    const newY = y + q * i;
                    if (board[newY] !== undefined && board[newY][newX] !== undefined) {
                        const newCell = board[newY][newX];
                        const newFigure = newCell[0];
                        const newColor = newCell[1];
                        if (newColor === uncolor) {
                            if (((p === q || p === -q) && (newFigure === 'q' || newFigure === 'e'))
                             || ((p === 0 || q === 0) && newFigure === 'r')) {
                                for (let j = -1; j > -8; j--) {
                                    const newnewX = x + p * j;
                                    const newnewY = y + q * j;
                                    if (board[newnewY] !== undefined && board[newnewY][newnewX] !== undefined) {
                                        const newnewCell = board[newnewY][newnewX];
                                        const newnewFigure = newnewCell[0];
                                        const newnewColor = newnewCell[1];
                                        if (newnewFigure === 'k' && newnewColor === color) {
                                            allMovesInvalid = true;
                                            for (let m = -1; m >= j; m--) {
                                                const checkingWayY = y + q * m;
                                                const checkingWayX = x + p * m;
                                                const checkingWayCell = board[checkingWayY][checkingWayX];
                                                const checkingWayColor = checkingWayCell[1];
                                                if (checkingWayColor !== color) {
                                                    allMoves.forEach((n, index) => {
                                                        if (n[0] === checkingWayY && n[1] === checkingWayX) {
                                                            allowedIndexes.push(index);    
                                                        }
                                                    });
                                                } else {break;}
                                            }
                                            for (let m = 1; m <= i; m++) {
                                                const checkingWayY = y + q * m;
                                                const checkingWayX = x + p * m;
                                                const checkingWayCell = board[checkingWayY][checkingWayX];
                                                const checkingWayColor = checkingWayCell[1];
                                                if (checkingWayColor !== color) {
                                                    allMoves.forEach((n, index) => {
                                                        if (n[0] === checkingWayY && n[1] === checkingWayX) {
                                                            allowedIndexes.push(index);
                                                        }
                                                    });
                                                } else {break;}
                                            }
                                        } else if (newnewColor !== '') {break;}
                                    } else {break;}
                                }
                            }
                        } else if (newColor === color) {break;}
                    } else {break;}
                }
            }
        }
    }
    if (figure !== 'k' && allMovesInvalid) {
        validMoves = [];
        allowedIndexes.forEach((i) => {
            validMoves.push(allMoves[i]);
        });
    }

    if (figure === 'k') {
        if (state === 'check') {
            for (let i = 0; i < validMoves.length; i++) {
                if (Math.abs(validMoves[i][1] - x) === 2) {
                    validMoves.splice(i, 1);
                    i--;
                }
            }
        } else {
            for (let newY = 0; newY < 8; newY++) {
                for (let newX = 0; newX < 8; newX++) {
                    const newCell = board[newY][newX];
                    if (newCell[1] === uncolor) {
                        allMovesOfFigure(newCell[0], uncolor, newX, newY, newCell[2], testForState, board).forEach((m) => {
                            for (let i = 0; i < validMoves.length; i++) {
                                if (JSON.stringify(validMoves[i]) === JSON.stringify(m)) {
                                    if (validMoves[i][0] === y) {
                                        if (!castlingLeftBlocked) {castlingLeftBlocked = validMoves[i][1] < x;}
                                        if (!castlingRightBlocked) {castlingRightBlocked = validMoves[i][1] > x;}
                                    }
                                    validMoves.splice(i, 1);
                                    i--;
                                }
                            }
                        });
                    }
                }
            }
        }
        for (let i = 0; i < validMoves.length; i++) {
            if (Math.abs(validMoves[i][1] - x) === 2) {
                if (castlingLeftBlocked && validMoves[i][1] < x) {
                    validMoves.splice(i, 1);
                    i--;
                } else if (castlingRightBlocked && validMoves[i][1] > x) {
                    validMoves.splice(i, 1);
                    i--;
                }
            }
        }
    }
    if (state === 'check' && numberOfCheckingFigures > 1 && figure !== 'k') {
        validMoves = [];
    }
    return validMoves;
}

class Chess {
    constructor(board) {
        this.board = board;
        this.position = defaultPos;
        this.history = [];
        this.side = 'w';
        this.state = '';
        this.sum = this.chessSummary();
    }

    setUp() {
        const trStart = document.createElement('tr');
        const trEnd = document.createElement('tr');
        trStart.className = 'start';
        trEnd.className = 'end';
        trStart.innerHTML = '<td></td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td></td>';
        trEnd.innerHTML = '<td></td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td></td>';
        this.board.appendChild(trStart);
        this.position.forEach((i, y) => {
            const tdFirst = document.createElement('td');
            const tdLast = document.createElement('td');
            tdFirst.className = 'first';
            tdLast.className = 'last';
            tdFirst.innerText = tdLast.innerText = 8 - y;
            this.board.appendChild(document.createElement('tr'));
            this.board.lastChild.appendChild(tdFirst);
            i.forEach((j, x) => {
                const figure = j[1] + j[0];
                const img = document.createElement('img');
                img.src =  `./chesses/${figure}.webp`;
                img.alt = figure;
                this.board.lastChild.appendChild(document.createElement('td'));
                this.board.lastChild.lastChild.appendChild(img);
                if ((y + x) % 2 === 0) {
                    this.board.lastChild.lastChild.style.background = 'rgb(253, 202, 153)';
                } else {
                    this.board.lastChild.lastChild.style.background = 'rgb(100, 55, 49)';
                }
            });
            this.board.lastChild.appendChild(tdLast);
        });
        this.board.appendChild(trEnd);
    }

    getValue(figure, color) {
        let value;
        switch (figure) {
            case 'k': value = 900; break;
            case 'q': value = 90; break;
            case 'r': value = 50; break;
            case 'e': case 'h': value = 30; break;
            case 'p': value = 10; break;
            default: value = 0; break;
        }
        color === 'w'? value = value: value = -value;
        return value;
    }

    chessSummary() {
        let sum = 0;
        this.position.forEach((y) => {
            y.forEach((x) => {
                sum += this.getValue(x[0], x[1]);
            });
        });
        return sum;
    }

    getMoves(f, y, x, testForState = false) {
        const figure = f[0];
        const color = f[1];
        const firstStep = f[2];
        const board = this.position;
        let moves = [];
        moves = allMovesOfFigure(figure, color, x, y, firstStep, testForState, board);
        moves = deleteImpossibleMoves(figure, color, x, y, firstStep, testForState, this.state, moves, board);
        return moves;
    }

    getAllMoves() {
        let allMoves = [];
        this.position.forEach((i, y) => {
            i.forEach((f, x) => {
                this.getMoves(f, y, x).forEach((m) => {
                    allMoves.push([[y, x], m]);
                });
            });
        });
        return allMoves;
    }

    colorMoves(moves) {
        moves.forEach((m) => {
            this.board.childNodes[m[0] + 1].childNodes[m[1] + 1].style.boxShadow = "inset 0 0 0 1000px rgba(130, 255, 167, 0.55)";
            this.board.childNodes[m[0] + 1].childNodes[m[1] + 1].setAttribute('class', 'selected');
        });
    }

    defaultColoring() {
        if (this.board.querySelector('td.figure') !== null) this.board.querySelector('td.figure').className = '';
        this.board.querySelectorAll('td.selected').forEach((e)=> {
            e.style.boxShadow = '';
            e.removeAttribute('class');
        });
    }

    move(f, e, y, x, ey, ex) {
        this.position[y][x] = em;
        this.position[ey][ex] = f;
        this.side = this.side === 'w' ? 'b' : 'w';
    }

    visualize() {
        this.position.forEach((i, y) => {
            i.forEach((j, x) => {
                const figure = j[1] + j[0];
                const img = document.createElement('img');
                img.src = `./chesses/${figure}.webp`;
                img.alt = figure;
                this.board.childNodes[y + 1].childNodes[x + 1].innerHTML = '';
                this.board.childNodes[y + 1].childNodes[x + 1].appendChild(img);
            });
        });
    }

    testBoard() {
        let king, kingX, kingY;
        this.position.forEach((i, y) => {
            i.forEach((j, x) => {
                if (j[0] === 'k' && j[1] === this.side) {
                    king = j;
                    kingX = x;
                    kingY = y;
                }
            });
        });
    }
}

const table = document.querySelector('table#chess > tbody');

const board = new Chess(table);

board.setUp();
  
table.addEventListener('click', (event) => {
    let elem = event.target.tagName === 'IMG' ? event.target.parentNode : event.target;
    let coordX, coordY;
    table.childNodes.forEach((tr, y) => {
        tr.childNodes.forEach((td, x) => {
            if (td === elem) {
                coordX = x - 1;
                coordY = y - 1;
            }
        });
    });

    let coordXofFigure, coordYofFigure;
    table.childNodes.forEach((tr, y) => {
        tr.childNodes.forEach((td, x) => {
            if (td.className === 'figure') {
                coordXofFigure = x - 1;
                coordYofFigure = y - 1;
            }
        });
    });

    let selectedFigure;
    if (typeof(coordXofFigure) === 'number' && typeof(coordYofFigure) === 'number') {
        selectedFigure = board.position[coordYofFigure][coordXofFigure];
    }
    console.log(selectedFigure);
    
    if (elem.tagName === 'TD' && elem.childNodes.length !== 0 && elem.firstChild.tagName === 'IMG'/* && board.position[coordY][coordX][1] === board.side*/) {
        const cell = board.position[coordY][coordX];
        const moving = elem.className === 'selected' ? true : false;
        if (moving) {
            board.move(selectedFigure, cell, coordYofFigure, coordXofFigure, coordY, coordX);
            board.visualize();
            board.defaultColoring();
        } else {
            board.defaultColoring();
            const moves = board.getMoves(cell, coordY, coordX);
            elem.className = 'figure';
            board.colorMoves(moves);
        }
    }
});