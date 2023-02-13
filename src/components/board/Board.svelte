<script lang="ts">
    import BoardLoader from './BoardLoader.svelte'
    import BoardSquare, {
        eraseAll,
        getCurrentLine,
        getCurrentColumn,
        isSelected,
        moveLeft,
        moveRight,
        moveUp,
        moveDown,
        resetAll
    } from './BoardSquare.svelte'
    import { solveSudoku } from '../../ts/solver'
    import { generateSudoku } from '../../ts/generator'
    import { onMount } from 'svelte'

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

    for (let i = 0; i < 9; i++) {
        board.push([0, 0, 0, 0, 0, 0, 0, 0, 0])
    }

    // board = board = [
    //     [5, 3, -1, -1, 7, -1, -1, -1, -1],
    //     [6, -1, -1, 1, 9, 5, -1, -1, -1],
    //     [-1, 9, 8, -1, -1, -1, -1, 6, -1],
    //     [8, -1, -1, -1, 6, -1, -1, -1, 3],
    //     [4, -1, -1, 8, -1, 3, -1, -1, 1],
    //     [7, -1, -1, -1, 2, -1, -1, -1, 6],
    //     [-1, 6, -1, -1, -1, -1, 2, 8, -1],
    //     [-1, -1, -1, 4, 1, 9, -1, -1, 5],
    //     [-1, -1, -1, -1, 8, -1, -1, 7, 9],
    // ]

    // create a copy of board
    let originalBoard: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ][] = JSON.parse(JSON.stringify(board))

    let loading: boolean = true
    export async function generateNewBoard() {
        loading = true
        resetAll()
        generateSudoku(20 + Math.floor(Math.random() * 20), 10000).then(async (newBoard) => {
            board = newBoard
            originalBoard = JSON.parse(JSON.stringify(board))
            loading = false
            setEditables()
            resetWrong()
            resetNotes()
            hasWin = false
            hasSolved = false
        })
    }

    let editables: [
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
    ][] = []

    function setEditables() {
        editables = []
        for (let i = 0; i < 9; i++) {
            const row: [
                boolean,
                boolean,
                boolean,
                boolean,
                boolean,
                boolean,
                boolean,
                boolean,
                boolean,
            ] = [false, false, false, false, false, false, false, false, false]
            for (let j = 0; j < 9; j++) {
                row[j] = board[i][j] === -1
            }
            editables.push(row)
        }
    }

    const wrong: [
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
    ] = [false, false, false, false, false, false, false, false, false]

    function resetWrong() {
        for (let i = 0; i < 9; i++) {
            wrong[i] = false
        }
    }

    let notes: boolean[][][] = []
    function resetNotes() {
        notes = []
        for (let i = 0; i < 9; i++) {
            notes.push([])
            for (let j = 0; j < 9; j++) {
                notes[i].push([])
                for (let k = 0; k < 9; k++) {
                    notes[i][j].push(false)
                }
            }
        }
    }

    function verifBoard() {
        // reset wrong
        for (let i = 0; i < 9; i++) {
            wrong[i] = false
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== 0) {
                    for (let k = 0; k < 9; k++) {
                        if (k !== j && board[i][k] === board[i][j]) {
                            wrong[board[i][j] - 1] = true
                        }
                        if (k !== i && board[k][j] === board[i][j]) {
                            wrong[board[i][j] - 1] = true
                        }
                    }
                    const line = Math.floor(i / 3) * 3
                    const column = Math.floor(j / 3) * 3
                    for (let k = 0; k < 3; k++) {
                        for (let l = 0; l < 3; l++) {
                            if (
                                line + k !== i &&
                                column + l !== j &&
                                board[line + k][column + l] === board[i][j]
                            ) {
                                wrong[board[i][j] - 1] = true
                            }
                        }
                    }
                }
            }
        }
    }

    function verifNoWrong() {
        for (let i = 0; i < 9; i++) {
            if (wrong[i]) {
                return false
            }
        }
        return true
    }

    let hasWin: boolean = false
    function verifBoardFull() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === -1) {
                    return false
                }
            }
        }
        return true
    }

    // function setNoEditable() {
    //     for (let i = 0; i < 9; i++) {
    //         for (let j = 0; j < 9; j++) {
    //             editables[i][j] = false
    //         }
    //     }
    // }

    export function moveSelection(direction: string) {
        if (direction === 'left') {
            moveLeft()
        } else if (direction === 'right') {
            moveRight()
        } else if (direction === 'up') {
            moveUp()
        } else if (direction === 'down') {
            moveDown()
        }
    }

    export function updateBoard(value: number, mode: string) {
        if (isSelected() && mode === 'value' && !hasWin && !hasSolved) {
            if (editables[getCurrentLine()][getCurrentColumn()]) {
                board[getCurrentLine()][getCurrentColumn()] = value
                verifBoard()
                if (verifNoWrong()) {
                    if (verifBoardFull()) {
                        hasWin = true
                    }
                }
            }
        } else if (isSelected()) {
            notes[getCurrentLine()][getCurrentColumn()][value - 1] =
                !notes[getCurrentLine()][getCurrentColumn()][value - 1]
        }
    }

    let hasSolved: boolean = false

    let differences: [
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
    ][] = []
    initializeDifferences()

    function initializeDifferences() {
        differences = []
        for (let i = 0; i < 9; i++) {
            differences.push([
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ])
        }
    }

    export function solve() {
        if (!hasSolved) {
            hasSolved = true

            solveSudoku(originalBoard)

            // check differences between board and solved board
            initializeDifferences()
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (board[i][j] !== originalBoard[i][j]) {
                        differences[i][j] = true
                    }
                }
            }

            board = originalBoard
        }
    }

    onMount(() => {
        generateNewBoard()
    })
</script>

{#if loading}
    <BoardLoader />
{:else}
    <div class="container">
        <div class="board" class:has-win={hasWin} on:mouseleave={eraseAll}>
            {#each board as row, i}
                {#each row as square, j}
                    <BoardSquare
                        value={square}
                        placement={9 * i + j}
                        notes={notes[i][j]}
                        editable={editables[i][j]}
                        wrong={wrong[square - 1]}
                        difference={differences[i][j]}
                    />
                {/each}
            {/each}
        </div>
        {#if hasWin}
            <div class="text">Félicitations, vous avez gagné !</div>
        {:else if hasSolved}
            <div class="text solution">Voici la solution</div>
        {/if}
    </div>
{/if}

<style lang="postcss">
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--gap-m);
        width: max(25%, 450px);
    }

    .board {
        display: grid;
        grid-template-rows: repeat(9, 1fr);
        grid-template-columns: repeat(9, 1fr);
        border: 1px solid var(--white);
        border-radius: var(--border-radius);
        aspect-ratio: 1;
        width: 100%;

        &.has-win {
            border-color: var(--blue-green);
        }
    }

    .text {
        font-size: var(--font-size-xl);
        text-align: center;
    }

    @media (max-width: 600px) {
        .container {
            width: min(450px, 100%);
        }
    }
</style>
