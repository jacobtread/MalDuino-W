<script>
    import "../assets/global.scss"
    import Navigation from "../components/Navigation.svelte";
    import Toaster from "../components/Toaster.svelte";
    import Loader from "../components/Loader.svelte";
</script>
<div class="content">
    <Navigation/>
    <main class="main">
        <slot/>
    </main>
</div>
<Toaster/>
<Loader/>
<style lang="scss">

  .content {
    display: flex;
    flex-flow: row;
    height: 100vh;
    width: 100%;
  }

  .main {
    position: absolute;
    left: 64px;
    width: calc(100% - 64px);
    height: 100%;
    overflow-y: auto;
    padding: 2.5rem;
    color: gray;
  }

</style>

