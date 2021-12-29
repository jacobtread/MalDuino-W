<script>
    import { showLoader, status, statusColor } from "../app.ts"
</script>

{#if $showLoader}
    <div class="loader-wrapper">
        <div class="loader">
            <div class="loader__spinner" style="border-bottom-color: {$statusColor}"></div>
            <p class="loader__text">{$status}</p>
        </div>
    </div>
{/if}

<style lang="scss">
  .loader {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    &-wrapper {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
    }

    &__spinner {
      width: 100px;
      height: 100px;
      border-radius: 50px;
      border: 5px solid gray;
      border-bottom: 5px solid white;
      animation: spinner 1s linear infinite;
      margin: 1rem auto;
    }

    &__text {
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>