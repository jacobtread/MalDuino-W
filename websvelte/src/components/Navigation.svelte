<script>
    import { status, statusColor } from "../app.ts";
    import HomeIcon from "../assets/icons/home.svg"
    import UpdateIcon from "../assets/icons/update.svg"
    import TerminalIcon from "../assets/icons/terminal.svg"
</script>

<nav class="nav">
    <div class="nav__state" data-status="{$status.toLowerCase()}" style="background: {$statusColor}"></div>
    <div class="nav__buttons">
        <a href="/" class="nav__buttons__item">
            <HomeIcon fill="currentColor"/>
        </a>
        <a href="/update" class="nav__buttons__item">
            <UpdateIcon fill="currentColor"/>
        </a>
        <a href="/terminal" class="nav__buttons__item">
            <TerminalIcon fill="currentColor"/>
        </a>
    </div>
</nav>
<style lang="scss">

  @import "../assets/variables";

  .nav {

    height: 100%;
    display: block;
    padding: 0.5rem;
    background: adjust-color($background, $red: 5%, $green: 5%, $blue: 10%);

    &__state {
      width: 2rem;
      height: 2rem;

      border-radius: 1rem;
      margin: 0.5rem auto 1rem;

      &[data-status="running"] {
        animation: blink 1s ease infinite;
      }
    }

    &__buttons {

      display: flex;
      flex-flow: column;
      align-items: center;
      gap: 1rem;


      &__item {
        color: white;
        background: adjust-color($background, $red: -5%, $green: -5%, $blue: -5%);
        padding: 0.5rem;
        border-radius: 1rem;
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