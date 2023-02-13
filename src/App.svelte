<script lang="ts">
  import Nav from './base/Nav.svelte'
  import Main from './base/Main.svelte'
  import Footer from './base/Footer.svelte'

  let main
</script>

<Nav on:solve={main.solveBoard()} on:newBoard={main.resetBoard()} />
<Main bind:this={main} />
<Footer />

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>
