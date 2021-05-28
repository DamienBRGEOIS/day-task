<template>
  <div class="board">
    <editable-text
      ref="boardName"
      v-model="board.name"
      @editableText:text-edited="onTextEdited"
    />
    <div class="board__icon-container" v-if="isEditable">
      <dropdown-menu
        :menu-items="moreMenuItems"
        @delete="onDelete"
        @share="onShare"
        @edit="editBoardName"
      >
        <font-awesome-icon icon="ellipsis-h" />
      </dropdown-menu>
    </div>
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
  margin-bottom: 0.875rem;
  margin-right: 0.875rem;
  min-height: 3.75rem;
  min-width: 15.625rem;
  padding: 1rem;
  text-align: left;
  transition: var(--global-transition);

  &:hover {
    background-color: var(--board-background-color-hover);
    box-shadow: var(--board-shadow);
    transform: scale(1.02);

    .board__icon-container {
      .board__icon-container__icon {
        color: rgba(0, 0, 0, 0.4);
        visibility: visible;
      }
    }
  }

  .board__icon-container {
    display: inline-block;
    position: absolute;

    .board__icon-container__icon {
      visibility: hidden;

      &:hover {
        color: rgba(0, 0, 0, 0.7);
      }
    }
  }
}
</style>
