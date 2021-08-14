<script>
  import store from '../stores/messages.js';
  import Tiles from '../lib/Tiles.svelte';
  import CursorContainer from '../lib/CursorContainer.svelte';
  
  /* Set up the game state */
  $: gameState = JSON.parse($store);
  
  function startGame() {
    store.sendMessage('start');
  }
</script>

<h1>Musical Cursors</h1>

{#if gameState.status === 'finished'}
  <h3>Game over, try again</h3>
{/if}

{#if gameState.status !== 'in-progress'}
  <button on:click={startGame}>Start Game</button>
{/if}

<Tiles />
<CursorContainer />

<pre>
  <code>
    {JSON.stringify(gameState, null, 2)}
  </code>
</pre>