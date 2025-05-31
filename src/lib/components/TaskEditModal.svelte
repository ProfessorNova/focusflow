<script lang="ts">
  import {X} from "lucide-svelte";

  let {modalClosed = $bindable(false), ...props} = $props();
  $effect(() => {
    if(props.close == true) {
      closeModal();
    }
  });
  let { Icon, Content } = props;

  let modal: HTMLDialogElement;

  const openModal = () => {
    modalClosed = false;
    modal.showModal();
  };

  const closeModal = () => {
    modalClosed = true;
    modal.close();
  };
</script>

<button class="btn btn-md btn-ghost btn-circle" title="Open modal" onclick={openModal}>
  <!-- <slot name="icon"/> -->
  {@render Icon()}
</button>

<dialog bind:this={modal} class="modal">
  <div class="modal-box">
    <button class="btn btn-circle btn-sm absolute right-2 top-2 z-10" onclick={closeModal}
      data-testid="TaskModalOpen"
    >
      <X/>
    </button>
    <!-- <slot name="content" onclose={closeModal}/> -->
    {@render Content(closeModal)}
  </div>
</dialog>
