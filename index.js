window.onload = function() {
	const canvas = document.getElementById('game'),
	    ctx = canvas.getContext('2d'),
	    undo = document.getElementById('undo'),
	    forward = document.getElementById('forward'),
	    restart = document.getElementById('restart'),
	    widthOfCell = 40;

	let color = "#FFDEAD",
	    flag = true,
	    attempts = [],
	    figure = 0,
	    x = 0,
	    y = 0,
	    num = 2,
	    colorOfAttackPlayer = "white",
	    whiteKing = {},
	    blackKing = {},
	    changeX = 0,
	    changeY = 0,
	    changeFigure = 0,
	    flagOnCheck = false,
	    colorsForCheck = ["black", "white"],
	    flagForPawn = false,
	    arrFigures = 0,
	    figureColor = 0,
	    history = [],
	    countHistory = 1,
		king = 0,
	    flagForCheck = false,
	    flagForCheckmate = false;

	let arr = [["", "", "", "", "", "", "", ""],
	    ["", "", "", "", "", "", "", ""],
	    ["", "", "", "", "", "", "", ""],
	    ["", "", "", "", "", "", "", ""],
	    ["", "", "", "", "", "", "", ""],
	    ["", "", "", "", "", "", "", ""],
	    ["", "", "", "", "", "", "", ""],
	    ["", "", "", "", "", "", "", ""]];


	startGame();

	function startGame() {
	    drawBorderArray();
	    drawArray();

	    addFigures();
	    addFigures();
	    drawFigures();
			drawActivePlayer();
	    history.push(JSON.parse(JSON.stringify(arr)));
	}

	function drawActivePlayer() {
			document.getElementById('current-player').classList.remove('black');
			document.getElementById('current-player').classList.remove('white');

			document.getElementById('current-player').classList.add(colorOfAttackPlayer);
	}

	//drawing functions
	function drawBorderArray() {
		ctx.fillStyle = "#8B4513";
	    ctx.fillRect(0, 0, 380, 380);
	    ctx.fillStyle = "#e6bb7c";
	    ctx.fillRect(28, 28, 324, 324);

	    for (let i = 8; i >= 1; i--) {
	        ctx.fillStyle = "#e6bb7c";
	        ctx.font = "bold 30px serif";
	        ctx.fillText(i.toString(), 5, widthOfCell * 9 - i * widthOfCell + 20);
	    }
	    for (let i = 0; i < 8; i++) {
	        ctx.fillStyle = "#e6bb7c";
	        ctx.font = "bold 30px serif";
	        ctx.fillText(String.fromCharCode(65 + i), i * widthOfCell + widthOfCell, widthOfCell * 9 + 17);
	    }
	    for (let i = 8; i >= 1; i--) {
	        ctx.fillStyle = "#e6bb7c";
	        ctx.font = "bold 30px serif";
	        ctx.fillText(i.toString(), widthOfCell * 9, widthOfCell * 9 - i * widthOfCell + 20);
	    }
	    for (let i = 0; i < 8; i++) {
	        ctx.fillStyle = "#e6bb7c";
	        ctx.font = "bold 30px serif";
	        ctx.fillText(String.fromCharCode(65 + i), i * widthOfCell + widthOfCell, 25);
	    }
	}

	function drawArray(newState = false) {
	    for (let i = 0; i < 8; i++) {
	        if (color === "#8B4513") color = "#e6bb7c";
	        else color = "#8B4513";
	        for (let y = 0; y < 8; y++) {
	            if (color === "#8B4513") color = "#e6bb7c";
	            else color = "#8B4513";

	            ctx.fillStyle = color;
	            ctx.fillRect(i * widthOfCell + 30, y * widthOfCell + 30, widthOfCell, widthOfCell);
	        }
	    }

	    if (newState) history.length = countHistory;
	}

	function drawFigures() {
	    for (let i = 0; i < 8; i++) {
	        for (let k = 0; k < 8; k++) {
	            if (arr[i][k] !== "") {
	                ctx.fillStyle = arr[i][k].figureColor;
	                ctx.font = "bold 40px serif";
	                ctx.fillText(arr[i][k].figure, k * widthOfCell + 38, (i + 1) * widthOfCell + 25);
	            }
	        }
	    }

	}

	function drawPossibleAttempts(x, y) {
	    ctx.fillStyle = "rgba(124,252,0, 0.8)";
	    ctx.fillRect(x * widthOfCell + 30, y * widthOfCell + 30, widthOfCell, widthOfCell);
	}

	function addFigures() {
	    for (var i = 0; i < 8; i++) {
	        addFigure(i, 0, "rook", "black", "♜");
	        addFigure(i, 1, "rook", "black", "♜");
	        addFigure(i, 6, "rook", "white", "♖");
	        addFigure(i, 7, "rook", "white", "♖");
	    }
	}

	function addFigure(x, y, type, figureColor, figure) {
	    arr[y][x] = {
	        type: type,
	        figureColor: figureColor,
	        figure: figure,
	        attempts: possibleAttempts(x, y, type, figureColor)
	    };
	    if (figure === "♔") {
	        whiteKing.x = x;
	        whiteKing.y = y;
	    } else if (figure === "♚") {
	        blackKing.x = x;
	        blackKing.y = y;
	    }
	}

	function possibleAttempts(x, y, type, figureColor) {
	    attempts = [];

			possibleAttemptsForRook(x, y, type, figureColor);

	    return attempts;
	}


	function possibleAttemptsForRook(x, y, type, figureColor) {
	    for (let i = x + 1; i < 8; i++) {
	        if (arr[y][i] === "") {
	            addToAttempts(i, y);
	        } else {
	            if (arr[y][i].figureColor !== figureColor) addToAttempts(i, y);
	            break;
	        }
	    }
	    for (let i = x - 1; i >= 0; i--) {
	        if (arr[y][i] === "") {
	            addToAttempts(i, y);
	        } else {
	            if (arr[y][i].figureColor !== figureColor) addToAttempts(i, y);
	            break;
	        }
	    }
	    for (let i = y + 1; i < 8; i++) {
	        if (arr[i][x] === "") {
	            addToAttempts(x, i);
	        } else {
	            if (arr[i][x].figureColor !== figureColor) addToAttempts(x, i);
	            break;
	        }
	    }
	    for (let i = y - 1; i >= 0; i--) {
	        if (arr[i][x] === "") {
	            addToAttempts(x, i);
	        } else {
	            if (arr[i][x].figureColor !== figureColor) addToAttempts(x, i);
	            break;
	        }
	    }
	}

	function addToAttempts(x, y) {
	    attempts.push({
	        x: x,
	        y: y
	    });
	}

	function check(color, ...args) {
	    if (!args[0]) {
	        if (color === "white") {
	            let changeElement = colorsForCheck[0];
	            colorsForCheck[0] = colorsForCheck[1];
	            colorsForCheck[1] = changeElement;
	        }

	        if (color === "white") {
	            king = blackKing;
	        } else {
	            king = whiteKing;
	        }
	    } else {
	        if (color === "black") {
	            let changeElement = colorsForCheck[0];
	            colorsForCheck[0] = colorsForCheck[1];
	            colorsForCheck[1] = changeElement;
	        }
	    }

	    for (let l = 0; l < 8; l++) {
	        for (let k = 0; k < 8; k++) {
	            if (arr[l][k]) {
	                for (let j = 0; j < arr[l][k].attempts.length; j++) {
	                    if (arr[l][k].figureColor === colorsForCheck[0] && arr[l][k].attempts[j].x === king.x && arr[l][k].attempts[j].y === king.y) {
	                        flagForCheck = true;
	                        for (let q = 0; q < 8; q++) {
	                            for (let s = 0; s < 8; s++) {
	                                if (arr[q][s] && arr[q][s].figureColor === colorsForCheck[1]) {
	                                    for (let h = arr[q][s].attempts.length - 1; h >= 0; h--) {
	                                        changeX = arr[q][s].attempts[h].x;
	                                        changeY = arr[q][s].attempts[h].y;

	                                        if (arr[q][s].type === "king") {
	                                            king.x = changeX;
	                                            king.y = changeY;
	                                        }

	                                        changeFigure = arr[changeY][changeX];
	                                        arr[changeY][changeX] = arr[q][s];
	                                        arr[q][s] = "";

	                                        for (let d = 0; d < 8; d++) {
	                                            for (let n = 0; n < 8; n++) {
	                                                if (arr[d][n] && arr[d][n].figureColor === colorsForCheck[0]) {
	                                                    arr[d][n].attempts = possibleAttempts(n, d, arr[d][n].type, arr[d][n].figureColor);
	                                                    for (let p = 0; p < arr[d][n].attempts.length; p++) {
	                                                        if (arr[d][n].attempts[p].x === king.x && arr[d][n].attempts[p].y === king.y) {
	                                                            flagOnCheck = true;
	                                                        }
	                                                    }
	                                                }
	                                            }
	                                        }

	                                        arr[q][s] = arr[changeY][changeX];
	                                        arr[changeY][changeX] = changeFigure;

	                                        if (arr[q][s].type === "king") {
	                                            king.x = s;
	                                            king.y = q;
	                                        }

	                                        if (flagOnCheck) {
	                                            arr[q][s].attempts.splice(h, 1);
	                                            flagOnCheck = false;
	                                        }

	                                        for (let d = 0; d < 8; d++) {
	                                            for (let n = 0; n < 8; n++) {
	                                                if (arr[d][n] && arr[d][n].figureColor === colorsForCheck[0]) arr[d][n].attempts = possibleAttempts(n, d, arr[d][n].type, arr[d][n].figureColor);
	                                            }
	                                        }
	                                    }
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }
	    colorsForCheck = ["black", "white"];
	    checkmate(colorOfAttackPlayer, args[0]);
	}

	function checkmate(color, ...args) {
	    if (!args[0]) {
	        if (color === "black") {
	            color = "white";
	        } else {
	            color = "black";
	        }
	    }

	    for (let d = 0; d < 8; d++) {
	        for (let n = 0; n < 8; n++) {
	            if (flagForCheck && arr[d][n] && arr[d][n].figureColor === color && !arr[d][n].attempts.length) {
	                flagForCheckmate = true;
	            } else if (flagForCheck && arr[d][n] && arr[d][n].figureColor === color) {
	                flagForCheckmate = false;
	                flagForCheck = false;
	            }
	        }
	    }
	}

	function choiceForPawn(color) {
		let whiteFiguresForPawn = ["♖", "♘", "♗", "♕"],
	    	blackFiguresForPawn = ["♜", "♞", "♝", "♛"];

	    if (color === "black") {
	        arrFigures = blackFiguresForPawn;
	    } else {
	        arrFigures = whiteFiguresForPawn;
	    }

	    figureColor = color;

	    if (flagForPawn) {
	        ctx.fillStyle = "gray";
	        ctx.fillRect(2 * widthOfCell + 30, 2 * widthOfCell + 30, 4 * widthOfCell, 4 * widthOfCell);

	        ctx.fillStyle = color;
	        ctx.font = "bold 20px serif";
	        ctx.fillText("Wybierz figurę", 3 * widthOfCell - 20 + 30, 3 * widthOfCell + 30);

	        ctx.fillStyle = color;
	        ctx.font = "bold 40px serif";
	        ctx.fillText(arrFigures[0], 4 * widthOfCell + 30, 4 * widthOfCell + 30);

	        ctx.fillStyle = color;
	        ctx.font = "bold 40px serif";
	        ctx.fillText(arrFigures[1], 3 * widthOfCell + 30, 4 * widthOfCell + 30);

	        ctx.fillStyle = color;
	        ctx.font = "bold 40px serif";
	        ctx.fillText(arrFigures[2], 3 * widthOfCell + 30, 5 * widthOfCell + 30);

	        ctx.fillStyle = color;
	        ctx.font = "bold 40px serif";
	        ctx.fillText(arrFigures[3], 4 * widthOfCell + 30, 5 * widthOfCell + 30);
	    }
	}

	canvas.addEventListener('click', e => {
	    let cellX = ((e.layerX - 30) - (e.layerX - 30) % widthOfCell) / widthOfCell;
	    let cellY = ((e.layerY - 30) - (e.layerY - 30) % widthOfCell) / widthOfCell;
	    let type = 0;
	    if (flagForCheckmate) {}
	    else if (flagForPawn) {
	        let figure = 0;
	        if (cellY === 4 && cellX === 3) {
	            figure = arrFigures[2];
	            type = "elephant";
	        } else if (cellY === 3 && cellX === 3) {
	            figure = arrFigures[1];
	            type = "horse";
	        } else if (cellY === 3 && cellX === 4) {
	            figure = arrFigures[0];
	            type = "rook";
	        } else if (cellY === 4 && cellX === 4) {
	            figure = arrFigures[3];
	            type = "queen";
	        }

	        addFigure(changeX, changeY, type, figureColor, figure);

	        flagForPawn = false;

	        drawArray();
	        drawFigures();

	        check(colorOfAttackPlayer, true);

	        history.push(JSON.parse(JSON.stringify(arr)));

	        if (flagForCheckmate) {
	            ctx.fillStyle = "black";
	            ctx.font = "bold 60px serif";
	            ctx.fillText("Koniec gry", 13, 4 * widthOfCell + 10);
	        }
	    } else {
	        if (arr[cellY][cellX] && arr[cellY][cellX].figureColor === colorOfAttackPlayer) {
	            figure = arr[cellY][cellX];
	            x = cellX;
	            y = cellY;

	            flag = true;
	        } else {
	            flag = false;
	        }

	        if (!figure.attempts) {
	            figure = 0;
	        }

	        if (figure.figureColor !== colorOfAttackPlayer) {
	            figure = 0;
	        }

	        if (flag) {
	            drawArray();
	            drawFigures();
	            for (let i = 0; i < figure.attempts.length; i++) {
	                drawPossibleAttempts(figure.attempts[i].x, figure.attempts[i].y);
	            }
	        } else {
	            if (figure.attempts) {
	                for (let i = 0; i < figure.attempts.length; i++) {
	                    if (cellY === figure.attempts[i].y && cellX === figure.attempts[i].x) {
	                        if (figure.type === "pawn") {
	                            if (cellY === 0 || cellY === 7) {
	                                flagForPawn = true;
	                                changeX = cellX;
	                                changeY = cellY;
	                            }
	                        }

	                        if (figure.figure === "♔") {
	                            whiteKing.x = cellX;
	                            whiteKing.y = cellY;
	                        } else if (figure.figure === "♚") {
	                            blackKing.x = cellX;
	                            blackKing.y = cellY;
	                        }

	                        arr[cellY][cellX] = figure;
	                        arr[y][x] = "";

	                        for (let l = 0; l < 8; l++) {
	                            for (let k = 0; k < 8; k++) {
	                                if (arr[l][k]) {
	                                    arr[l][k].attempts = possibleAttempts(k, l, arr[l][k].type, arr[l][k].figureColor);
	                                }
	                            }
	                        }

	                        check(colorOfAttackPlayer);

	                        drawArray(true);
	                        drawFigures();

	                        choiceForPawn(colorOfAttackPlayer);

													countHistory++;
													history.push(JSON.parse(JSON.stringify(arr)));

	                        flagOnPossibleAttempts = true;

	                        figure = 0;
	                        flag = true;

	                        if (flagForCheckmate) {
	                            ctx.fillStyle = "black";
	                            ctx.font = "bold 60px serif";
	                            ctx.fillText("Game over", 13, 4 * widthOfCell + 10);
	                        }

	                        if (colorOfAttackPlayer === "white") {
														colorOfAttackPlayer = "black"
													}
	                    		else  {
														colorOfAttackPlayer = "white"
													}

													drawActivePlayer();
	                        break;
	                    }
	                }
	            }
	        }
	    }

			const whiteCount = arr.reduce((accI, i) => {
					const countInRow = i.reduce((accJ, j) => {
							if (!!j && j.figureColor === 'white') {
								return accJ + 1;
							}

							return accJ;
					}, 0);

					return accI + countInRow;
			}, 0);

			const blackCount = arr.reduce((accI, i) => {
					const countInRow = i.reduce((accJ, j) => {
							if (!!j && j.figureColor === 'black') {
								return accJ + 1;
							}

							return accJ;
					}, 0);

					return accI + countInRow;
			}, 0);

			setTimeout(() => {
					if ( whiteCount === 0 ) {
						alert('Zwyciężył czarny !');
					} else if (blackCount === 0) {
						alert('Zwyciężył biały !');
					}
			}, 0);
	});

	//add events for buttons
	undo.addEventListener('click', forUndo);
	forward.addEventListener('click', forForward);
	restart.addEventListener('click', forRestart);

	function forUndo() {
	    if (history[countHistory - 2]) {
			countHistory--;
	        arr = JSON.parse(JSON.stringify(history[countHistory - 1]));
	        if (colorOfAttackPlayer === "white") colorOfAttackPlayer = "black";
	        else colorOfAttackPlayer = "white";
	        drawArray();
	        drawFigures();
	        drawActivePlayer();
	    }
	}

	function forForward() {
	    if (history[countHistory]) {
	        arr = JSON.parse(JSON.stringify(history[countHistory]));
	        countHistory++;
	        if (colorOfAttackPlayer === "white") colorOfAttackPlayer = "black";
	        else colorOfAttackPlayer = "white";
	        drawArray();
	        drawFigures();
					drawActivePlayer();
	    }
	}

	function forRestart() {
	    if (confirm("Czy jesteś pewien?")) {
	        arr = [["", "", "", "", "", "", "", ""],
	            ["", "", "", "", "", "", "", ""],
	            ["", "", "", "", "", "", "", ""],
	            ["", "", "", "", "", "", "", ""],
	            ["", "", "", "", "", "", "", ""],
	            ["", "", "", "", "", "", "", ""],
	            ["", "", "", "", "", "", "", ""],
	            ["", "", "", "", "", "", "", ""]]
	        startGame();
	        colorOfAttackPlayer = "white";
					drawActivePlayer();
	    }
	}
};
