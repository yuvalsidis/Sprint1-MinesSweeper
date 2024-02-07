'use strict'



const RIGHTCLICK = 1
const LEFTCLICK = 3
const MINE = '💣'
const SMILEY = ['😃', '😲', '😒']
const WIN = '😎'


var gCurrectLevel = null
var gIsGameOn = false
var gLose = false
var gWin = false
var gNumbersOfMines = null
var gNumbersOfEmptyCell = null
var gBoard = null




//init our game 
function onInit() {
    gCurrectLevel = levels[BEGINNERLEVEL]
    gBoard = buildBoard()
    setMinesNegsCount()
    console.log(gBoard)
    //renderBoard()
}

//build a board
function buildBoard() {
    const cols = gCurrectLevel.cols
    const rows = gCurrectLevel.rows
    const mines = gCurrectLevel.mines
    const board = []

    for (var i = 0; i < rows ; i++){
        board.push([])
        for(var j = 0; j < cols; j++){
            board[i][j] =  { 
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
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0; j < gBoard[0].length; j++){
            const count = findMinesNegsCount(i,j)
            gBoard[i][j].minesAroundCount = count
        }
    }
}

function findMinesNegsCount(rows,cols){
    var countMines = 0

    for (var i = rows - 1; i <= rows + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cols - 1; j <= cols+ 1; j++) {
            if(i === rows && j === cols) continue
            if (j < 0 || j >= gBoard[0].length) continue
            const currCell = gBoard[i][j]
            currCell.isMine === true? countMines++ : null 
        }
    }
    return countMines
}











