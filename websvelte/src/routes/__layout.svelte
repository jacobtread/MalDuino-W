<script>
    import "../assets/global.scss"
    import Navigation from "../components/Navigation.svelte";
</script>
<div class="content">
    <Navigation/>
    <main class="main">
        <slot/>
    </main>
</div>

<style lang="scss">

  .content {
    display: flex;
    flex-flow: row;
    height: 100%;
    width: 100%;
  }

  .main {
    padding: 1.5rem;
    color: gray;
  }
</style>

