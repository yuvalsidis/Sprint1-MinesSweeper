'use strict'




const MINE = '💣'
const SMILEY = ['😃', '😲', '😒']
const WIN = '😎'
const MARK = '🧨'
const LEFTCLICK = 1
const RIGHTCLICK = 2
const negsAround = ['1️⃣', '2️⃣', '3️⃣']
const MINEBOMBED = '☠️'


var gCurrectLevel = null
var isOn = false
var gLose = false
var gWin = false
var gNumbersOfMines = null
var gNumbersOfEmptyCell = null
var gBoard = null
var gLives = 0

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
    renderMarkCount(gGame.markedCount)
    renderLivesCount(gLives)
    initVariables()
}

function initVariables() {
    gGame.shownCount = 0
    gGame.secPassed = 0
    isOn = true
    gLives = 2 // will change to 3 when have more mines
    gWin = false
    gLose = false
}

//build a board
function buildBoard() {
    const cols = gCurrectLevel.cols
    const rows = gCurrectLevel.rows
    const mines = gCurrectLevel.mines
    gGame.markedCount = gCurrectLevel.mines
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
    board[0][2].isShown = false
    board[1][3].isShown = false
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
                strHTML += `<td class="${className}"><button id="${cellId}"   
                onclick="onCellLeftClicked(this, ${i}, ${j})"
                oncontextmenu="onCellRightClicked(this, ${i}, ${j})" 
                class="cellButton"></button> 
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
    handleLeftClick(elCell, i, j)
}

function handleLeftClick(elCell, i, j) {
    const cell = gBoard[i][j]
    if(gLives === 0) return

    // need to add bombedMine in the same place
    if (cell.isMine) {
        //MODEL
        gLives--
        //DOM
        renderLivesCount(gLives)
        renderButton({ i: i, j: j }, MINEBOMBED)
    } else {
        if (cell.minesAroundCount > 0) {
            onCallShown(i, j)
        }
        else if (cell.minesAroundCount === 0) {
            expandShown(i, j)
        }
    }
    gLives === 0 ? handleLose(i,j) : null
}

function handleLose(i,j) {
    reavelAllMines(i,j)
    isOn = false


    //Restart button appear
    // pop up of loser for few seconds interval then hide it


}

function reavelAllMines(i,j) {
    for (var rows = 0; rows< gBoard.length; rows++) {
        for (var cols = 0; cols < gBoard[0].length; cols++) {
            const currCell = gBoard[rows][cols]
            if(currCell.isMine && !currCell.isShow){
                //MODEL
                currCell.isShow = true
                //DOM
                renderButton({ i: i, j: j }, MINE)
            }
        }
    }
}


function onCallShown(i, j) {
    const cell = gBoard[i][j]
    if (!cell.isShown && !cell.isMine && !cell.isMarked) {
        var value
        //model
        cell.isShown = true
        //dom
        switch (cell.minesAroundCount) {
            case 1:
                value = negsAround[0]
                break;
            case 2:
                value = negsAround[1]
                break;
            case 3:
                value = negsAround[2]
                break;
        }
        renderButton({ i: i, j: j }, value)
    }
}

function expandShown(rows, cols) {
    for (var i = rows - 1; i <= rows + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cols - 1; j <= cols + 1; j++) {
            if (i === rows && j === cols) continue
            if (j < 0 || j >= gBoard[0].length) continue
            const currCell = gBoard[i][j]
            if (currCell.minesAroundCount === 0) continue
            onCallShown(i, j)
        }
    }
}

function onCellRightClicked(elCell, i, j) {
    console.log(`right Click on cell ${i}, ${j}`)
    handleRightClick(elCell, i, j)
}

function handleRightClick(elCell, i, j) {
    onCelMarked(elCell, i, j)
}


function onCelMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    // if (cell.isMine === true && cell.isShown === true) return
    if (cell.isShown === true) return
    if (!cell.isMarked && !cell.isShow) {
        if (gGame.markedCount === 0) return
        //MODEL
        cell.isMarked = true
        //DOM
        renderButton({ i: i, j: j }, MARK)
        updateMarkCount(true)
        console.log(cell)
        console.log(gGame.markedCount)
    }
    else if (cell.isMarked && !cell.isShow) {
        //MODEL
        cell.isMarked = false
        //DOM
        renderButton({ i: i, j: j }, '')
        console.log(cell)
        console.log(gGame.markedCount)
        updateMarkCount(false)
    }


}


function updateMarkCount(condition) {
    if (condition) {
        //MODEL
        gGame.markedCount--
        //DOOM
        renderMarkCount(gGame.markedCount)
    }
    else {
        //MODEL
        gGame.markedCount++
        //GAME
        renderMarkCount(gGame.markedCount)
    }

}


function renderTime(value) {
    const elm = document.querySelector('.timeDisplay').querySelector('span')
    elm.innerHTML = value
}

function renderLivesCount(value) {
    const elm = document.querySelector('.livesCountDisplay').querySelector('span')
    elm.innerHTML = value
}

function renderMarkCount(value) {
    const elm = document.querySelector('.marksCountDisplay').querySelector('span')
    elm.innerHTML = value
}


function renderButton(location, value) {
    const tdElm = document.querySelector(`.cell-${location.i}-${location.j}`)
    const btn = tdElm.querySelector('button')
    btn.innerHTML = value
}


function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}



//Enable right click on the container
function enableRightClickOnContainer() {
    document.getElementById("container").addEventListener("contextmenu", function (event) {
        event.preventDefault();
    })

}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}
