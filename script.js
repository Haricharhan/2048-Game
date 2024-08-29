document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');
    const resetButton = document.getElementById('resetButton');

    let squares = [];
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    highScoreDisplay.innerHTML = `High Score: ${highScore}`;

    function createBoard() {
        for (let i = 0; i < 16; i++) {
            let square = document.createElement('div');
            square.innerHTML = "";
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generateTwo();
        generateTwo();
    }
    createBoard();

    function generateTwo() {
        let random = Math.floor(Math.random() * squares.length);
        if (squares[random].innerHTML == "") {
            squares[random].innerHTML = 2;
            squares[random].setAttribute('data-value', '2');
            checkLose();
        } else {
            generateTwo();
        }
    }

    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [
                    parseInt(squares[i].innerHTML) || "",
                    parseInt(squares[i + 1].innerHTML) || "",
                    parseInt(squares[i + 2].innerHTML) || "",
                    parseInt(squares[i + 3].innerHTML) || ""
                ];

                let filteredRow = row.filter(x => x != "");
                let missing = 4 - filteredRow.length;
                let newRow = Array(missing).fill("").concat(filteredRow);

                for (let j = 0; j < 4; j++) {
                    squares[i + j].innerHTML = newRow[j];
                    squares[i + j].setAttribute('data-value', newRow[j] || "");
                }
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [
                    parseInt(squares[i].innerHTML) || "",
                    parseInt(squares[i + 1].innerHTML) || "",
                    parseInt(squares[i + 2].innerHTML) || "",
                    parseInt(squares[i + 3].innerHTML) || ""
                ];

                let filteredRow = row.filter(x => x != "");
                let missing = 4 - filteredRow.length;
                let newRow = filteredRow.concat(Array(missing).fill(""));

                for (let j = 0; j < 4; j++) {
                    squares[i + j].innerHTML = newRow[j];
                    squares[i + j].setAttribute('data-value', newRow[j] || "");
                }
            }
        }
    }

    function sumRow() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 !== 3 && squares[i].innerHTML == squares[i + 1].innerHTML && squares[i].innerHTML !== "") {
                let combinedNum = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
                squares[i].innerHTML = combinedNum;
                squares[i].setAttribute('data-value', combinedNum);
                squares[i + 1].innerHTML = "";
                squares[i + 1].setAttribute('data-value', "");
                score += combinedNum;
                scoreDisplay.innerHTML = score;
                updateHighScore();
            }
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let column = [
                parseInt(squares[i].innerHTML) || "",
                parseInt(squares[i + 4].innerHTML) || "",
                parseInt(squares[i + 8].innerHTML) || "",
                parseInt(squares[i + 12].innerHTML) || ""
            ];

            let filteredColumn = column.filter(x => x != "");
            let missing = 4 - filteredColumn.length;
            let newColumn = Array(missing).fill("").concat(filteredColumn);

            for (let j = 0; j < 4; j++) {
                squares[i + j * 4].innerHTML = newColumn[j];
                squares[i + j * 4].setAttribute('data-value', newColumn[j] || "");
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let column = [
                parseInt(squares[i].innerHTML) || "",
                parseInt(squares[i + 4].innerHTML) || "",
                parseInt(squares[i + 8].innerHTML) || "",
                parseInt(squares[i + 12].innerHTML) || ""
            ];

            let filteredColumn = column.filter(x => x != "");
            let missing = 4 - filteredColumn.length;
            let newColumn = filteredColumn.concat(Array(missing).fill(""));

            for (let j = 0; j < 4; j++) {
                squares[i + j * 4].innerHTML = newColumn[j];
                squares[i + j * 4].setAttribute('data-value', newColumn[j] || "");
            }
        }
    }

    function sumColumn() {
        for (let i = 0; i < 16; i++) {
            if (i < 12 && squares[i].innerHTML == squares[i + 4].innerHTML && squares[i].innerHTML !== "") {
                let combinedNum = parseInt(squares[i].innerHTML) + parseInt(squares[i + 4].innerHTML);
                squares[i].innerHTML = combinedNum;
                squares[i].setAttribute('data-value', combinedNum);
                squares[i + 4].innerHTML = "";
                squares[i + 4].setAttribute('data-value', "");
                score += combinedNum;
                scoreDisplay.innerHTML = score;
                updateHighScore();
            }
        }
    }

    function control(event) {
        if (event.keyCode === 39) {
            keyRight();
        } else if (event.keyCode === 37) {
            keyLeft();
        } else if (event.keyCode === 38) {
            keyUp();
        } else if (event.keyCode === 40) {
            keyDown();
        }
    }
    document.addEventListener('keyup', control);

    function keyRight() {
        moveRight();
        sumRow();
        moveRight();
        generateTwo();
        checkWin();
    }

    function keyLeft() {
        moveLeft();
        sumRow();
        moveLeft();
        generateTwo();
        checkWin();
    }

    function keyDown() {
        moveDown();
        sumColumn();
        moveDown();
        generateTwo();
        checkWin();
    }

    function keyUp() {
        moveUp();
        sumColumn();
        moveUp();
        generateTwo();
        checkWin();
    }

    function checkWin() {
        for (let i = 0; i < 16; i++) {
            if (squares[i].innerHTML == 2048) {
                alert('Congratulations!! You win! Refresh the page to play again.');
                document.removeEventListener('keyup', control);
            }
        }
    }

    function checkLose() {
        let numZeros = 0;
        for (let i = 0; i < 16; i++) {
            if (squares[i].innerHTML == "") {
                numZeros++;
            }
        }
        if (numZeros === 0) {
            let noMoves = true;
            for (let i = 0; i < 16; i++) {
                if ((i % 4 !== 3 && squares[i].innerHTML == squares[i + 1].innerHTML) || 
                    (i < 12 && squares[i].innerHTML == squares[i + 4].innerHTML)) {
                    noMoves = false;
                    break;
                }
            }
            if (noMoves) {
                alert('Game Over!! Refresh the page to play again.');
                document.removeEventListener('keyup', control);
            }
        }
    }

    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.innerHTML = `High Score: ${highScore}`;
        }
    }

    resetButton.addEventListener('click', () => {
        gridDisplay.classList.add('fade-out');
        setTimeout(() => {
            gridDisplay.innerHTML = '';
            squares = [];
            score = 0;
            scoreDisplay.innerHTML = score;
            createBoard();
            gridDisplay.classList.remove('fade-out');
            gridDisplay.classList.add('fade-in');
            setTimeout(() => {
                gridDisplay.classList.remove('fade-in');
            }, 500);
            document.addEventListener('keyup', control);
        }, 500);
    });
});