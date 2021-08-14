<script>
  import store from '../stores/messages.js';

  $: gameState = JSON.parse($store);
</script>

<style>
  .tiles {
    display: grid;
    grid-template-columns: 150px 150px;
    column-gap: 10px;
    row-gap: 10px;
  }
  .tile {
    background: #eee;
    width: 150px;
    height: 150px;
  }
  .active {
    background: green;
  }
</style>

<section class="tiles">
  {#each Array(4) as _, i}
    <div class="tile" class:active={gameState.tiles ? !!gameState.tiles[i] : false}></div>
  {/each}
</section>