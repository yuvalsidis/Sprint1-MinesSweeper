'use strict'




const MINE = '💣'
const SMILEY = ['😃', '😲', '😒']
const WIN = '😎'
const MARK = '🧨'
const LEFTCLICK = 1
const RIGHTCLICK = 2

var gCurrectLevel = null
var gIsGameOn = false
var gLose = false
var gWin = false
var gNumbersOfMines = null
var gNumbersOfEmptyCell = null
var gBoard = null

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0,
}



//init our game 
function onInit() {
    gCurrectLevel = levels[BEGINNERLEVEL]
    gBoard = buildBoard()
    setMinesNegsCount()
    console.log(gBoard)
    renderBoard()
    enableRightClickOnContainer()
}


//build a board
function buildBoard() {
    const cols = gCurrectLevel.cols
    const rows = gCurrectLevel.rows
    const mines = gCurrectLevel.mines
    const board = []
    for (var i = 0; i < rows; i++) {
        board.push([])
        for (var j = 0; j < cols; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            console.log(board[i][j])
        }
    }
    // Will Change to be Randomaly and not manually
    board[0][2].isMine = true
    board[1][3].isMine = true
    return board

}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const count = findMinesNegsCount(i, j)
            gBoard[i][j].minesAroundCount = count
        }
    }
}

function findMinesNegsCount(rows, cols) {
    var countMines = 0
    for (var i = rows - 1; i <= rows + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cols - 1; j <= cols + 1; j++) {
            if (i === rows && j === cols) continue
            if (j < 0 || j >= gBoard[0].length) continue
            const currCell = gBoard[i][j]
            currCell.isMine === true ? countMines++ : null
        }
    }
    return countMines
}



function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            const className = `cell cell-${i}-${j}`
            const cellId = makeId(length = 6)
            if (cell.isMine) {
                strHTML += `<td class="${className}">  <button id="${cellId}"   
                onclick="onLeftClicked(event, ${i}, ${j})"
                oncontextmenu="onCellRightClicked(event, ${i}, ${j})" 
                class="cellButton">${MINE}</button> 
                </td>`
                gNumbersOfMines++
            }
            else {
                strHTML += `<td class="${className}">  <button id="${cellId}"   
                onclick="onCellLeftClicked(this, ${i}, ${j})"
                oncontextmenu="onCellRightClicked(this, ${i}, ${j})" 
                class="cellButton"></button> 
                </td>`
            }

        }
        strHTML += '</tr>'
        const elContainer = document.querySelector('.board')
        elContainer.innerHTML = strHTML


    }
}



function onCellLeftClicked(elCell, i, j) {
    console.log(`left Click on cell ${i}, ${j}`)
    handleRightClick(elCell, i, j)

}

function onCellRightClicked(elCell, i, j) {
    console.log(`right Click on cell ${i}, ${j}`)
}

function handleRightClick(elCell, i, j) {
    onCelMarked(elCell, i, j)
}

function handleLeftClick() {
}

function onCelMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    const objectCell = {i : i, j: j}
    if (cell.isMarked === false && cell.isShown === false) {
        renderCell(objectCell, MARK)
    }

}





/*function onCellClicked(elCell, i, j) {

}*/


//Enable right click on the container
function enableRightClickOnContainer() {
    document.getElementById("container").addEventListener("contextmenu", function (event) {
        event.preventDefault();

    })

}
























function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}



function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}
