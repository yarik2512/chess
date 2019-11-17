// variables
const be = '<img src="./chesses/be.webp" alt="ЧС">';
const bh = '<img src="./chesses/bh.webp" alt="ЧК">';
const bk = '<img src="./chesses/bk.webp" alt="ЧКр">';
const bp = '<img src="./chesses/bp.webp" alt="ЧП">';
const bq = '<img src="./chesses/bq.webp" alt="ЧФ">';
const br = '<img src="./chesses/br.webp" alt="ЧЛ">';
const we = '<img src="./chesses/we.webp" alt="БС">';
const wh = '<img src="./chesses/wh.webp" alt="БК">';
const wk = '<img src="./chesses/wk.webp" alt="БКр">';
const wp = '<img src="./chesses/wp.webp" alt="БП">';
const wq = '<img src="./chesses/wq.webp" alt="БФ">';
const wr = '<img src="./chesses/wr.webp" alt="БЛ">';
const table = document.querySelector("#twhite > tbody");
const historyW = document.querySelector("div#white > ol");
const historyB = document.querySelector("div#black > ol");
const info = document.querySelector("div#info");
let lastHorizontW = false;
let lastHorizontB = false;
let step = "white";
let movesMb = [];
let moves = [];
let castlingLeft = [];
let castlingRight = [];
let figure;
let check = false;
let mate = false;
let jujube = false;
let result = [];
let hist = [];

// functions
function setUp(elem) { // table initialisation
    let child;
    for (let y = 0; y < 10; y++) {
        if (y == 0 || y == 9) { // 1st & last rows of table
            if (elem.parentNode.getAttribute('id') == "twhite") {
                elem.innerHTML += `<tr class="symbol ${y == 0 ? "start" : "end"}"><td></td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td></td></tr>`;
            } else if (elem.parentNode.getAttribute('id') == "tblack") {
                elem.innerHTML += `<tr class="symbol ${y == 0 ? "end" : "start"}"><td></td><td>H</td><td>G</td><td>F</td><td>E</td><td>D</td><td>C</td><td>B</td><td>A</td><td></td></tr>`;
            }
        }
        else { // other rows of table
            elem.innerHTML += `<tr></tr>`;
            child = elem.querySelector(`tbody tr:last-child`);
            for (let x = 0; x < 10; x++) {
                if (elem.parentNode.getAttribute('id') == "twhite") {
                    if (x == 0) { // first cell of row
                        child.innerHTML += `<td class="first">${9 - y}</td>`;
                    } else if (x == 9) { // last cell of row
                        child.innerHTML += `<td class="last">${9 - y}</td>`;
                    } else { // other cells of row
                        child.innerHTML += `<td data-figure="none" data-coordinates="${x} ${y}" data-color="none"></td>`;
                        if (Math.abs(x - y) % 2 == 1) {
                            elem.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(100, 55, 49)";
                        } else {
                            elem.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(253, 202, 153)";
                        }
                    }
                } else if (elem.parentNode.getAttribute('id') == "tblack") {
                    if (x == 0) { // first cell of row
                        child.innerHTML += `<td class="first">${y}</td>`;
                    } else if (x == 9) { // last cell of row
                        child.innerHTML += `<td class="last">${y}</td>`;
                    } else { // other cells of row
                        child.innerHTML += `<td data-figure="none" data-coordinates="${9 - x} ${9 - y}" data-color="none"></td>`;
                        if (Math.abs(x - y) % 2 == 1) {
                            elem.querySelector(`td[data-coordinates="${9 - x} ${9 - y}"]`).style.backgroundColor = "rgb(100, 55, 49)";
                        } else {
                            elem.querySelector(`td[data-coordinates="${9 - x} ${9 - y}"]`).style.backgroundColor = "rgb(253, 202, 153)";
                        }
                    }
                }
            }
        }
    }
    for (let y = 1; y < 3; y++) { // black figures initialisation
        for (let x = 1; x < 9; x++) {
            if (y == 1) {
                if (x == 1 || x == 8) { // riddle
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = br;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "br");
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-first-step", "true");
                } else if (x == 2 || x == 7) { // horse
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = bh;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "bh");
                } else if (x == 3 || x == 6) { // elephant
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = be;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "be");
                } else if (x == 4) { // queen
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = bq;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "bq");
                } else if (x == 5) { // king
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = bk;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "bk");
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-first-step", "true");
                }
            }
            if (y == 2) { // pawns
                elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = bp;
                elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "bp");
                elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-first-step", "true");
            }
            elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-color", "black");
        }
    }
    for (let y = 7; y < 9; y++) { // white figures initialisation (like white figures)
        for (let x = 1; x < 9; x++) {
            if (y == 8) {
                if (x == 1 || x == 8) {
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = wr;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "wr");
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-first-step", "true");
                } else if (x == 2 || x == 7) {
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = wh;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "wh");
                } else if (x == 3 || x == 6) {
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = we;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "we");
                } else if (x == 4) {
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = wq;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "wq");
                } else if (x == 5) {
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = wk;
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "wk");
                    elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-first-step", "true");
                }
            }
            if (y == 7) {
                elem.querySelector(`td[data-coordinates="${x} ${y}"]`).innerHTML = wp;
                elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-figure", "wp");
                elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-first-step", "true");
            }
            elem.querySelector(`td[data-coordinates="${x} ${y}"]`).setAttribute("data-color", "white");
        }
    }
}

