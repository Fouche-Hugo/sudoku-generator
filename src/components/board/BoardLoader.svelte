<div class="container">
    <div class="loader">
        <svg>
            <circle pathLength="100" stroke-linecap="round" />
        </svg>
    </div>
    <div><span>Partie en cours de création</span></div>
</div>

<style lang="postcss">
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--gap-m);
        font-size: var(--font-size-l);
    }

    .loader {
        position: relative;
        border-radius: 50%;
        aspect-ratio: 1;
        width: 200px;
    }

    svg {
        --container-offset: 10px;

        position: absolute;
        transform: rotate(20deg);
        animation: loader 3s ease infinite;
        inset: calc(var(--container-offset) / -2);
        width: calc(100% + var(--container-offset));
        height: calc(100% + var(--container-offset));
    }

    circle {
        cx: 50%;
        cy: 50%;
        r: calc(50% - var(--container-offset) / 2);
        stroke: white;
        stroke-width: 10px;
        fill: transparent;
        animation: load-circle 3s ease infinite;
    }

    @keyframes load-circle {
        0% {
            stroke-dasharray: 90 10;
        }

        50% {
            stroke-dasharray: 10 90;
        }

        100% {
            stroke-dasharray: 90 10;
        }
    }

    @keyframes loader {
        0% {
            transform: rotate(0.75turn);
        }

        55% {
            transform: rotate(1.65turn);
        }

        100% {
            transform: rotate(1.75turn);
        }
    }

    @media screen and (max-width: 600px) {
        .loader {
            width: 100px;
        }
    }
</style>
