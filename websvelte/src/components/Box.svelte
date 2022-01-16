<script>
    export let icon = undefined
</script>

<div class="box">
    {#if icon}
        <svelte:component this={icon} class="box__icon"/>
    {/if}
    <slot class="box__content"/>
</div>

<style lang="scss">
  @import "../assets/variables";

  .box {
    display: block;
    position: relative;
    padding: 1rem;
    border-radius: 0.25rem;
    border: 4px solid lighten($background, 3);

    :global(.box__icon) {
      background: $background;
      position: absolute;
      left: 1rem;
      top: 0;
      transform: translateY(-50%);
      padding: 0 0.5rem;
      width: 50px;
      height: 32px;
      color: lighten($background, 15);
    }
    .box__content {
      position: relative;
    }
  }
</style>