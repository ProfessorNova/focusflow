<script lang="ts">
  import { X } from "lucide-svelte";

  const Tag = [
    "Bug",
    "Feature",
    "Improvement",
    "Task",
    "Documentation",
    "Enhancement",
    "Hotfix",
    "Optimization",
    "Research",
    "Chore",
    "Meeting",
    "Admin",
    "Finance",
    "Personal",
    "Health",
    "Event"
  ];

  const wholeTags = Object.values(Tag);

  let { tags = $bindable<string[]>([]) } = $props();
  let availableTags = $derived.by(() => {
    return wholeTags.filter((tag) => !tags.find((_selectedTag: string) => _selectedTag == tag));
  });

  function AddTag(e: Event) {
    let _tag: string = (e.target as HTMLElement).innerText;
    if (!wholeTags.find((validTag) => validTag == _tag)) {
      console.error("Tried to select an invalid tag!");
      return;
    }
    tags.push(_tag);
  }

  function RemoveTag(e: Event) {
    let _tag: string = (e.currentTarget as HTMLElement).innerText;
    tags = tags.filter((setTags: string) => setTags.trim() != _tag.trim());
  }
</script>

<div class="flex flex-col h-full overflow-hidden gap-2 relative justify-evenly">
  <fieldset
    class="fieldset bg-base-200 border border-base-300 p-4 rounded-box overflow-y-scroll overflow-x-hidden flex-wrap flex flex-row min-h-25">
    <legend class="fieldset-legend">Selected tags</legend>
    {#each tags as tag}
      <div
        class="flex bg-neutral border border-success rounded px-3 py-1 w-fit h-fit gap-1 items-center justify-center">
        <a href="#_" class="" onclick={RemoveTag}>
          {tag}
          <div class="btn btn-ghost btn-circle h-fit w-fit m-0 p-0 items-center justify-center">
            <X size="16" />
          </div>
        </a>
      </div>
    {/each}
  </fieldset>
  <fieldset
    class="fieldset bg-base-200 border border-base-300 p-4 rounded-box overflow-y-scroll overflow-x-hidden flex-wrap flex flex-row min-h-25">
    <legend class="fieldset-legend">Add tags</legend>
    {#each availableTags as tag}
      <a href="#_" class="fieldset-label bg-neutral border border-info rounded px-3 py-1 w-fit"
         onclick="{AddTag}">{tag}</a>
    {/each}
  </fieldset>
</div>