'use strict'

const MINE = '💣'
const RESTARTSMILEY = ['😃', '😲', '😒']
const WIN = '😎'
const MARK = '🚩'
const LEFTCLICK = 1
const RIGHTCLICK = 2
const negsAround = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
const MINEBOMBED = '☠️'
const MINEIFFLAGGED = '❌'
const HINT = '❓'
const EMPTYHINT = '❔'
const NIGHTMODE = '🌚'
const DAYMODE = '🌞'


var gCurrectLevel = null
var gIsOn = false
var gNumberOfMines = null
var gBoard = null
var gLives = 0
var gTimeIntervalID = null
var gColorBurlywood = '#deb887'
var gColorGray = '#808080'
var gIsFirstClick = false
var gHints = 3
var gClickedOnHint = false
var gIDforSeconds = null


var gGame = {
    gIsOn: false,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0,
}

function onInit() {
    initVariables()
    gCurrectLevel = levels[BEGINNERLEVEL]
    gBoard = buildBoard()
    renderBoard()
    enableRightClickOnContainer()
    renderMarkCount(gGame.markedCount)
    renderLivesCount(gLives)
    renderHints()
    renderRestartButton()
    renderNightMode()
}

function initVariables() {
    clearInterval(gTimeIntervalID)
    gIsFirstClick = false
    gGame.shownCount = 0
    gGame.secPassed = 0
    gIsOn = true
    gLives = 3
    gHints = 3
    gTimeIntervalID = setInterval(timeChange, 1000);
    gClickedOnHint = false
}

function buildBoard() {
    const cols = gCurrectLevel.cols
    const rows = gCurrectLevel.rows
    gNumberOfMines = gCurrectLevel.mines
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
        }
    }
    return board
}

function setMinesNegsCount(firstI, firstJ) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if(i === firstI && j === firstJ) continue
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
            strHTML += `<td class="${className}">  <button id="${cellId}"   
                onclick="onCellLeftClicked(this, ${i}, ${j})"
                oncontextmenu="onCellRightClicked(this, ${i}, ${j})" 
                class="cellButton"></button> 
                </td>`
        }
        strHTML += '</tr>'
        const elContainer = document.querySelector('.board')
        elContainer.innerHTML = strHTML
    }
}
function randomMines(firstI, firstJ) {
    const array = objectsCellPositionArray(firstI, firstJ)
    for (var idx = 0; idx < gNumberOfMines; idx++) {
        const randomCell = array[getRandomInt(0, array.length)]
        gBoard[randomCell.i][randomCell.j].isMine = true
    }
}

function objectsCellPositionArray(firstI,firstJ) {
    const array = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if(i === firstI && j === firstJ) continue
            array.push({ i: i, j: j })
        }
    }
    return array
}

function onCellLeftClicked(elCell, i, j) {

    console.log(`left Click on cell ${i}, ${j}`)
    handleLeftClick(elCell, i, j)
    gLives === 0 ? handleLose(elCell, i, j) : null
}

function handleLeftClick(elCell, i, j) {
    if (!gIsFirstClick) {
        randomMines(i, j)
        setMinesNegsCount(i,j)
        renderBoard()
        expandShown(i, j, elCell)
        const elbtn = getButtonElement({ i: i, j: j })
        elbtn.style.backgroundColor = gColorGray
        gIsFirstClick = true
    }
    if (gClickedOnHint) {
        toggleShowNighForASeconds(i, j, true)
         setTimeout(() => {
            toggleShowNighForASeconds(i, j, false) 
        }, 1000)
        gClickedOnHint = false
    }else{
        const cell = gBoard[i][j]
        if (gLives === 0) return
        elCell.style.backgroundColor = gColorGray
        if (cell.isMine) {
            //MODEL
            gLives--
            cell.isShow = true            // cell is shown?????????
            //DOM
            renderLivesCount(gLives)
            renderButton({ i: i, j: j }, MINEBOMBED)
        } else {
            if (cell.minesAroundCount > 0) {
                onCallShown(i, j)
            }
            else if (cell.minesAroundCount === 0) {
                expandShown(i, j, elCell)
            }
        }
    }
    
}

function handleLose(elCell, i, j) {
    gIsOn = false
    renderRestartButton()
    reavelAllMines(i, j, elCell)
    clearInterval(gTimeIntervalID)
}

function onClickRestart() {
    gIsOn = true
    onInit()
}

