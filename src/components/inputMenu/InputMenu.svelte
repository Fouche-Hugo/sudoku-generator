<script lang="ts">
    import InputNumber from './InputNumber.svelte'
    import EditButton from './EditButton.svelte'
    import EraseButton from './EraseButton.svelte'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let mode: string = 'value'

    function handleInputNumberClick(value: number) {
        dispatch('inputNumberClick', {
            value,
        })
    }

    function handleEraseButtonClick() {
        dispatch('eraseButtonClick')
    }

    function handleNumberKeyboard(event) {
        const value = parseInt(event.key)
        if (value >= 1 && value <= 9) {
            handleInputNumberClick(value)
        }
        const key = event.key
        if (key === 'Backspace' || key === 'Delete') {
            handleEraseButtonClick()
        }
    }
</script>

<svelte:window on:keydown={handleNumberKeyboard} />
<div class="input-menu">
    {#each Array(9) as _, i}
        <InputNumber
            value={i + 1}
            on:click={() => {
                handleInputNumberClick(i + 1)
            }}
        />
    {/each}
    <div />
    <EraseButton on:click={handleEraseButtonClick} />
    <EditButton
        on:click={() => {
            mode = mode === 'value' ? 'notes' : 'value'
        }}
    />
</div>

<style lang="postcss">
    .input-menu {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--gap-s);
        aspect-ratio: 3 / 4;
        width: max(19%, 337px);
    }

    @media (max-width: 800px) {
        .input-menu {
            width: max(19%, 300px);
        }
    }

    @media (max-width: 650px) {
        .input-menu {
            grid-template-columns: repeat(5, 1fr);
            aspect-ratio: 5 / 3;
            width: min(450px, 100%);
        }
    }
</style>
