<template>
  <div class="board">
    <editable-text
      ref="boardName"
      v-model="board.name"
      @editableText:text-edited="onTextEdited"
    />
    <dropdown-menu
      :menu-items="moreMenuItems"
      @delete="onDelete"
      @share="onShare"
      @edit="editBoardName"
    >
      <div class="board__more-icon" v-if="isEditable">
        <font-awesome-icon icon="ellipsis-h" />
      </div>
    </dropdown-menu>
  </div>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu.vue';
import EditableText from '@/components/EditableText.vue';
import ModalEventBus from '@/events/modal-event-bus';

export default {
  name: 'board',
  props: {
    board: {
      type: Object,
      required: true,
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    moreMenuItems() {
      return [
        {
          title: 'Edit board',
          icon: 'pen',
          event: 'edit',
        },
        {
          title: 'Share board',
          icon: 'link',
          event: 'share',
        },
        {
          title: 'Delete board',
          icon: 'trash-alt',
          event: 'delete',
        },
      ];
    },
  },
  methods: {
    onDelete() {
      if (!this.isEditable) {
        return;
      }
      this.$emit('board:delete', this.board._id);
    },
    onTextEdited(event) {
      if (!this.isEditable) {
        return;
      }

      this.$emit('board:name-changed', event, this.board);
    },
    onShare() {
      ModalEventBus.$emit('open-share-modal', this.board._id);
    },
    editBoardName() {
      this.$refs.boardName.enableEditMode();
    },
  },
  components: {
    EditableText,
    DropdownMenu,
  },
};
</script>

<style lang="scss" scoped>
.board {
  background-color: var(--board-background-color);
  border-radius: var(--global-border-radius);
  column-gap: 1rem;
  display: grid;
  grid-template-areas:
    "board-name board-button"
    "board-infos board-infos";
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  margin-bottom: 0.875rem;
  margin-right: 0.875rem;
  min-height: 3.75rem;
  min-width: 15.625rem;
  padding: 1rem;
  text-align: left;
  transition: var(--global-transition);

  &:hover {
    background-color: var(--board-background-color-hover);
  }

  .board__more-icon {
    border-radius: var(--global-border-radius);
    cursor: pointer;
    font-size: 1rem;
    grid-area: board-button;
    padding: 0.375rem;
    transition: var(--global-transition);

    &:hover {
      background-color: rgba(31, 60, 73, 0.08);
    }
  }
}
</style>
