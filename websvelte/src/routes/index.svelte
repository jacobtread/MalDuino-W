<script>
    import Editor from "../components/Editor.svelte";
    import { status, statusColor } from "../app.ts";
    import Scripts from "../components/Scripts.svelte";
</script>
<h1 class="banner" style="background: {$statusColor}">{$status}</h1>

<Scripts/>
<Editor/>

<style lang="scss" global>
  @mixin font {
    font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .banner {
    display: inline-block;
    background: #1c1a2a;
    text-align: center;
    font-size: 1.25rem;
    color: white;
    padding: 0.25rem 2rem;
  }

  body {
    background: #222032;
    @include font();
  }

  .button {
    border: none;
    background: #312e49;
    color: white;
    padding: 0.5rem;
    font-weight: bold;
    @include font();
  }
</style>