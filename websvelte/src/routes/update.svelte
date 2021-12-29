

<form method='POST' action='/update' enctype='multipart/form-data' class="update">
    <h1>Update</h1>
    <label class="update__area">
        <span class="update__area__title">Click to upload file</span>
        <input type='file' name='update' style="display: none">
    </label>
    <input type='submit' value='Upload' class="button update__button">
</form>

<style lang="scss">
  @import "../assets/variables";
  .update {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    &__area {
      display: block;
      padding: 2rem;
      background: darken($background, 3);
      margin: 1rem;

      &__title {
        font-size: 1.2rem;
        color: white;
        display: block;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
    }

    &__button {
      display: block;
    }
  }
</style>