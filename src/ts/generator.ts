import { solveSudoku, nextEmptyPosition, validChange } from './solver'

let solutionsCounter: number = 0
const timeoutAsync = (ms: number) => new Promise(res => setTimeout(res, ms))
async function counterBacktrack(
    x: number,
    y: number,
    board: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ][],
): Promise<boolean> {
    const [newX, newY] = nextEmptyPosition(x, y, board)

    if (newY === 9) {
        solutionsCounter++
        if (solutionsCounter === 2) {
            return true
        }
        return false
    }

    for (let i = 1; i < 10; i++) {
        const newValue = i
        if (validChange(newX, newY, newValue, board)) {
            board[newY][newX] = newValue
            const result = await counterBacktrack(newX, newY, board)
                if (result) {
                    return true
                }
                board[newY][newX] = -1
        }
    }

    return false
}

async function sudokuHasUniqueSolution(
    board: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ][],
): Promise<boolean> {
        await timeoutAsync(10)
        solutionsCounter = 0
        await counterBacktrack(0, 0, JSON.parse(JSON.stringify(board)))
        
        return solutionsCounter === 1
}

function positionsList(): [number, number][] {
    const positions: [number, number][] = []
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            positions.push([i, j])
        }
    }
    return positions
}

function randomInitialisation(
    board: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ][],
    amount: number,
): void {
    let positions = positionsList()
    for (let i = 0; i < amount; i++) {
        let positionIndex = Math.floor(Math.random() * positions.length)
        let x = positions[positionIndex][0]
        let y = positions[positionIndex][1]
        let value = Math.floor(Math.random() * 9 + 1)

        while (!validChange(x, y, value, board)) {
            positionIndex = Math.floor(Math.random() * positions.length)
            x = positions[positionIndex][0]
            y = positions[positionIndex][1]
            value = Math.floor(Math.random() * 9 + 1)
        }

        board[y][x] = value
        positions.splice(positionIndex, 1)
    }
}

async function emptySudoku(
    board: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ][],
    objective: number,
    time: number,
): Promise<void> {
    let positions = positionsList()
    let startingTime = Date.now()

    for (let i = 0; i < 81 - objective; i++) {
        let positionIndex = Math.floor(Math.random() * positions.length)
        let x = positions[positionIndex][0]
        let y = positions[positionIndex][1]

        let previousValue = board[y][x]
        board[y][x] = -1

        let hasUniqueSolution = await sudokuHasUniqueSolution(board)

        while (!hasUniqueSolution) {
            if (time !== -1 && Date.now() - startingTime > time) {
                console.log('Time out')
                return
            }
            board[y][x] = previousValue

            positionIndex = Math.floor(Math.random() * positions.length)
            x = positions[positionIndex][0]
            y = positions[positionIndex][1]

            previousValue = board[y][x]
            board[y][x] = -1

            hasUniqueSolution = await sudokuHasUniqueSolution(board)
        }
        positions.splice(positionIndex, 1)
    }
}

function initSudoku(): [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
][] {
    const board: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ][] = []
    for (let i = 0; i < 9; i++) {
        board.push([-1, -1, -1, -1, -1, -1, -1, -1, -1])
    }
    return board
}

function numberOfFilledPositions(
    board: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ][],
): number {
    let counter = 0
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== -1) {
                counter++
            }
        }
    }
    return counter
}

function sudokuCorrectlySolved(
    board: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ][],
): boolean {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === -1) {
                return false
            }
        }
    }

    return true
}

export async function generateSudoku(
    objective: number,
    timeout: number,
): Promise<
    [number, number, number, number, number, number, number, number, number][]
> {
    return new Promise(async (resolve, reject) => {
        let board: [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
        ][] = []

        // wait for 100ms to let svelte update the DOM
        await timeoutAsync(100)
        let fullGridCorrect = false

        while (!fullGridCorrect) {
            board = initSudoku()

            randomInitialisation(board, 20)

            await timeoutAsync(10)
            solveSudoku(board)

            if (sudokuCorrectlySolved(board)) {
                fullGridCorrect = true
            }
        }

        let numberOfFilledPositionsCorrect = false
        let boardCopy: number[][] = JSON.parse(JSON.stringify(board))
        let numberOfTimeouts = 0

        while (!numberOfFilledPositionsCorrect) {
            await timeoutAsync(10)
            await emptySudoku(board, objective, timeout)

            const uniqueSolution = await sudokuHasUniqueSolution(board)

            if (
                numberOfFilledPositions(board) === objective &&
                uniqueSolution
            ) {
                numberOfFilledPositionsCorrect = true
            } else {
                board = JSON.parse(JSON.stringify(boardCopy))
                numberOfTimeouts++
                if (numberOfTimeouts > 2) {
                    numberOfFilledPositionsCorrect = true
                }
            }
        }
        if (numberOfTimeouts > 2) {
            board = await generateSudoku(objective, timeout)
        }
        resolve(board)
    })
}

// console.log('Test')
// // create a board that has more than one solution
// const board: [
//     number,
//     number,
//     number,
//     number,
//     number,
//     number,
//     number,
//     number,
//     number,
// ][] = [
//     [-1, 6, -1, 5, -1, 4, -1, -1, -1],
//     [-1, -1, 2, -1, 1, -1, -1, -1, -1],
//     [-1, -1, -1, -1, -1, -1, 1, 9, -1],
//     [-1, -1, 4, -1, -1, -1, 7, 6, -1],
//     [8, -1, -1, -1, 3, -1, -1, 1, -1],
//     [-1, -1, -1, 6, 7, -1, -1, -1, -1],
//     [-1, 2, -1, 7, -1, -1, 8, -1, -1],
//     [3, 5, -1, 9, 4, 8, 6, -1, -1],
//     [-1, -1, 8, 2, -1, -1, 5, -1, -1]]


// const boardUniqueSolution: [
//     number,
//     number,
//     number,
//     number,
//     number,
//     number,
//     number,
//     number,
//     number,
// ][] = [[5,3,-1,-1,7,-1,-1,-1,-1],
//     [6,-1,-1,1,9,5,-1,-1,-1],
//     [-1,9,8,-1,-1,-1,-1,6,-1],
//     [8,-1,-1,-1,6,-1,-1,-1,3],
//     [4,-1,-1,8,-1,3,-1,-1,1],
//     [7,-1,-1,-1,2,-1,-1,-1,6],
//     [-1,6,-1,-1,-1,-1,2,8,-1],
//     [-1,-1,-1,4,1,9,-1,-1,5],
//     [-1,-1,-1,-1,8,-1,-1,7,9]]

// sudokuHasUniqueSolution(board).then((result) => {
//     console.log(result)
// })


// sudokuHasUniqueSolution(boardUniqueSolution).then((result) => {
//     console.log(result)
// })