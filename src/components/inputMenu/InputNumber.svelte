<script lang="ts">
    export let value: number = -1
</script>

<button
    on:click
    on:mouseleave={event => {
        event.target.blur()
    }}
>
    <span>{value}</span>
</button>

<style lang="postcss">
    @import url('/src/style/output/commandButton.css');

    span {
        color: var(--white);
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-number-button);
    }

    @media screen and (max-width: 450px) {
        span {
            font-size: var(--font-size-number-button-mobile);
        }
    }
</style>
