<script lang="ts">
    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'

    let newBoardButton: HTMLButtonElement
    let solveButton: HTMLButtonElement

    const dispatch = createEventDispatcher()

    function newBoard() {
        dispatch('newBoard')
    }

    function solve() {
        dispatch('solve')
    }

    onMount(() => {
        setTimeout(() => {
            const borderRadiusNewBoard = getComputedStyle(
                document.querySelector('.new-board'),
            ).borderRadius

            const childrenBoardButton: SVGRectElement[] = Array.from(
                newBoardButton.children[0].children,
            )

            childrenBoardButton.forEach(child => {
                const rect = child as SVGRectElement
                rect.setAttribute('rx', borderRadiusNewBoard.toString())
            })

            const borderRadiusSolve = getComputedStyle(
                document.querySelector('.solve'),
            ).borderRadius

            const childrenSolveButton: SVGRectElement[] = Array.from(
                solveButton.children[0].children,
            )

            childrenSolveButton.forEach(child => {
                const rect = child as SVGRectElement
                rect.setAttribute('rx', borderRadiusSolve.toString())
            })
        }, 100)
    })
</script>

<nav>
    <div class="left">
        <img src="./icon.svg" alt="icon" />
        <h1>SUDOKU</h1>
    </div>
    <div class="right">
        <button
            class="new-board"
            bind:this={newBoardButton}
            on:click={newBoard}
            on:mouseleave={event => {
                event.target.blur()
            }}
        >
            Nouvelle grille
            <svg class="glow-container">
                <rect
                    pathLength="100"
                    stroke-linecap="round"
                    class="glow-blur"
                />
                <rect
                    pathLength="100"
                    stroke-linecap="round"
                    class="glow-line"
                />
            </svg>
        </button>
        <button
            class="solve"
            bind:this={solveButton}
            on:click={solve}
            on:mouseleave={event => {
                event.target.blur()
            }}
        >
            Solution
            <svg class="glow-container">
                <rect
                    pathLength="100"
                    stroke-linecap="round"
                    class="glow-blur"
                />
                <rect
                    pathLength="100"
                    stroke-linecap="round"
                    class="glow-line"
                />
            </svg>
        </button>
    </div>
</nav>

<style lang="postcss">
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--gap-m);
        border-bottom: 1px solid var(--white);
        padding: var(--gap-m) var(--gap-l);

        & .left {
            display: flex;
            align-items: center;
            gap: var(--gap-s);
            user-select: none;

            & img {
                width: 3em;
                height: 3em;
            }

            & h1 {
                margin: 0;
                color: var(--white);
                font-weight: var(--font-weight-bold);
                font-size: var(--font-size-xxxl);
            }
        }

        & .right {
            display: flex;
            gap: var(--gap-s);

            & button {
                position: relative;
                cursor: pointer;
                border: none;
                border-radius: var(--border-radius);
                padding: var(--gap-s) var(--gap-m);
                color: var(--white);
                font-size: var(--font-size-xxl);

                & .glow-container {
                    --glow-container-outset: 20px;

                    position: absolute;
                    opacity: 0;
                    inset: calc(var(--glow-container-outset) / -2);
                    width: calc(100% + var(--glow-container-outset));
                    height: calc(100% + var(--glow-container-outset));
                    pointer-events: none;

                    & .glow-blur,
                    & .glow-line {
                        stroke: var(--glow-color);
                        fill: transparent;
                        stroke-dasharray: 20 30;
                        x: calc(var(--glow-container-outset) / 2);
                        y: calc(var(--glow-container-outset) / 2);
                        width: calc(100% - var(--glow-container-outset));
                        height: calc(100% - var(--glow-container-outset));
                    }

                    & .glow-blur {
                        stroke-width: 5px;
                        filter: blur(5px);
                    }

                    & .glow-line {
                        stroke-width: 1px;
                    }
                }

                &:is(:hover, :focus) .glow-blur,
                &:is(:hover, :focus) .glow-line {
                    stroke-dashoffset: -100;
                    transition: stroke-dashoffset 1.2s ease-in-out;
                }

                &:is(:hover, :focus) .glow-container {
                    animation: glow-visibility 1.8s;
                }

                &.new-board {
                    --glow-color: var(--violet-glow);

                    transition: background-color 0.25s;
                    background-color: var(--violet-dark);

                    &:is(:hover, :focus) {
                        background-color: var(--violet);
                    }
                }

                &.solve {
                    --glow-color: var(--orange-glow);

                    transition: background-color 0.25s;
                    background-color: var(--orange-dark);

                    &:is(:hover, :focus) {
                        background-color: var(--orange);
                    }
                }
            }
        }
    }

    @keyframes glow-visibility {
        0% {
            opacity: 0;
        }

        25% {
            opacity: 1;
        }

        75% {
            opacity: 1;
        }

        100% {
            opacity: 0;
        }
    }

    @media screen and (max-width: 600px) {
        nav {
            flex-direction: column;

            & .right {
                width: min(450px, 100%);

                & button {
                    width: 50%;
                }
            }
        }
    }

    @media screen and (max-width: 450px) {
        nav .right {
            flex-direction: column;

            & button {
                width: 100%;
            }
        }
    }
</style>
