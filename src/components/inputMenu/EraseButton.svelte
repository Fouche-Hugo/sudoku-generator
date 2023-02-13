<button
    on:click
    on:mouseleave={event => {
        event.target.blur()
    }}
>
    <img src="./erase.svg" alt="edit" />
</button>

<style lang="postcss">
    @import url('/src/style/output/commandButton.css');
</style>
