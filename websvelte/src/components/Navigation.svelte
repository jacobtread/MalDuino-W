<script>
    import { status, statusColor } from "../app.ts";
    import HomeIcon from "../assets/icons/home.svg"
    import TerminalIcon from "../assets/icons/terminal.svg"
    import SettingsIcon from "../assets/icons/settings.svg"
    import StorageIcon from "../assets/icons/storage.svg"
</script>

<nav class="nav">
    <div class="nav__state" data-status="{$status.toLowerCase()}" style="background: {$statusColor}"></div>
    <div class="nav__buttons">
        <a href="/" class="nav__buttons__item">
            <HomeIcon fill="currentColor"/>
        </a>
        <a href="/scripts" class="nav__buttons__item">
            <StorageIcon fill="currentColor"/>
        </a>
        <a href="/terminal" class="nav__buttons__item">
            <TerminalIcon fill="currentColor"/>
        </a>
        <a href="/settings" class="nav__buttons__item">
            <SettingsIcon fill="currentColor"/>
        </a>
    </div>

</nav>
<style lang="scss">

  @import "../assets/variables";

  .nav {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

    width: 64px;
    height: 100%;
    display: flex;
    flex-flow: column;

    align-items: center;
    justify-content: center;

    background: darken($background, 3);

    &__state {
      width: 2rem;
      height: 2rem;

      border-radius: 1rem;
      margin: 1rem auto;

      &[data-status="running"] {
        animation: blink 1s ease infinite;
      }
    }

    &__buttons {
      flex: auto;
      display: flex;
      flex-flow: column;

      &__item {
        color: white;
        padding: 1rem;
      }

    }
  }

  @keyframes blink {
    0%, 100% {
      opacity: 1;
    }
    20% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    60% {
      opacity: 0;
    }
    80% {
      opacity: 1;
    }

  }
</style>