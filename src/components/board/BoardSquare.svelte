<script context="module" lang="ts">
    import { onMount } from 'svelte'

    let current: HTMLButtonElement
    let currentLine: number
    let currentColumn: number

    let currentClicked: HTMLButtonElement
    let currentLineClicked: number
    let currentColumnClicked: number

    const elements: HTMLButtonElement[] = []

    export function resetAll() {
        current = undefined
        currentLine = undefined
        currentColumn = undefined

        currentClicked = undefined
        currentLineClicked = undefined
        currentColumnClicked = undefined

        elements.length = 0
    }

    export function eraseAll() {
        for (let i = 0; i < elements.length; i++) {
            const line = Math.floor(i / 9)
            const column = i % 9
            if (line === currentLineClicked || column === currentColumnClicked)
                continue
            elements[i].style.backgroundColor = 'transparent'
        }

        if (
            current &&
            current !== currentClicked &&
            (currentLine === currentLineClicked ||
                currentColumn === currentColumnClicked)
        ) {
            current.style.backgroundColor = 'var(--violet15)'
        }
    }

    export function getCurrentLine() {
        return currentLineClicked
    }

    export function getCurrentColumn() {
        return currentColumnClicked
    }

    export function isSelected() {
        return currentClicked !== undefined
    }

    export function moveLeft() {
        if(isSelected()) {
            if(currentColumnClicked === 0) return
            elements[currentColumnClicked - 1 + 9 * currentLineClicked].click()
        }
    }

    export function moveRight() {
        if(isSelected()) {
            if(currentColumnClicked === 8) return
            elements[currentColumnClicked + 1 + 9 * currentLineClicked].click()
        }
    }

    export function moveUp() {
        if(isSelected()) {
            if(currentLineClicked === 0) return
            elements[currentColumnClicked + 9 * (currentLineClicked - 1)].click()
        }
    }

    export function moveDown() {
        if(isSelected()) {
            if(currentLineClicked === 8) return
            elements[currentColumnClicked + 9 * (currentLineClicked + 1)].click()
        }
    }
</script>

<script lang="ts">
    export let value: number = -1
    export let placement: number = -1
    export let editable: boolean = false
    export let wrong: boolean = false
    export let difference: boolean = false

    let mode: string
    $: mode = value === -1 ? 'notes' : 'value'
    export let notes: boolean[] = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]

    let button: HTMLButtonElement

    const line = Math.floor(placement / 9)
    const column = placement % 9

    onMount(() => {
        elements.push(button)
    })

    function handleMouseOver() {
        eraseOthers()

        for (let i = 0; i < 9; i++) {
            if (i === currentColumnClicked && line === currentLineClicked)
                continue
            elements[i + 9 * line].style.backgroundColor = 'var(--violet15)'
        }

        for (let i = 0; i < 9; i++) {
            if (i === currentLineClicked && column === currentColumnClicked)
                continue
            elements[9 * i + column].style.backgroundColor = 'var(--violet15)'
        }

        button.style.backgroundColor = 'var(--violet50)'

        currentLine = line
        currentColumn = column
    }

    function eraseOthers() {
        if (current && current !== button) {
            if (current !== currentClicked)
                current.style.backgroundColor = 'transparent'

            if (currentLine !== currentLineClicked) {
                for (let i = 0; i < 9; i++) {
                    if (i === currentColumnClicked) continue
                    elements[i + 9 * currentLine].style.backgroundColor =
                        'transparent'
                }
            }

            if (currentColumn !== currentColumnClicked) {
                for (let i = 0; i < 9; i++) {
                    if (i === currentLineClicked) continue
                    elements[9 * i + currentColumn].style.backgroundColor =
                        'transparent'
                }
            }
        }
        current = button
    }

    function handleMouseClick() {
        eraseOthersClicked()

        for (let i = 0; i < 9; i++) {
            elements[i + 9 * line].style.backgroundColor = 'var(--violet15)'
            if (line > 0) {
                elements[i + 9 * line].style.borderTopColor = 'var(--violet)'
            }
            if (line < 8) {
                elements[i + 9 * (line + 1)].style.borderTopColor =
                    'var(--violet)'
            }
        }

        for (let i = 0; i < 9; i++) {
            elements[9 * i + column].style.backgroundColor = 'var(--violet15)'
            if (column > 0) {
                elements[9 * i + column].style.borderLeftColor = 'var(--violet)'
            }
            if (column < 8) {
                elements[9 * i + (column + 1)].style.borderLeftColor =
                    'var(--violet)'
            }
        }

        button.style.backgroundColor = 'var(--violet50)'
        currentClicked = button
        currentLineClicked = line
        currentColumnClicked = column
    }

    function eraseOthersClicked() {
        if (currentClicked && currentClicked !== button) {
            currentClicked.style.backgroundColor = 'transparent'

            for (let i = 0; i < 9; i++) {
                elements[i + 9 * currentLineClicked].style.backgroundColor =
                    'transparent'
                if (currentLineClicked > 0) {
                    elements[i + 9 * currentLineClicked].style.borderTopColor =
                        'var(--white)'
                }
                if (currentLineClicked < 8) {
                    elements[
                        i + 9 * (currentLineClicked + 1)
                    ].style.borderTopColor = 'var(--white)'
                }
            }

            for (let i = 0; i < 9; i++) {
                elements[9 * i + currentColumnClicked].style.backgroundColor =
                    'transparent'
                if (currentColumnClicked > 0) {
                    elements[
                        9 * i + currentColumnClicked
                    ].style.borderLeftColor = 'var(--white)'
                }
                if (currentColumnClicked < 8) {
                    elements[
                        9 * i + (currentColumnClicked + 1)
                    ].style.borderLeftColor = 'var(--white)'
                }
            }
        }
    }
