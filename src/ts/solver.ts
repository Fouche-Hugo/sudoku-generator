export function validChange(x: number, y: number, value: number, board: number[][]): boolean {
    // test for the line
    for(let i = 0;i < 9;i++) {
        if(board[y][i] === value) {
            return false
        }
    }

    // test for the column
    for(let i = 0;i < 9;i++) {
        if(board[i][x] === value) {
            return false
        }
    }

    // test for the subgrid
    const subgridX = Math.floor(x / 3)
    const subgridY = Math.floor(y / 3)
    for(let i = 0;i < 3;i++) {
        for(let j = 0;j < 3;j++) {
            if(board[subgridY * 3 + i][subgridX * 3 + j] === value) {
                return false
            }
        }
    }

    return true;
}

export function nextEmptyPosition(x: number, y: number, board: number[][]): [number, number] {
    while(y < 9) {
        if(board[y][x] === -1) {
            return [x, y]
        }

        x++;

        if(x === 9) {
            x = 0
            y++
        }
    }

    return [x, y]
}

function sudokuCorrectlySolved(board: number[][]): boolean {
    for(let i = 0;i < 9;i++) {
        for(let j = 0;j < 9;j++) {
            if(board[i][j] === -1) {
                return false
            }
        }
    }

    return true
}

function solverBacktrack(x: number, y: number, board: number[][]): boolean {
    const [newX, newY] = nextEmptyPosition(x, y, board)

    if(newY === 9) {
        return true
    }

    for(let i = 1;i < 10;i++) {
        const newValue = i
        if(validChange(newX, newY, newValue, board)) {
            board[newY][newX] = newValue
            if(solverBacktrack(newX, newY, board)) {
                return true
            }
            board[newY][newX] = -1
        }
    }

    return false
}

export function solveSudoku(board: number[][]): void {
    solverBacktrack(0, 0, board)
}
/*
GENERATION ALGORITHM
*/

let solutionsCounter = 0
function counterBacktrack(x: number, y: number, board: number[][]) {
    const [newX, newY] = nextEmptyPosition(x, y, board)

    if(newY === 9) {
        solutionsCounter++
        if(solutionsCounter > 2) {
            return true
        }
        return false
    }

    for(let i = 1;i < 10;i++) {
        const newValue = i
        if(validChange(newX, newY, newValue, board)) {
            board[newY][newX] = newValue
            if(counterBacktrack(newX, newY, board)) {
                return true
            }
            board[newY][newX] = -1
        }
    }

    return false
}

function sudokuHasUniqueSolution(board: number[][]) {
    solutionsCounter = 0
    counterBacktrack(0, 0, JSON.parse(JSON.stringify(board)))
    return solutionsCounter === 1
}

function positionsList(): [number, number][] {
    const positions: [number, number][] = []
    for(let i = 0;i < 9;i++) {
        for(let j = 0;j < 9;j++) {
            positions.push([i, j])
        }
    }
    return positions
}

function randomInitialisation(board: number[][], amount: number): void {
    let positions = positionsList()
    for(let i = 0;i < amount;i++) {
        let positionIndex = Math.floor(Math.random() * positions.length)
        let x = positions[positionIndex][0]
        let y = positions[positionIndex][1]
        let value = Math.floor(Math.random() * 9 + 1)

        while(!validChange(x, y, value, board)) {
            positionIndex = Math.floor(Math.random() * positions.length)
            x = positions[positionIndex][0]
            y = positions[positionIndex][1]
            value = Math.floor(Math.random() * 9 + 1)
        }

        board[y][x] = value
        positions.splice(positionIndex, 1)
    }
}

function emptySudoku(board: number[][], objective: number, time: number): void {
    let positions = positionsList()
    let startingTime = Date.now()
    for(let i = 0;i < 81 - objective;i++) {
        let positionIndex = Math.floor(Math.random() * positions.length)
        let x = positions[positionIndex][0]
        let y = positions[positionIndex][1]
        
        let previousValue = board[y][x]
        board[y][x] = -1

        let hasUniqueSolution = sudokuHasUniqueSolution(board)

        while(!hasUniqueSolution) {
            if(time !== -1 && Date.now() - startingTime > time) {
                return
            }
            board[y][x] = previousValue

            positionIndex = Math.floor(Math.random() * positions.length)
            x = positions[positionIndex][0]
            y = positions[positionIndex][1]
            
            previousValue = board[y][x]
            board[y][x] = -1

            hasUniqueSolution = sudokuHasUniqueSolution(board)
        }
        positions.splice(positionIndex, 1)
    }
}

function initSudoku(): [number, number, number, number, number, number, number, number, number][] {
    const board: [number, number, number, number, number, number, number, number, number][] = []
    for(let i = 0;i < 9;i++) {
        board.push([-1, -1, -1, -1, -1, -1, -1, -1, -1])
    }
    return board
}

function numberOfFilledPositions(board: number[][]): number {
    let counter = 0
    for(let i = 0;i < 9;i++) {
        for(let j = 0;j < 9;j++) {
            if(board[i][j] !== -1) {
                counter++
            }
        }
    }
    return counter
}

export async function generateSudoku(objective: number, timeout: number): Promise<[number, number, number, number, number, number, number, number, number][]> {
    let board = initSudoku()
    
    let fullGridCorrect = false

    while(!fullGridCorrect) {
        board = initSudoku()
        
        randomInitialisation(board, 20)

        solveSudoku(board)

        if(sudokuCorrectlySolved(board)) {
            fullGridCorrect = true
        }
    }

    let numberOfFilledPositionsCorrect = false
    let boardCopy = JSON.parse(JSON.stringify(board))

    while(!numberOfFilledPositionsCorrect) {
        emptySudoku(board, objective, timeout)
        if(numberOfFilledPositions(board) === objective && sudokuHasUniqueSolution(board)) {
            numberOfFilledPositionsCorrect = true
        } else {
            board = JSON.parse(JSON.stringify(boardCopy))
        }
    }

    return board
}