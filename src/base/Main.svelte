<script lang="ts">
    import Board from '../components/board/Board.svelte'
    import InputMenu from '../components/inputMenu/InputMenu.svelte'

    let board: Board
    let mode: string

    function moveSelection(event) {
        if (event.key === 'ArrowLeft') {
            board.moveSelection('left')
        } else if (event.key === 'ArrowRight') {
            board.moveSelection('right')
        } else if (event.key === 'ArrowUp') {
            board.moveSelection('up')
        } else if (event.key === 'ArrowDown') {
            board.moveSelection('down')
        }
    }

    export function solveBoard() {
        board.solve()
    }

    export function resetBoard() {
        board.generateNewBoard()
    }
</script>

<svelte:window on:keydown={moveSelection} />
<section>
    <Board bind:this={board} />
    <InputMenu
        on:inputNumberClick={event => {
            board.updateBoard(event.detail.value, mode)
        }}
        on:eraseButtonClick={() => {
            board.updateBoard(-1, 'value')
        }}
        bind:mode
    />
</section>

<style lang="postcss">
    section {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        gap: var(--gap-l);
        padding-inline: var(--gap-l);
    }

    @media (max-width: 650px) {
        section {
            flex-direction: column;
        }
    }
</style>