</script>

<button
    on:mouseenter={handleMouseOver}
    on:focus={handleMouseOver}
    on:click={handleMouseClick}
    bind:this={button}
    class:notes={mode === 'notes'}
    class:editable
    class:wrong
    class:difference
>
    {#if mode === 'value'}
        <span>{value}</span>
    {:else}
        {#each notes as note, i}
            <span>
                {#if note}
                    {i + 1}
                {/if}
            </span>
        {/each}
    {/if}
</button>

<style lang="postcss">
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 0.1s ease-in-out;
        cursor: pointer;
        border-top: 1px solid var(--white);
        border-right: none;
        border-bottom: none;
        border-left: 1px solid var(--white);
        background: transparent;
        padding: 0;
        aspect-ratio: 1;
        color: var(--white);

        & span {
            font-weight: var(--font-weight-bold);
            font-size: var(--font-size-xxl);
        }

        &.notes {
            display: grid;
            grid-template-rows: repeat(3, 1fr);
            grid-template-columns: repeat(3, 1fr);

            & span {
                font-size: var(--font-size-xs);
                color: var(--white);
            }
        }

        &.editable {
            color: var(--blue-green);
        }

        &.wrong {
            color: var(--orange);
        }

        &.editable.wrong {
            color: var(--red);
        }

        &.editable.difference {
            color: var(--orange);
        }
    }

    @media screen and (max-width: 800px) {
        button {
            & span {
                font-size: var(--font-size-xl);
            }

            &.notes span {
                font-size: var(--font-size-xxs);
            }
        }
    }

    @media screen and (max-width: 450px) {
        button {
            /* & span {
                font-size: var(--font-size-xl);
            } */

            &.notes span {
                font-size: var(--font-size-xxxs);
            }
        }
    }

    button:nth-child(27n + 1) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(27n + 2) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(27n + 3) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(27n + 4) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(27n + 5) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(27n + 6) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(27n + 7) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(27n + 8) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(27n + 9) {
        border-top: 4px solid var(--white);
    }

    button:nth-child(1) {
        border-top: none;
    }

    button:nth-child(2) {
        border-top: none;
    }

    button:nth-child(3) {
        border-top: none;
    }

    button:nth-child(4) {
        border-top: none;
    }

    button:nth-child(5) {
        border-top: none;
    }

    button:nth-child(6) {
        border-top: none;
    }

    button:nth-child(7) {
        border-top: none;
    }

    button:nth-child(8) {
        border-top: none;
    }

    button:nth-child(9) {
        border-top: none;
    }

    button:nth-child(9n + 1) {
        border-left: none;
    }

    button:nth-child(9n + 4) {
        border-left: 4px solid var(--white);
    }

    button:nth-child(9n + 7) {
        border-left: 4px solid var(--white);
    }
</style>
