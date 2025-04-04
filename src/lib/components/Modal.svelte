<script lang="ts">
  import {X} from "lucide-svelte";

  let modal: HTMLDialogElement;

  const openModal = () => {
    modal.showModal();
  };

  const closeModal = () => {
    modal.close();
  };
</script>

<button class="btn btn-md btn-circle" on:click={openModal}>
  <slot name="icon"/>
</button>

<dialog bind:this={modal} class="modal">
  <div class="modal-box">
    <button class="btn btn-circle btn-sm absolute right-2 top-2 z-10" on:click={closeModal}>
      <X/>
    </button>
    <slot name="content" onclose={closeModal}/>
  </div>
</dialog>
