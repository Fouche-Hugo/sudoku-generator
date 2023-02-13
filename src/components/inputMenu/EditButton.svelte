<script lang="ts">
    let on: boolean = false
</script>

<button
    on:click
    on:mouseleave={event => {
        event.target.blur()
    }}
    on:click={() => {
        on = !on
    }}
    class:on
>
    <!-- <img src="./edit.svg" alt="edit" /> -->
    <svg
        width="86"
        height="86"
        viewBox="0 0 86 86"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M56.6802 7.62584L67.3052 18.2508L59.2054 26.3542L48.5804 15.7292L56.6802 7.62584ZM14.1802 50.0833V60.7083H24.8052L54.1975 31.3585L43.5725 20.7335L14.1802 50.0833ZM14.1802 71.3333H70.8469V78.4167H14.1802V71.3333Z"
            fill="#D3CED8"
        />
    </svg>
</button>

<style lang="postcss">
    @import url('/src/style/output/commandButton.css');

    .on {
        background-color: var(--white);

        & svg path {
            fill: var(--violet-darker);
        }
    }
</style>