function enableMoves(elem, k = false) { // enable Moves for adjusted figure (elem)
    let moves = [];
    let king = [];
    let castleCoords = [];
    let castlingL = true; // castling in left side
    let castlingR = true; // castling in right side
    const coords = [+elem.dataset.coordinates.split(' ')[0], +elem.dataset.coordinates.split(' ')[1]];
    switch (elem.dataset.figure) { // checking what the figure is
        case "we": // elephant
            for (let x = -1; x < 2; x += 2) { // changing direction of checking
                for (let y = -1; y < 2; y += 2) { // changing direction of checking
                    for (let i = 1; i < 8; i++) { // changing cell of checking
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`) != null) { // does exist this cell?
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "black") { // color of checking cell is black
                                if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "bk") { // figure on checking cell is king
                                    for (let e = i; e > 0; e--) {
                                        moves.push(`${coords[0] + x * e} ${coords[1] + y * e} check`); // diagonal to king (for protection of check)
                                    }
                                }
                                if (k && table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "bk") {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                } else {
                                    for (let e = i + 1; e < 8; e++) { // if on diagonal to king staying black figure, than this figure can move only on this diagonal
                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`) && table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.color == "black") {
                                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.figure == "bk") {
                                                moves.push(`${coords[0] + x * i} ${coords[1] + y * i} open_gates`);
                                                for (let q = i - 1; q >= 0; q--) {
                                                    if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`)) {
                                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "none") {
                                                            moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                        } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "white") {
                                                            moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                            break;
                                                        } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "black") {
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                    }
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`); // cell, which elephant can kick
                                    break; // ending this for because elephant can't move behind black figure
                                }
                            } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "white") {
                                if (k) {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`); // black king can't kick some white figure, if this figure is under the protection of this elephant
                                }
                                break;
                            } else {
                                moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`); // cell, on which elephant can move
                            }
                        }
                    }
                }
            }
            break;
        case "wr": // riddle (like elephant)
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    if (x != y && x != -y) {
                        for (let i = 1; i < 8; i++) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`) != null) {
                                if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "black") {
                                    if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "bk") {
                                        for (let e = i; e > 0; e--) {
                                            moves.push(`${coords[0] + x * e} ${coords[1] + y * e} check`);
                                        }
                                    }
                                    if (k && table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "bk") {
                                        moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                    } else {
                                        for (let e = i + 1; e < 8; e++) {
                                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`) && table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.color == "black") {
                                                if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.figure == "bk") {
                                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i} open_gates`);
                                                    for (let q = i - 1; q >= 0; q--) {
                                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`)) {
                                                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "none") {
                                                                moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                            } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "white") {
                                                                moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                                break;
                                                            } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "black") {
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    break;
                                                }
                                            }
                                        }
                                        moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                        break;
                                    }
                                } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "white") {
                                    if (k) {
                                        moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                    }
                                    break;
                                } else {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                }
                            }
                        }
                    }
                }
            }
            break;
        case "wq": // queen (like elephant)
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    for (let i = 1; i < 8; i++) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`) != null) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "black") {
                                if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "bk") {
                                    for (let e = i - 1; e > 0; e--) {
                                        moves.push(`${coords[0] + x * e} ${coords[1] + y * e} check`);
                                    }
                                }
                                if (k && table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "bk") {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                } else {
                                    for (let e = i + 1; e < 8; e++) {
                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`) && table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.color == "black") {
                                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.figure == "bk") {
                                                moves.push(`${coords[0] + x * i} ${coords[1] + y * i} open_gates`);
                                                for (let q = i - 1; q >= 0; q--) {
                                                    if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`)) {
                                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "none") {
                                                            moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                        } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "white") {
                                                            moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                            break;
                                                        } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "black") {
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                    }
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                    break;
                                }
                            } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "white") {
                                if (k) {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                }
                                break;
                            } else {
                                moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                            }
                        }
                    }
                }
            }
            break;
        case "wh": // horse (like elephant)
            for (let x = -2; x < 3; x++) {
                for (let y = -2; y < 3; y++) {
                    if (x != y && x != 0 && y != 0 && x != -y) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`) != null) {
                            if (k) {
                                moves.push(`${coords[0] + x} ${coords[1] + y}`);
                            } else {
                                if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`).dataset.color != "white") {
                                    moves.push(`${coords[0] + x} ${coords[1] + y}`);
                                }
                            }
                        }
                    }
                }
            }
            break;
        case "wp": // pawn
            if (k) {
                if (table.querySelector(`td[data-coordinates="${coords[0] - 1} ${coords[1] - 1}"]`) != null) {
                    moves.push(`${coords[0] - 1} ${coords[1] - 1}`);
                }
                if (table.querySelector(`td[data-coordinates="${coords[0] + 1} ${coords[1] - 1}"]`) != null) {
                    moves.push(`${coords[0] + 1} ${coords[1] - 1}`);
                }
            } else {
                if (table.querySelector(`td[data-coordinates="${coords[0]} ${coords[1] - 1}"]`) != null) {
                    if (table.querySelector(`td[data-coordinates="${coords[0]} ${coords[1] - 1}"]`).dataset.color == "none") {
                        moves.push(`${coords[0]} ${coords[1] - 1}`); // default move of pawn
                        if (table.querySelector(`td[data-coordinates="${coords[0]} ${coords[1] - 2}"]`) != null) {
                            if (elem.dataset.firstStep == "true" && table.querySelector(`td[data-coordinates="${coords[0]} ${coords[1] - 2}"]`).dataset.color == "none") { // 1st move of pawn can be made through cell
                                moves.push(`${coords[0]} ${coords[1] - 2}`);
                            }
                        }
                    }
                }
                if (table.querySelector(`td[data-coordinates="${coords[0] - 1} ${coords[1] - 1}"]`) != null) {
                    if (table.querySelector(`td[data-coordinates="${coords[0] - 1} ${coords[1] - 1}"]`).dataset.color == "black" ||table.querySelector(`td[data-coordinates="${coords[0] - 1} ${coords[1] - 1}"]`).hasAttribute("data-beaten-cell")) { // cell, which pawn can kick || aisle take
                        moves.push(`${coords[0] - 1} ${coords[1] - 1}`);
                    }
                }
                if (table.querySelector(`td[data-coordinates="${coords[0] + 1} ${coords[1] - 1}"]`) != null) {
                    if (table.querySelector(`td[data-coordinates="${coords[0] + 1} ${coords[1] - 1}"]`).dataset.color == "black" ||table.querySelector(`td[data-coordinates="${coords[0] + 1} ${coords[1] - 1}"]`).hasAttribute("data-beaten-cell")) { // cell, which pawn can kick || aisle take
                        moves.push(`${coords[0] + 1} ${coords[1] - 1}`);
                    }
                }
            }
            break;
        case "wk": // king
            if (k) { // black king can't move on cell, which is under the strike of this king
                for (let x = -1; x < 2; x++) {
                    for (let y = -1; y < 2; y++) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`) != null) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`).dataset.color != "black") {
                                moves.push(`${coords[0] + x} ${coords[1] + y}`);
                            }
                        }
                    }
                }
            } else {
                for (let x = -1; x < 2; x++) { // cells on which king can move
                    for (let y = -1; y < 2; y++) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`) != null) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`).dataset.color !== "white") {
                                moves.push(`${coords[0] + x} ${coords[1] + y}`);
                            }
                        }
                    }
                }
                for (let i = 1; i < 9; i++) { // king can't move on cell, which is under the strike of black figure
                    for (let j = 1; j < 9; j++) {
                        if (table.querySelector(`td[data-coordinates="${i} ${j}"]`).dataset.color == "black") {
                            king = enableMoves(table.querySelector(`td[data-coordinates="${i} ${j}"]`), true);
                            king.forEach((elemk) => {
                                for (let index = 0; index < moves.length; index++) {
                                    if (elemk == moves[index] && elemk != `${i} ${j}`) {
                                        moves.splice(index, 1);
                                        index--;
                                    }
                                }
                            });
                        }
                    }
                }
                if (elem.dataset.firstStep == "true") { // castling
                    table.querySelectorAll('td[data-figure="wr"]').forEach((e) => {
                        if (e.dataset.firstStep == "true") {
                            castleCoords = [+e.dataset.coordinates.split(' ')[0], +e.dataset.coordinates.split(' ')[1]];
                            if (coords[0] > castleCoords[0]) {
                                for (let i = castleCoords[0] + 1; i < coords[0]; i++) {
                                    if (table.querySelector(`td[data-coordinates="${i} ${coords[1]}"]`).dataset.figure != "none") {
                                        castlingL = false;
                                        break;
                                    } else if (i > castleCoords[0] + 1) {
                                        table.querySelectorAll('td[data-color="black"]').forEach((elem) => {
                                            if (elem.dataset.figure == "bk") {
                                                enableMoves(elem, true).forEach((m) => {
                                                    if (m == `${i} ${coords[1]}`) {
                                                        castlingL = false;
                                                    }
                                                });
                                            } else {
                                                enableMoves(elem).forEach((m) => {
                                                    if (m == `${i} ${coords[1]}`) {
                                                        castlingL = false;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                                if (castlingL) {
                                    moves.push(`${coords[0] - 2} ${coords[1]} castling l`);
                                }
                            } else if (coords[0] < castleCoords[0]) {
                                for (let i = coords[0] + 1; i < castleCoords[0]; i++) {
                                    if (table.querySelector(`td[data-coordinates="${i} ${coords[1]}"]`).dataset.figure != "none") {
                                        castlingR = false;
                                        break;
                                    } else {
                                        table.querySelectorAll('td[data-color="black"]').forEach((elem) => {
                                            if (elem.dataset.figure == "bk") {
                                                enableMoves(elem, true).forEach((m) => {
                                                    if (m == `${i} ${coords[1]}`) {
                                                        castlingR = false;
                                                    }
                                                });
                                            } else {
                                                enableMoves(elem).forEach((m) => {
                                                    if (m == `${i} ${coords[1]}`) {
                                                        castlingR = false;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                                if (castlingR) {
                                    moves.push(`${coords[0] + 2} ${coords[1]} castling r`);
                                }
                            }
                        }
                    });
                }
            }
            break;
        case "be":
            for (let x = -1; x < 2; x += 2) {
                for (let y = -1; y < 2; y += 2) {
                    for (let i = 1; i < 8; i++) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`) != null) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "white") {
                                if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "wk") {
                                    for (let e = i; e > 0; e--) {
                                        moves.push(`${coords[0] + x * e} ${coords[1] + y * e} check`);
                                    }
                                }
                                if (k && table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "wk") {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                } else {
                                    for (let e = i + 1; e < 8; e++) {
                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`) && table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.color == "white") {
                                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.figure == "wk") {
                                                moves.push(`${coords[0] + x * i} ${coords[1] + y * i} open_gates`);
                                                for (let q = i - 1; q >= 0; q--) {
                                                    if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`)) {
                                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "none") {
                                                            moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                        } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "black") {
                                                            moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                            break;
                                                        } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "white") {
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                    }
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                    break;
                                }
                            } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "black") {
                                if (k) {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                }
                                break;
                            } else {
                                moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                            }
                        }
                    }
                }
            }
            break;
        case "br":
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    if (x != y && x != -y) {
                        for (let i = 1; i < 8; i++) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`) != null) {
                                if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "white") {
                                    if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "wk") {
                                        for (let e = i; e > 0; e--) {
                                            moves.push(`${coords[0] + x * e} ${coords[1] + y * e} check`);
                                        }
                                    }
                                    if (k && table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "wk") {
                                        moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                    } else {
                                        for (let e = i + 1; e < 8; e++) {
                                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`) && table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.color == "white") {
                                                if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.figure == "wk") {
                                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i} open_gates`);
                                                    for (let q = i - 1; q >= 0; q--) {
                                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`)) {
                                                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "none") {
                                                                moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                            } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "black") {
                                                                moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                                break;
                                                            } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "white") {
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    break;
                                                }
                                            }
                                        }
                                        moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                        break;
                                    }
                                } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "black") {
                                    if (k) {
                                        moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                    }
                                    break;
                                } else {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                }
                            }
                        }
                    }
                }
            }
            break;
        case "bq":
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    for (let i = 1; i < 8; i++) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`) != null) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "white") {
                                if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "wk") {
                                    for (let e = i; e > 0; e--) {
                                        moves.push(`${coords[0] + x * e} ${coords[1] + y * e} check`);
                                    }
                                }
                                if (k && table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.figure == "wk") {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                } else {
                                    for (let e = i + 1; e < 8; e++) {
                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`) && table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.color == "white") {
                                            if (table.querySelector(`td[data-coordinates="${coords[0] + x * e} ${coords[1] + y * e}"]`).dataset.figure == "wk") {
                                                moves.push(`${coords[0] + x * i} ${coords[1] + y * i} open_gates`);
                                                for (let q = i - 1; q >= 0; q--) {
                                                    if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`)) {
                                                        if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "none") {
                                                            moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                        } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "black") {
                                                            moves.push(`${coords[0] + x * q} ${coords[1] + y * q} open_gates move`);
                                                            break;
                                                        } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * q} ${coords[1] + y * q}"]`).dataset.color == "white") {
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                    }
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                    break;
                                }
                            } else if (table.querySelector(`td[data-coordinates="${coords[0] + x * i} ${coords[1] + y * i}"]`).dataset.color == "black") {
                                if (k) {
                                    moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                                }
                                break;
                            } else {
                                moves.push(`${coords[0] + x * i} ${coords[1] + y * i}`);
                            }
                        }
                    }
                }
            }
            break;
        case "bh":
            for (let x = -2; x < 3; x++) {
                for (let y = -2; y < 3; y++) {
                    if (x != y && x != 0 && y != 0 && x != -y) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`) != null) {
                            if (k) {
                                moves.push(`${coords[0] + x} ${coords[1] + y}`);
                            } else {
                                if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`).dataset.color != "black") {
                                    moves.push(`${coords[0] + x} ${coords[1] + y}`);
                                }
                            }
                        }
                    }
                }
            }
            break;
        case "bp":
            if (k) {
                if (table.querySelector(`td[data-coordinates="${coords[0] + 1} ${coords[1] + 1}"]`) != null) {
                    moves.push(`${coords[0] + 1} ${coords[1] + 1}`);
                }
                if (table.querySelector(`td[data-coordinates="${coords[0] - 1} ${coords[1] + 1}"]`) != null) {
                    moves.push(`${coords[0] - 1} ${coords[1] + 1}`);
                }
            } else {
                if (table.querySelector(`td[data-coordinates="${coords[0]} ${coords[1] + 1}"]`) != null) {
                    if (table.querySelector(`td[data-coordinates="${coords[0]} ${coords[1] + 1}"]`).dataset.color == "none") {
                        moves.push(`${coords[0]} ${coords[1] + 1}`);
                        if (elem.dataset.firstStep == "true" && table.querySelector(`td[data-coordinates="${coords[0]} ${coords[1] + 2}"]`).dataset.color == "none") {
                            moves.push(`${coords[0]} ${coords[1] + 2}`);
                        }
                    }
                }
                if (table.querySelector(`td[data-coordinates="${coords[0] - 1} ${coords[1] + 1}"]`) != null) {
                    if (table.querySelector(`td[data-coordinates="${coords[0] - 1} ${coords[1] + 1}"]`).dataset.color == "white" ||table.querySelector(`td[data-coordinates="${coords[0] - 1} ${coords[1] + 1}"]`).hasAttribute("data-beaten-cell")) {
                        moves.push(`${coords[0] - 1} ${coords[1] + 1}`);
                    }
                }
                if (table.querySelector(`td[data-coordinates="${coords[0] + 1} ${coords[1] + 1}"]`)) {
                    if (table.querySelector(`td[data-coordinates="${coords[0] + 1} ${coords[1] + 1}"]`).dataset.color == "white" ||table.querySelector(`td[data-coordinates="${coords[0] + 1} ${coords[1] + 1}"]`).hasAttribute("data-beaten-cell")) {
                        moves.push(`${coords[0] + 1} ${coords[1] + 1}`);
                    }
                }
            }
            break;
        case "bk":
            if (k) {
                for (let x = -1; x < 2; x++) {
                    for (let y = -1; y < 2; y++) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`) != null) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`).dataset.color != "white") {
                                moves.push(`${coords[0] + x} ${coords[1] + y}`);
                            }
                        }
                    }
                }
            } else {
                for (let x = -1; x < 2; x++) {
                    for (let y = -1; y < 2; y++) {
                        if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`) != null) {
                            if (table.querySelector(`td[data-coordinates="${coords[0] + x} ${coords[1] + y}"]`).dataset.color !== "black") {
                                moves.push(`${coords[0] + x} ${coords[1] + y}`);
                            }
                        }
                    }
                }
                for (let i = 1; i < 9; i++) {
                    for (let j = 1; j < 9; j++) {
                        if (table.querySelector(`td[data-coordinates="${i} ${j}"]`).dataset.color == "white") {
                            king = enableMoves(table.querySelector(`td[data-coordinates="${i} ${j}"]`), true);
                            king.forEach((elemk) => {
                                for (let index = 0; index < moves.length; index++) {
                                    if (elemk == moves[index] && elemk != `${i} ${j}`) {
                                        moves.splice(index, 1);
                                        index--;
                                    }
                                }
                            });
                        }
                    }
                }
                if (elem.dataset.firstStep == "true") {
                    table.querySelectorAll('td[data-figure="br"]').forEach((e) => {
                        if (e.dataset.firstStep == "true") {
                            castleCoords = [+e.dataset.coordinates.split(' ')[0], +e.dataset.coordinates.split(' ')[1]];
                            if (coords[0] > castleCoords[0]) {
                                for (let i = castleCoords[0] + 1; i < coords[0]; i++) {
                                    if (table.querySelector(`td[data-coordinates="${i} ${coords[1]}"]`).dataset.figure != "none") {
                                        castlingL = false;
                                        break;
                                    } else if (i > castleCoords[0] + 1) {
                                        table.querySelectorAll('td[data-color="white"]').forEach((elem) => {
                                            if (elem.dataset.figure == "wk") {
                                                enableMoves(elem, true).forEach((m) => {
                                                    if (m == `${i} ${coords[1]}`) {
                                                        castlingL = false;
                                                    }
                                                });
                                            } else {
                                                enableMoves(elem).forEach((m) => {
                                                    if (m == `${i} ${coords[1]}`) {
                                                        castlingL = false;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                                if (castlingL) {
                                    moves.push(`${coords[0] - 2} ${coords[1]} castling l`);
                                }
                            } else if (coords[0] < castleCoords[0]) {
                                for (let i = coords[0] + 1; i < castleCoords[0]; i++) {
                                    if (table.querySelector(`td[data-coordinates="${i} ${coords[1]}"]`).dataset.figure != "none") {
                                        castlingR = false;
                                        break;
                                    } else {
                                        table.querySelectorAll('td[data-color="white"]').forEach((elem) => {
                                            if (elem.dataset.figure == "wk") {
                                                enableMoves(elem, true).forEach((m) => {
                                                    if (m == `${i} ${coords[1]}`) {
                                                        castlingR = false;
                                                    }
                                                });
                                            } else {
                                                enableMoves(elem).forEach((m) => {
                                                    if (m == `${i} ${coords[1]}`) {
                                                        castlingR = false;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                                if (castlingR) {
                                    moves.push(`${coords[0] + 2} ${coords[1]} castling r`);
                                }
                            }
                        }
                    });
                }
            }
            break;
        default:
            break;
    }
    return moves; // returning array of coordinates of cells, on which can move adjusted figure (example of array: ["5 5", "1 4", "0 0"])
}

function color(arr) { // coloring of cells, coordinates of which is in array arr
    arr.forEach((elem) => {
        table.querySelector(`td[data-coordinates="${elem}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(130, 255, 167, 0.55)";
    });
}

function test(k) { // testing on check || mate & checking which figure can protect king from check || mate
    let doubleKick = 0;
    let jujube = true;
    let nomate = false;
    let result = [];
    let enableMovesB = [];
    let enableMovesW = [];
    let moves = enableMoves(k);
    for (let x = 1; x < 9; x++) {
        for (let y = 1; y < 9; y++) {
            if (k.dataset.color == "white") {
                if (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == "black") {
                    enableMovesB = enableMoves(table.querySelector(`td[data-coordinates="${x} ${y}"]`));
                    enableMovesB.forEach((b) => {
                        if (b == k.dataset.coordinates) {
                            doubleKick++; // count of black figures, which are making check for white king
                        }
                    });
                    table.querySelectorAll('td[data-color="white"]').forEach((e) => { // checking which figure can protect king from check || mate
                        let i = +e.dataset.coordinates[0];
                        let j = +e.dataset.coordinates[2];
                        enableMovesW = enableMoves(e);
                        enableMovesW.forEach((w) => {
                            if (w == `${x} ${y}`) {
                                enableMovesB.forEach((b) => {
                                    if (b == k.dataset.coordinates) {
                                        result.push(`${i} ${j} ${w}`);
                                        nomate = true;
                                    }
                                });
                            }
                            enableMovesB.forEach((b) => {
                                if (b == w + " check") {
                                    result.push(`${i} ${j} ${w}`);
                                    nomate = true;
                                }
                            });
                        });
                    });
                    if (doubleKick > 1) { // if two or more black figures are making check for white king
                        if (result[0] == "check") {
                            result = [];
                            result.unshift("check");
                        } else if (result[0] == "mate") {
                            result = [];
                            result.unshift("mate");
                        } else {
                            result = [];
                        }
                        nomate = false;
                    }
                    enableMovesB.forEach((b) => {
                        if (b[4] == "o") { // if  this figure is staying on way, by which black figure can make check
                            result.push(`${b}`);
                        }
                        if (b == k.dataset.coordinates) {
                            if (moves == []) {
                                if (!nomate) {
                                    result.unshift("mate");
                                } else {
                                    result.unshift("check");
                                }
                            } else {
                                result.unshift("check");
                            }
                        }
                    });
                }
            } else {
                if (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == "white") {
                    enableMovesW = enableMoves(table.querySelector(`td[data-coordinates="${x} ${y}"]`));
                    enableMovesW.forEach((w) => {
                        if (w == k.dataset.coordinates) {
                            doubleKick++;
                        }
                    });
                    table.querySelectorAll('td[data-color="black"]').forEach((e) => {
                        let i = +e.dataset.coordinates[0];
                        let j = +e.dataset.coordinates[2];
                        enableMovesB = enableMoves(e);
                        enableMovesB.forEach((b) => {
                            if (b == `${x} ${y}`) {
                                enableMovesW.forEach((w) => {
                                    if (w == k.dataset.coordinates) {
                                        result.push(`${i} ${j} ${b}`);
                                        nomate = true;
                                    }
                                });
                            }
                            enableMovesW.forEach((w) => {
                                if (w == b + " check") {
                                    result.push(`${i} ${j} ${b}`);
                                    nomate = true;
                                }
                            });
                        });
                    });
                    if (doubleKick > 1) {
                        if (result[0] == "check") {
                            result = [];
                            result.unshift("check");
                        } else if (result[0] == "mate") {
                            result = [];
                            result.unshift("mate");
                        } else {
                            result = [];
                        }
                        nomate = false;
                    }
                    enableMovesW.forEach((w) => {
                        if (w[4] == "o") {
                            result.push(`${w}`);
                        }
                        if (w == k.dataset.coordinates) {
                            if (moves.length == 0) {
                                if (!nomate) {
                                    result.unshift("mate");
                                } else {
                                    result.unshift("check");
                                }
                            } else {
                                result.unshift("check");
                            }
                        }
                    });
                }
            }
            enableMovesB = [];
            enableMovesW = [];
            nomate = false;
        }
    }
    if (moves.length == 0 && result.length == 0) {
        table.querySelectorAll(`td[data-color="${k.dataset.color}"]`).forEach((e) => {
            if (enableMoves(e).length != 0) {
                jujube = false;
            }
        });
        if (jujube) {
            result.unshift("jujube"); // jujube
        }
    }
    return result; // returning result
}

function lastHorizont(cell, selection) {
    table.scrollIntoView();
    const e = table.querySelector(`td[data-coordinates="${cell.dataset.coordinates}"]`);
    const color = cell.dataset.color;
    let figure;
    switch (selection.innerHTML) {
        case wq:
            figure = "wq";
            break;
        case wr:
            figure = "wr";
            break;
        case we:
            figure = "we";
            break;
        case wh:
            figure = "wh";
            break;
        case bq:
            figure = "bq";
            break;
        case br:
            figure = "br";
            break;
        case be:
            figure = "be";
            break;
        case bh:
            figure = "bh";
            break;
        default:
            break;
    }
    const inner = selection.innerHTML;
    e.setAttribute("data-figure", figure);
    e.setAttribute("data-color", color);
    e.innerHTML = inner;
    info.innerHTML = "";
    table.parentNode.style.animationName = `${step}`;
    step == "white" ? table.parentNode.style.transform = 'none' : table.parentNode.style.transform = 'rotate(180deg)';
    if (step == "white") {
        table.querySelectorAll('td[data-color="white"] img').forEach((e) => {
            e.style.animationName = "white";
            e.style.transform = 'none';
        });
    } else {
        table.querySelectorAll('td[data-color="white"] img').forEach((e) => {
            e.style.animationName = "black";
            e.style.transform = 'rotate(180deg)';
        });
    }
    if (step == "black") {
        table.querySelectorAll('td[data-color="black"] img').forEach((e) => {
            e.style.animationName = "black";
            e.style.transform = 'rotate(180deg)';
        });
    } else {
        table.querySelectorAll('td[data-color="black"] img').forEach((e) => {
            e.style.animationName = "white";
            e.style.transform = 'none';
        });
    }
    if (color == "white") {
        result = test(table.querySelector('td[data-figure="bk"]'));
        if (result[0] == "check") {
            check = true;
            historyW.lastChild.innerHTML += "+";
            info.innerHTML = '<h2 class="danger">Шах!</h2>';
        } else if (result[0] == "mate") {
            mate = true;
            historyW.lastChild.innerHTML += "х";
            info.innerHTML = '<h2 class="danger">Чёрным мат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
        } else if (result[0] == "jujube") {
            jujube = true;
            info.innerHTML = '<h2 class="info">Пат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
        } else {
            check = false;
        }
    } else {
        result = test(table.querySelector('td[data-figure="wk"]'));
        if (result[0] == "check") {
            check = true;
            historyB.lastChild.innerHTML += "+";
            info.innerHTML = '<h2 class="danger">Шах!</h2>';
        } else if (result[0] == "mate") {
            mate = true;
            historyB.lastChild.innerHTML += "х";
            info.innerHTML = '<h2 class="danger">Белым мат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
        } else if (result[0] == "jujube") {
            jujube = true;
            info.innerHTML = '<h2 class="info">Пат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
        } else {
            check = false;
        }
    }
    for (let x = 1; x < 9; x++) { // coloring table in default colors
        for (let y = 1; y < 9; y++) {
            if (table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow != "") {
                table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "";
            }
            if ((check || mate) && table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == step && (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "wk" || table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "bk")) {
                table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(233, 65, 65, 0.5)";
            } else if (jujube && table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == step && (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "wk" || table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "bk")) {
                table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(0, 110, 255, 0.5)";
            } else {
                if (Math.abs(x - y) % 2 == 1) {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(100, 55, 49)";
                } else {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(253, 202, 153)";
                }
            }
        }
    }
}

function move(f, e) { // moving adjusted figure (f) on adjusted cell (e)
    let figure = f.dataset.figure;
    let inner = f.innerHTML;
    let fCoordinates = f.dataset.coordinates;
    let eCoordinates = e.dataset.coordinates;
    const color = f.dataset.color;
    let history = []; // array in which is figure, first coordinates, les coordinates (example: ["b", "1", "c", "3", "Ф"])
    history[1] = 9 - +f.dataset.coordinates[2];
    switch (+f.dataset.coordinates[0]) {
        case 1:
            history[0] = "a";
            break;
        case 2:
            history[0] = "b";
            break;
        case 3:
            history[0] = "c";
            break;
        case 4:
            history[0] = "d";
            break;
        case 5:
            history[0] = "e";
            break;
        case 6:
            history[0] = "f";
            break;
        case 7:
            history[0] = "g";
            break;
        case 8:
            history[0] = "h";
            break;
        default:
            break;
    }
    history[3] = 9 - +e.dataset.coordinates[2];
    switch (+e.dataset.coordinates[0]) {
        case 1:
            history[2] = "a";
            break;
        case 2:
            history[2] = "b";
            break;
        case 3:
            history[2] = "c";
            break;
        case 4:
            history[2] = "d";
            break;
        case 5:
            history[2] = "e";
            break;
        case 6:
            history[2] = "f";
            break;
        case 7:
            history[2] = "g";
            break;
        case 8:
            history[2] = "h";
            break;
        default:
            break;
    }
    switch (figure) {
        case "wq":
        case "bq":
            history[4] = "Ф";
            break;
        case "wr":
        case "br":
            history[4] = "Л";
            break;
        case "we":
        case "be":
            history[4] = "С";
            break;
        case "wh":
        case "bh":
            history[4] = "К";
            break;
        case "wk":
        case "bk":
            history[4] = "Кр";
            break;
        default:
            history[4] = "";
            break;
        }
    // adding step in history |
    //                        V
    if (color == "white") {
        if (e.hasAttribute("data-beaten-cell") && figure == "wp") {
            historyW.innerHTML += `<li>${history[0]}:${history[2]}${history[3]}</li>`;
        } else if (e.dataset.figure != "none") {
            if (figure == "wp") {
                historyW.innerHTML += `<li>${history[0]}:${history[2]}${history[3]}</li>`;
            } else {
                historyW.innerHTML += `<li>${history[4]}${history[0]}${history[1]}:${history[2]}${history[3]}</li>`;
            }
        } else {
            historyW.innerHTML += `<li>${history[4]}${history[0]}${history[1]}-${history[2]}${history[3]}</li>`;
        }
    }
    if (color == "black") {
        if (e.hasAttribute("data-beaten-cell") && figure == "bp") {
            historyB.innerHTML += `<li>${history[0]}:${history[2]}${history[3]}</li>`;
        } else if (e.dataset.figure != "none") {
            if (figure == "bp") {
                historyB.innerHTML += `<li>${history[0]}:${history[2]}${history[3]}</li>`;
            } else {
                historyB.innerHTML += `<li>${history[4]}${history[0]}${history[1]}:${history[2]}${history[3]}</li>`;
            }
        } else {
            historyB.innerHTML += `<li>${history[4]}${history[0]}${history[1]}-${history[2]}${history[3]}</li>`;
        }
    }
    if (f.hasAttribute('data-first-step')) {
        if (e.hasAttribute('data-first-step')) {
            if (table.querySelector('td[data-beaten-figure=""]') != null) {
                hist.push([fCoordinates, f.dataset.color, f.dataset.figure, f.innerHTML, eCoordinates, e.dataset.color, e.dataset.figure, e.innerHTML, table.querySelector('td[data-beaten-figure=""]').dataset.coordinates, table.querySelector('td[data-beaten-cell=""]').dataset.coordinates, ['first-step', 'first-step'], '']);
            } else {
                hist.push([fCoordinates, f.dataset.color, f.dataset.figure, f.innerHTML, eCoordinates, e.dataset.color, e.dataset.figure, e.innerHTML, '', '', ['first-step', 'first-step'], '']);
            }
        } else {
            if (table.querySelector('td[data-beaten-figure=""]') != null) {
                hist.push([fCoordinates, f.dataset.color, f.dataset.figure, f.innerHTML, eCoordinates, e.dataset.color, e.dataset.figure, e.innerHTML, table.querySelector('td[data-beaten-figure=""]').dataset.coordinates, table.querySelector('td[data-beaten-cell=""]').dataset.coordinates, ['first-step', ''], '']);
            } else {
                hist.push([fCoordinates, f.dataset.color, f.dataset.figure, f.innerHTML, eCoordinates, e.dataset.color, e.dataset.figure, e.innerHTML, '', '', ['first-step', ''], '']);
            }
        }
    } else if (e.hasAttribute) {
        if (table.querySelector('td[data-beaten-figure=""]') != null) {
            hist.push([fCoordinates, f.dataset.color, f.dataset.figure, f.innerHTML, eCoordinates, e.dataset.color, e.dataset.figure, e.innerHTML, table.querySelector('td[data-beaten-figure=""]').dataset.coordinates, table.querySelector('td[data-beaten-cell=""]').dataset.coordinates, ['', 'first-step'], '']);
        } else {
            hist.push([fCoordinates, f.dataset.color, f.dataset.figure, f.innerHTML, eCoordinates, e.dataset.color, e.dataset.figure, e.innerHTML, '', '', ['', 'first-step'], '']);
        }
    } else {
        if (table.querySelector('td[data-beaten-figure=""]') != null) {
            hist.push([fCoordinates, f.dataset.color, f.dataset.figure, f.innerHTML, eCoordinates, e.dataset.color, e.dataset.figure, e.innerHTML, table.querySelector('td[data-beaten-figure=""]').dataset.coordinates, table.querySelector('td[data-beaten-cell=""]').dataset.coordinates, ['', ''], '']);
        } else {
            hist.push([fCoordinates, f.dataset.color, f.dataset.figure, f.innerHTML, eCoordinates, e.dataset.color, e.dataset.figure, e.innerHTML, '', '', ['', ''], '']);
        }
    }
    //                        A
    // adding step in history |
    if ((figure == "wp" || figure == "bp") && e.hasAttribute("data-beaten-cell")) { // beaten cell (for aisle take)
        hist[hist.length-1][11] = [table.querySelector('td[data-beaten-figure=""]').innerHTML, table.querySelector('td[data-beaten-figure=""]').dataset.figure, table.querySelector('td[data-beaten-figure=""]').dataset.color];
        table.querySelector('td[data-beaten-figure=""]').innerHTML = "";
        table.querySelector('td[data-beaten-figure=""]').setAttribute("data-figure", "none");
        table.querySelector('td[data-beaten-figure=""]').setAttribute("data-color", "none");
    }
    table.querySelectorAll('td[data-beaten-cell=""]').forEach((elem) => {
        elem.removeAttribute("data-beaten-cell");
    });
    table.querySelectorAll('td[data-beaten-figure=""]').forEach((elem) => {
        elem.removeAttribute("data-beaten-figure");
    });
    if (figure == "wp") {
        if (+f.dataset.coordinates[2] == +e.dataset.coordinates[2] + 2) { // for aisle take
            table.querySelector(`td[data-coordinates="${f.dataset.coordinates[0]} ${+f.dataset.coordinates[2] - 1}"]`).setAttribute("data-beaten-cell", "");
            e.setAttribute("data-beaten-figure", "");
        }
        if (e.dataset.coordinates[2] == 1) { // if pawn reached last horizontal
            info.innerHTML = `<h2>Выберите фигуру</h2><br/><button class="figure">${wq}</button><button class="figure">${wr}</button><button class="figure">${we}</button><button class="figure">${wh}</button>`;
            info.scrollIntoView();
            lastHorizontW = true;
            document.querySelectorAll("button.figure").forEach((elem) => {
                elem.addEventListener("click", (event) => {
                    let element;
                    if (event.target.innerHTML == "") {
                        element = event.target.parentNode;
                    } else {
                        element = event.target;
                    }
                    lastHorizont(e, element);
                    lastHorizontW = false;
                });
            });
            figure = "none";
            inner = "";
        }
    } else if (figure == "bp") {
        if (+f.dataset.coordinates[2] == +e.dataset.coordinates[2] - 2) {
            table.querySelector(`td[data-coordinates="${f.dataset.coordinates[0]} ${+f.dataset.coordinates[2] + 1}"]`).setAttribute("data-beaten-cell", "");
            e.setAttribute("data-beaten-figure", "");
        }
        if (e.dataset.coordinates[2] == 8) {
            info.innerHTML = `<h2>Выберите фигуру</h2><br/><button class="figure">${bq}</button><button class="figure">${br}</button><button class="figure">${be}</button><button class="figure">${bh}</button>`;
            info.scrollIntoView();
            lastHorizontB = true;
            document.querySelectorAll("button.figure").forEach((elem) => {
                elem.addEventListener("click", (event) => {
                    let element;
                    if (event.target.innerHTML == "") {
                        element = event.target.parentNode;
                    } else {
                        element = event.target;
                    }
                    lastHorizont(e, element);
                    lastHorizontB = false;
                });
            });
            figure = "none";
            inner = "";
        }
    }
    // making a step |
    //               V
    f.removeAttribute("data-first-step");
    e.removeAttribute("data-first-step");
    f.setAttribute("data-figure", "none");
    f.setAttribute("data-color", "none");
    e.setAttribute("data-figure", figure);
    e.setAttribute("data-color", color);
    e.innerHTML = inner;
    f.innerHTML = "";
}

function castling(k, ek, r, er) { // castling (like moving)
    const king = k.dataset.figure;
    const riddle = r.dataset.figure;
    const colorK = k.dataset.color;
    const colorR = r.dataset.color;
    const innerK = k.innerHTML;
    const innerR = r.innerHTML;
    if (table.querySelector('td[data-beaten-figure=""]') != null) {
        hist.push([k.dataset.coordinates, colorK, king, innerK, ek.dataset.coordinates, ek.dataset.color, ek.dataset.figure, ek.innerHTML, table.querySelector('td[data-beaten-figure=""]').dataset.coordinates, table.querySelector('td[data-beaten-cell=""]').dataset.coordinates, ['first-step', ''], '', r.dataset.coordinates, colorR, riddle, innerR, er.dataset.coordinates, er.dataset.color, er.dataset.figure, er.innerHTML]);
    } else {
        hist.push([k.dataset.coordinates, colorK, king, innerK, ek.dataset.coordinates, ek.dataset.color, ek.dataset.figure, ek.innerHTML, '', '', ['first-step', ''], '', r.dataset.coordinates, colorR, riddle, innerR, er.dataset.coordinates, er.dataset.color, er.dataset.figure, er.innerHTML]);
    }
    table.querySelectorAll('td[data-beaten-cell=""]').forEach((elem) => {
        elem.removeAttribute("data-beaten-cell");
    });
    table.querySelectorAll('td[data-beaten-figure=""]').forEach((elem) => {
        elem.removeAttribute("data-beaten-figure");
    });
    if ((+k.dataset.coordinates[0] > +r.dataset.coordinates[0])) {
        k.dataset.color == "white" ? historyW.innerHTML += `<li>o-o-o</li>` : historyB.innerHTML += `<li>o-o-o</li>`;
    } else {
        k.dataset.color == "white" ? historyW.innerHTML += `<li>o-o</li>` : historyB.innerHTML += `<li>o-o</li>`;
    }
    k.removeAttribute("data-first-step");
    ek.removeAttribute("data-first-step");
    k.setAttribute("data-figure", "none");
    k.setAttribute("data-color", "none");
    ek.setAttribute("data-figure", king);
    ek.setAttribute("data-color", colorK);
    ek.innerHTML = innerK;
    k.innerHTML = "";
    r.removeAttribute("data-first-step");
    er.removeAttribute("data-first-step");
    r.setAttribute("data-figure", "none");
    r.setAttribute("data-color", "none");
    er.setAttribute("data-figure", riddle);
    er.setAttribute("data-color", colorR);
    er.innerHTML = innerR;
    r.innerHTML = "";
}

function calculateAllMoves(color, state) {
    const status = state[0];
    let allMoves = [];
    let openGates = false;
    let openGatesMoves = [];
    table.querySelectorAll(`td[data-color="${color}"]`).forEach((f) => {
        state.forEach((e) => {
            if (f.dataset.coordinates + ' open_gates' == e) {
                openGates = true;
                state.forEach((m) => {
                    if (m.slice(15, 19) == 'move') {
                        openGatesMoves.push([f.dataset.coordinates, m.slice(0, 3)]);
                    }
                });
            }
        });
        if (status == 'check') {
            state.forEach((e) => {
                if (f.dataset.coordinates == e.slice(0, 3) && e.slice(4, 14) != 'open_gates') {
                    if (openGates) {
                        openGatesMoves.some((m) => {
                            if (m[0] = f.dataset.figure && m[1] == e.slice(4, 7)) {
                                allMoves.push([f.dataset.figure, e.slice(4, 7)]);
                                return;
                            }
                        });
                    } else {
                        allMoves.push([f.dataset.coordinates, e.slice(4, 7)]);
                    }
                } else if (f.dataset.figure == 'bk' || f.dataset.figure == 'wk') {
                    enableMoves(f).forEach((m) => {
                        allMoves.push([f.dataset.coordinates, m]);
                    });
                }
            });
        } else if (status != 'mate' && status != 'jujube') {
            enableMoves(f).forEach((m) => {
                if (openGates) {
                    openGatesMoves.some((e) => {
                        if (e[0] == f.dataset.figure && e[1] == m) {
                            allMoves.push([f.dataset.coordinates, m]);
                        }
                    });
                } else {
                    allMoves.push([f.dataset.coordinates, m]);
                }
            });
        }
    });
    return allMoves;
}

function chessSumary(moves) {
    let sum = 0;
    moves.forEach((move) => {
        table.querySelectorAll('td').forEach((cell) => {
            if (cell.dataset.coordinates != move[0] && cell.dataset.coordinates != move[1]) {
                switch (cell.dataset.figure) {
                    case 'wk': sum += 900; break;
                    case 'wq': sum += 90; break;
                    case 'wr': sum += 50; break;
                    case 'we': case 'wh': sum += 30; break;
                    case 'wp': sum += 10; break;
                    case 'bk': sum -= 900; break;
                    case 'bq': sum -= 90; break;
                    case 'br': sum -= 50; break;
                    case 'be': case 'bh': sum -= 30; break;
                    case 'bp': sum -= 10; break;
                }
            } else if (cell.dataset.coordinates == move[1]) {
                switch (table.querySelector(`td[data-coordinates="${move[0]}"]`).dataset.figure) {
                    case 'wk': sum += 900; break;
                    case 'wq': sum += 90; break;
                    case 'wr': sum += 50; break;
                    case 'we': case 'wh': sum += 30; break;
                    case 'wp': sum += 10; break;
                    case 'bk': sum -= 900; break;
                    case 'bq': sum -= 90; break;
                    case 'br': sum -= 50; break;
                    case 'be': case 'bh': sum -= 30; break;
                    case 'bp': sum -= 10; break;
                }
            }
        });
    });
    return sum;
}

function minmax(deep, max) {
    if (deep == 0) {
        return 
    }
}

function calculateBestMove(color, state) {
    let bestMove;
    let bestSum = -1200;
    calculateAllMoves(color, state).forEach((move) => {
        let sum = -chessSumary([move]);
        if (sum > bestSum) {
            bestSum = sum;
            bestMove = move;
        }
    });
    return bestMove;
}


function iiStep(result) {
    console.log(result);
    const bestMove = calculateBestMove(step, result);
    // if (figure.dataset.figure == "bk" && Math.abs((+figure.dataset.coordinates[0]) - (+randomMove[0])) > 1) {
    //     if (+figure.dataset.coordinates[0] > +randomMove[0]) {
    //         if (figure.hasAttribute("data-first-step") && table.querySelectorAll)
    //     }
    // }
    move(table.querySelector(`td[data-coordinates="${bestMove[0]}"]`), table.querySelector(`td[data-coordinates="${bestMove[1]}"]`));
    setTimeout('step = "white";', 100);
    info.innerHTML = '';
    result = test(table.querySelector('td[data-figure="wk"]'));
    if (result[0] == "check") {
        check = true;
        historyW.lastChild.innerHTML += "+";
        info.innerHTML = '<h2 class="danger">Шах!</h2>';
    } else if (result[0] == "mate") {
        mate = true;
        historyW.lastChild.innerHTML += "х";
        info.innerHTML = '<h2 class="danger">Белым мат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
    } else if (result[0] == "jujube") {
        jujube = true;
        info.innerHTML = '<h2 class="info">Пат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
    }  else {
        check = false;
    }
    for (let x = 1; x < 9; x++) { // coloring table in default colors
        for (let y = 1; y < 9; y++) {
            if (table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow != "") {
                table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "";
            }
            if ((check || mate) && table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == step && (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "wk" || table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "bk")) {
                table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(233, 65, 65, 0.5)";
            } else if (jujube && table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == step && (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "wk" || table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "bk")) {
                table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(0, 110, 255, 0.5)";
            } else if (lastHorizontW) {
                if (Math.abs(x - y) % 2 == 1 && randomMove.dataset.coordinates != `${x} ${y}`) {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(100, 55, 49)";
                } else if (randomMove.dataset.coordinates != `${x} ${y}`) {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(253, 202, 153)";
                } else {
                    randomMove.style.boxShadow = "inset 0 0 0 1000px rgba(0, 110, 255, 0.5)";
                }
            } else {
                if (Math.abs(x - y) % 2 == 1) {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(100, 55, 49)";
                } else {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(253, 202, 153)";
                }
            }
        }
    }
}

// code
setUp(table);


table.addEventListener("click", (event) => { // eventListener for cell of table
    if (step == "white") {
        let elem;
        if (event.target.hasAttribute("src")) {
            elem = event.target.parentNode;
        } else {
            elem = event.target;
        }
        if (!lastHorizontB && !lastHorizontW) {
            let cantMove = false;
            let openGatesMoves = [];
            let canMove = false;
            let moveTo = [];
            
            if (moves.length > 0) { // if we are moving figure
                moves.forEach((e) => {
                    if (elem.dataset.coordinates == e) {
                        info.innerHTML = "";
                        // checking for castling
                        if (elem == castlingLeft[1]) {
                            castling(castlingLeft[0], castlingLeft[1], castlingLeft[2], castlingLeft[3]);
                        } else if (elem == castlingRight[1]) {
                            castling(castlingRight[0], castlingRight[1], castlingRight[2], castlingRight[3]);
                        } else {
                            move(figure, elem);
                        }
                        result = [];
                        step == "white" ? step = "black" : step = "white";
                        if (!lastHorizontB && !lastHorizontW) {
                            // checking for check || mate
                            if (step == "black") {
                                result = test(table.querySelector('td[data-figure="bk"]'));
                                if (result[0] == "check") {
                                    check = true;
                                    historyW.lastChild.innerHTML += "+";
                                    info.innerHTML = '<h2 class="danger">Шах!</h2>';
                                } else if (result[0] == "mate") {
                                    mate = true;
                                    historyW.lastChild.innerHTML += "х";
                                    info.innerHTML = '<h2 class="danger">Чёрным мат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
                                } else if (result[0] == "jujube") {
                                    jujube = true;
                                    info.innerHTML = '<h2 class="info">Пат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
                                }  else {
                                    check = false;
                                }
                            } else if (step == "white") {
                                result = test(table.querySelector('td[data-figure="wk"]'));
                                if (result[0] == "check") {
                                    check = true;
                                    historyW.lastChild.innerHTML += "+";
                                    info.innerHTML = '<h2 class="danger">Шах!</h2>';
                                } else if (result[0] == "mate") {
                                    mate = true;
                                    historyW.lastChild.innerHTML += "х";
                                    info.innerHTML = '<h2 class="danger">Белым мат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
                                } else if (result[0] == "jujube") {
                                    jujube = true;
                                    info.innerHTML = '<h2 class="info">Пат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
                                }  else {
                                    check = false;
                                }
                            }
                        }
                        iiStep(result);
                    }
                });
            }
            castlingRight = [];
            castlingLeft = [];
            movesMb = [];
            moves = [];
            for (let x = 1; x < 9; x++) { // coloring table in default colors
                for (let y = 1; y < 9; y++) {
                    if (table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow != "") {
                        table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "";
                    }
                    if ((check || mate) && table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == step && (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "wk" || table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "bk")) {
                        table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(233, 65, 65, 0.5)";
                    } else if (jujube && table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == step && (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "wk" || table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "bk")) {
                        table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(0, 110, 255, 0.5)";
                    } else if (lastHorizontW) {
                        if (Math.abs(x - y) % 2 == 1 && elem.dataset.coordinates != `${x} ${y}`) {
                            table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(100, 55, 49)";
                        } else if (elem.dataset.coordinates != `${x} ${y}`) {
                            table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(253, 202, 153)";
                        } else {
                            elem.style.boxShadow = "inset 0 0 0 1000px rgba(0, 110, 255, 0.5)";
                        }
                    } else {
                        if (Math.abs(x - y) % 2 == 1) {
                            table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(100, 55, 49)";
                        } else {
                            table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(253, 202, 153)";
                        }
                    }
                }
            }
            if (result && result.length !== 0) {
                result.forEach((e) => {
                    if (elem.dataset.coordinates == `${e[0]} ${e[2]}`) { // if this figure can protect from check
                        canMove = true;
                        moveTo.push(`${e[4]} ${e[6]}`);
                    }
                    if (elem.dataset.coordinates + " open_gates" == e) { // if this figure is staying on way, in which black || white figure can make check
                        cantMove = true;
                        result.forEach((m) => {
                            if (m[18] == "e") {
                                openGatesMoves.push(m);
                            }
                        });
                    }
                });
            }
            if (elem.dataset.color == step && !check && !mate && !jujube && step == "white") { // if we clicked on figure
                movesMb = enableMoves(elem);
                if (cantMove == true) {
                    movesMb.forEach((e) => {
                        openGatesMoves.forEach((k) => {
                            if (e + " open_gates move" == k) {
                                moves.push(e);
                            }
                        });
                    });
                } else {
                    for (let i = 0; i < movesMb.length; i++) {
                        if (movesMb[i][4] == "o") {
                            movesMb.splice(i, 1); // deleting this element, because it contain letters
                            i--;
                        } else if (movesMb[i][4] == "c") { // castling
                            if (movesMb[i][13] == "r") {
                                if (step == "white") {
                                    castlingRight = [table.querySelector('td[data-figure="wk"]'), table.querySelector(`td[data-coordinates="${movesMb[i][0]} ${movesMb[i][2]}"]`), table.querySelectorAll('td[data-figure="wr"]')[1], table.querySelector(`td[data-coordinates="${+movesMb[i][0] - 1} ${movesMb[i][2]}"]`)];
                                } else {
                                    castlingRight = [table.querySelector('td[data-figure="bk"]'), table.querySelector(`td[data-coordinates="${movesMb[i][0]} ${movesMb[i][2]}"]`), table.querySelectorAll('td[data-figure="br"]')[1], table.querySelector(`td[data-coordinates="${+movesMb[i][0] - 1} ${movesMb[i][2]}"]`)];
                                }
                            } else if (movesMb[i][13] == "l") {
                                if (step == "white") {
                                    castlingLeft = [table.querySelector('td[data-figure="wk"]'), table.querySelector(`td[data-coordinates="${movesMb[i][0]} ${movesMb[i][2]}"]`), table.querySelectorAll('td[data-figure="wr"]')[0], table.querySelector(`td[data-coordinates="${+movesMb[i][0] + 1} ${movesMb[i][2]}"]`)];
                                } else {
                                    castlingLeft = [table.querySelector('td[data-figure="bk"]'), table.querySelector(`td[data-coordinates="${movesMb[i][0]} ${movesMb[i][2]}"]`), table.querySelectorAll('td[data-figure="br"]')[0], table.querySelector(`td[data-coordinates="${+movesMb[i][0] + 1} ${movesMb[i][2]}"]`)];
                                }
                            }
                            movesMb.splice(i, 1);
                            i--;
                        }
                    }
                    moves = movesMb;
                    if (castlingRight[1]) { // castling
                        moves.push(castlingRight[1].dataset.coordinates);
                    }
                    if (castlingLeft[1]) {
                        moves.push(castlingLeft[1].dataset.coordinates);
                    }
                }
                if (moves.length > 0) {
                    elem.style.boxShadow = "inset 0 0 0 1000px rgba(130, 255, 167, 0.55)";
                }
                color(moves); // coloring moves
                figure = elem;
            } else if (elem.dataset.color == step && check && (elem.dataset.figure == "wk" || elem.dataset.figure == "bk" || canMove) && step == "white") { // if check
                if (canMove && elem.dataset.figure !== "wk" && elem.dataset.figure !== "bk") {
                    movesMb = moveTo; // moves of this figure, by which it can protect from check
                } else {
                    movesMb = enableMoves(elem);
                }
                if (cantMove) {
                    movesMb.forEach((e) => {
                        openGatesMoves.forEach((k) => {
                            if (e + " open_gates move" == k) {
                                moves.push(e); // if this figure is staying on way, in which black || white figure can make check, this figure can move only in this way
                            }
                        });
                    });
                }
                else {
                    for (let i = 0; i < movesMb.length; i++) {
                        if (movesMb[i][4] == "o") {
                            movesMb.splice(i, 1); // deleting this element, because it contain letters
                            i--;
                        }
                    }
                    moves = movesMb;
                }
                if (moves.length > 0) {
                    elem.style.boxShadow = "inset 0 0 0 1000px rgba(130, 255, 167, 0.55)";
                }
                color(moves); // coloring moves
                figure = elem;
            }
        }
    }
});

document.querySelector('button#back').addEventListener('click', () => {
    if (hist.length != 0) {
        const last = hist.length - 1;
        const figure = table.querySelector(`td[data-coordinates="${hist[last][0]}"]`);
        const elem = table.querySelector(`td[data-coordinates="${hist[last][4]}"]`);
        figure.innerHTML = hist[last][3];
        figure.setAttribute('data-color', hist[last][1]);
        figure.setAttribute('data-figure', hist[last][2]);
        elem.innerHTML = hist[last][7];
        elem.setAttribute('data-color', hist[last][5]);
        elem.setAttribute('data-figure', hist[last][6]);
        if (table.querySelector('td[data-beaten-figure=""]') != null) {
            table.querySelector('td[data-beaten-figure=""]').removeAttribute('data-beaten-figure');
            table.querySelector('td[data-beaten-cell=""]').removeAttribute('data-beaten-cell');
        }
        if (hist[last][8] != "") {
            const beatenF = table.querySelector(`td[data-coordinates="${hist[last][8]}"]`);
            if (hist[last][11].length > 1) {
                beatenF.innerHTML = hist[last][11][0];
                beatenF.dataset.figure = hist[last][11][1];
                beatenF.dataset.color = hist[last][11][2];
            }
            beatenF.setAttribute('data-beaten-figure', "");
            table.querySelector(`td[data-coordinates="${hist[last][9]}"]`).setAttribute('data-beaten-cell', "");
        }
        if (hist[last][10][0] == "first-step") {
            figure.setAttribute('data-first-step', 'true');
        }
        if (hist[last][10][1] == "first-step") {
            elem.setAttribute('data-first-step', 'true');
        }
        if (hist[last].length > 12) {
            const riddle = table.querySelector(`td[data-coordinates="${hist[last][12]}"]`);
            const elemR = table.querySelector(`td[data-coordinates="${hist[last][16]}"]`);
            riddle.setAttribute('data-first-step', 'true');
            riddle.innerHTML = hist[last][15];
            riddle.setAttribute('data-color', hist[last][13]);
            riddle.setAttribute('data-figure', hist[last][14]);
            elemR.innerHTML = hist[last][19];
            elemR.setAttribute('data-color', hist[last][17]);
            elemR.setAttribute('data-figure', hist[last][18]);
        }
        hist.pop();
        step == "white" ? historyB.removeChild(historyB.lastChild) : historyW.removeChild(historyW.lastChild);
        step == "white" ? step = "black" : step = "white";
        table.scrollIntoView();
        table.parentNode.style.animationName = `${step}`;
        step == "white" ? table.parentNode.style.transform = 'none' : table.parentNode.style.transform = 'rotate(180deg)';
        table.parentNode.style.animationName = `${step}`;
        step == "white" ? table.parentNode.style.transform = 'none' : table.parentNode.style.transform = 'rotate(180deg)';
        if (step == "white") {
            table.querySelectorAll('td[data-color="white"] img').forEach((e) => {
                e.style.animationName = "white";
                e.style.transform = 'none';
            });
        } else {
            table.querySelectorAll('td[data-color="white"] img').forEach((e) => {
                e.style.animationName = "black";
                e.style.transform = 'rotate(180deg)';
            });
        }
        if (step == "black") {
            table.querySelectorAll('td[data-color="black"] img').forEach((e) => {
                e.style.animationName = "black";
                e.style.transform = 'rotate(180deg)';
            });
        } else {
            table.querySelectorAll('td[data-color="black"] img').forEach((e) => {
                e.style.animationName = "white";
                e.style.transform = 'none';
            });
        }
        info.innerHTML = "";
        if (step == "black") {
            result = test(table.querySelector('td[data-figure="bk"]'));
            if (result[0] == "check") {
                check = true;
                historyW.lastChild.innerHTML += "+";
                info.innerHTML = '<h2 class="danger">Шах!</h2>';
            } else if (result[0] == "mate") {
                mate = true;
                historyW.lastChild.innerHTML += "х";
                info.innerHTML = '<h2 class="danger">Чёрным мат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
            } else if (result[0] == "jujube") {
                jujube = true;
                info.innerHTML = '<h2 class="info">Пат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
            } else {
                jujube = false;
                mate = false;
                check = false;
            }
        } else {
            result = test(table.querySelector('td[data-figure="wk"]'));
            if (result[0] == "check") {
                check = true;
                historyB.lastChild.innerHTML += "+";
                info.innerHTML = '<h2 class="danger">Шах!</h2>';
            } else if (result[0] == "mate") {
                mate = true;
                historyB.lastChild.innerHTML += "х";
                info.innerHTML = '<h2 class="danger">Белым мат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
            } else if (result[0] == "jujube") {
                jujube = true;
                info.innerHTML = '<h2 class="info">Пат!</h2><a href="#" onclick="window.location.reload();">Переиграть</a>';
            } else {
                jujube = false;
                mate = false;
                check = false;
            }
        }
        for (let x = 1; x < 9; x++) { // coloring table in default colors
            for (let y = 1; y < 9; y++) {
                if (table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow != "") {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "";
                }
                if ((check || mate) && table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == step && (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "wk" || table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "bk")) {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(233, 65, 65, 0.5)";
                } else if (jujube && table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.color == step && (table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "wk" || table.querySelector(`td[data-coordinates="${x} ${y}"]`).dataset.figure == "bk")) {
                    table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.boxShadow = "inset 0 0 0 1000px rgba(0, 110, 255, 0.5)";
                } else {
                    if (Math.abs(x - y) % 2 == 1) {
                        table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(100, 55, 49)";
                    } else {
                        table.querySelector(`td[data-coordinates="${x} ${y}"]`).style.backgroundColor = "rgb(253, 202, 153)";
                    }
                }
            }
        }
    }
});