function reavelAllMines(i, j, elCell) {
    for (var rows = 0; rows < gBoard.length; rows++) {
        for (var cols = 0; cols < gBoard[0].length; cols++) {
            const currCell = gBoard[rows][cols]
            if (currCell.isMine && currCell.isMarked) {
                renderButton({ i: rows, j: cols }, MINEIFFLAGGED)
            } else
                if (currCell.isMine && !currCell.isShow) {
                    //MODEL
                    currCell.isShow = true
                    //DOM
                    const elbtn = getButtonElement({ i: rows, j: cols })
                    elbtn.style.backgroundColor = gColorGray
                    renderButton({ i: rows, j: cols }, MINE)

                }

        }
    }
}

function onCallShown(i, j) {
    const cell = gBoard[i][j]
    const elbtn = getButtonElement({ i: i, j: j })
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
            case 4:
                value = negsAround[3]
                break;
            case 5:
                value = negsAround[4]
                break;
            case 6:
                value = negsAround[5]
                break;
            case 7:
                value = negsAround[6]
                break;
            case 8:
                value = negsAround[7]
                break;


        }
        renderButton({ i: i, j: j }, value)
        elbtn.style.backgroundColor = gColorGray
    }
}

function expandShown(rows, cols, elCell) {
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
    handleRightClick(elCell, i, j)
}

function handleRightClick(elCell, i, j) {
    onCelMarked(elCell, i, j)
}

function onCelMarked(elCell, i, j) {
    if (gLives === 0) return
    const cell = gBoard[i][j]
    if (cell.isShown === true) return
    if (!cell.isMarked && !cell.isShow) {
        if (gGame.markedCount === 0) return
        //MODEL
        cell.isMarked = true
        //DOM
        renderButton({ i: i, j: j }, MARK)
        elCell.style.backgroundColor = gColorGray
        updateMarkCount(true)
        console.log(cell)
        console.log(gGame.markedCount)
    }
    else if (cell.isMarked && !cell.isShow) {
        //MODEL
        cell.isMarked = false
        //DOM
        elCell.style.backgroundColor = gColorBurlywood
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
        //DOOM
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

function getButtonElement(location) {
    const tdElm = document.querySelector(`.cell-${location.i}-${location.j}`)
    const btn = tdElm.querySelector('button')
    return btn
}

function renderCell(location, value) {

    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function enableRightClickOnContainer() {
    document.getElementById("container").addEventListener("contextmenu", function (event) {
        event.preventDefault();
    })
}

function timeChange() {
    //MODEL
    gGame.secPassed++

    //DOM
    renderTime(gGame.secPassed)
}

function renderRestartButton() {
    const elbtn = document.querySelector('.restartBtn')
    if (gIsOn === true) {
        elbtn.innerHTML = '😃'
    }
    if (gIsOn === false) {
        elbtn.innerHTML = '😒'
    }
}

function renderHints() {
    const elbtn = document.querySelector('.hintsBtn')
    elbtn.innerHTML = `${HINT}${HINT}${HINT}`

}


function clickOnHint() {
    gHints--
    if (gHints < 0) return
    const elbtn = document.querySelector('.hintsBtn')
    switch (gHints) {
        case 2:
            elbtn.innerHTML = `${HINT}${HINT}${EMPTYHINT}`
            break
        case 1:
            elbtn.innerHTML = `${HINT}${EMPTYHINT}${EMPTYHINT}`
            break
        case 0:
            elbtn.innerHTML = `${EMPTYHINT}${EMPTYHINT}${EMPTYHINT}`
            break
    }
    gClickedOnHint = true
}


function toggleShowNighForASeconds(rows, cols, condition) {
    for (var i = rows - 1; i <= rows + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cols - 1; j <= cols + 1; j++) {
            if (i === rows && j === cols) continue
            if (j < 0 || j >= gBoard[0].length) continue
            const currCell = gBoard[i][j]
            if(currCell.isMarked) continue
            const elbtn = getButtonElement({ i: i, j: j })
            //MODEL
            currCell.isShown = condition
            console.log(i, j,' is : ', currCell.isShown)
            //DOM
            if(condition){
                onCallShown(i, j)
            }
            else{
                renderButton({ i: i, j: j }, '')
                elbtn.style.backgroundColor = gColorBurlywood
            }
        }
    }
}


function renderNightMode() {
    const elbtn = document.querySelector('.nightModeBtn')
    elbtn.innerHTML = `${DAYMODE}`
}

function clickOnNightMode() {
    const elbtn = document.querySelector('.nightModeBtn')
    const elm = document.querySelector('body')
    if (elm.className === 'nightMode') {
        elm.className = 'DayMode'
        elbtn.innerHTML = '🌞'
    }
    else {
        elm.className = 'nightMode'
        elbtn.innerHTML = '🌚'
    }
}


function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}