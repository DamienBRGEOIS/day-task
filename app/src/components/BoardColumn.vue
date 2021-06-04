<template>
  <div
    class="board-column"
    :draggable="isDraggable"
    @dragenter.prevent
    @dragover.prevent
    @dragstart.self="pickupColumn($event)"
    @dragend.self="$el.classList.remove('grabbed')"
    @drop="onDrop($event)"
  >
    <div class="column-title">
      <editable-text
        ref="columnName"
        v-model="column.name"
        :enforceUppercase="true"
        :fontWeight="600"
        @editableText:edit-mode-disabled="enableDrag"
        @editableText:edit-mode-enabled="disableDrag"
        @editableText:text-edited="onTextEdited"
      />
    </div>
    <div class="column-more-icon" @click.stop.prevent="onMoreButtonClicked">
      <font-awesome-icon icon="ellipsis-h" />
    </div>
    <div class="tasks-container" v-if="column.tasks && column.tasks.length > 0">
      <task
        v-for="(task, $taskIndex) in column.tasks"
        :key="task._id"
        :boardId="boardId"
        :column="column"
        :task="task"
        :taskIndex="$taskIndex"
        @dropped="onDrop"
      />
    </div>
    <div class="add-task">
      <morphing-button
        button-text="Add another task"
        font-awesome-icon="plus"
        hoverBackgroundColor="rgba(9, 30, 66, 0.08)"
        openBackgroundColor="transparent"
        textColor="inherit"
        triggerTextAlign="left"
        :contentPaddingX="0"
        :contentPaddingY="0"
        :triggerPaddingX="1.375"
        :triggerPaddingY="0.75"
        @open-button:opened="onOpen"
        @open-button:outside-click="clearFields"
      >
        <form @submit.prevent="addTask" ref="form" id="form">
          <textarea
            autocomplete="off"
            id="task-name"
            name="task-name"
            placeholder="Enter the task's title..."
            ref="input"
            type="text"
            v-model="taskName"
            @keypress.enter.prevent="addTask"
          ></textarea>
          <button type="submit" class="buttons">Create a new task</button>
        </form>
      </morphing-button>
    </div>
  </div>
</template>

<script>
import DropdownEventBus from '@/events/DropdownEventBus';
import EditableText from '@/components/EditableText.vue';
import ModalEventBus from '@/events/ModalEventBus';
import MorphingButton from '@/components/MorphingButton.vue';
import Task from '@/components/Task.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    column: {
      type: Object,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
    columnIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      taskName: '',
      isDraggable: true,
    };
  },
  computed: {
    ...mapGetters('boards', ['getBoard']),
  },
  methods: {
    confirmDeleteColumn() {
      ModalEventBus.$emit('open-confirm-modal', {
        title: 'Delete this column ?',
        text: "The column and all it's tasks will be permanantly deleted.",
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        confirmAction: this.handleDeleteColumn,
        confirmActionParams: [],
      });
    },
    handleDeleteColumn() {
      this.deleteColumnWithId({
        boardId: this.boardId,
        columnId: this.column._id,
      });
    },
    onOpen() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    addTask() {
      if (this.taskName.trim().length === 0) {
        return;
      }
      this.createTask({
        boardId: this.boardId,
        columnId: this.column._id,
        task: { name: this.taskName },
      });
      this.clearFields();
    },
    clearFields() {
      this.taskName = '';
    },
    onTextEdited(columnName) {
      const editedColumn = this.column;
      editedColumn.name = columnName;

      this.updateColumnWithId({
        boardId: this.boardId,
        column: editedColumn,
      });
    },
    handleDeleteTask(taskId) {
      this.deleteTask({
        boardId: this.boardId,
        columnId: this.column._id,
        taskId,
      });
    },
    onDrop(event, destinationIndex) {
      const type = event.dataTransfer.getData('type');

      if (type === 'task') {
        this.onDropTask(event, destinationIndex);
      } else if (type === 'column') {
        this.onDropColumn(event, destinationIndex);
      }
    },
    onDropTask(event, destinationIndex) {
      const fromTaskId = event.dataTransfer.getData('task-id');
      const fromColumnId = event.dataTransfer.getData('from-column-id');
      const toTaskId = this.column.tasks[destinationIndex]._id;

      if (fromTaskId === toTaskId) {
        return;
      }

      this.moveTaskWithId({
        boardId: this.getBoard._id,
        columnId: fromColumnId,
        taskId: fromTaskId,
        toColumnId: this.column._id,
        destinationIndex,
      });
    },
    onDropColumn(event) {
      const fromColumnId = event.dataTransfer.getData('from-column-id');

      if (this.column._id === fromColumnId) {
        return;
      }

      this.moveColumnWithId({
        boardId: this.getBoard._id,
        columnId: fromColumnId,
        destinationIndex: this.columnIndex,
      });
    },
    pickupColumn(event) {
      this.$el.classList.add('grabbed');
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.effectAllowed = 'move';
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('from-column-id', this.column._id);
      event.dataTransfer.setData('from-column-index', this.columnIndex);
      event.dataTransfer.setData('type', 'column');
    },
    editColumnName() {
      this.$refs.columnName.enableEditMode();
    },
    disableDrag() {
      this.isDraggable = false;
    },
    enableDrag() {
      this.isDraggable = true;
    },
    onMoreButtonClicked(event) {
      const target = event.currentTarget;

      DropdownEventBus.$emit('open-dropdown-menu', {
        target,
        items: [
          {
            title: 'Edit column',
            icon: 'pen',
            action: this.editColumnName,
          },
          {
            title: 'Delete column',
            icon: 'trash-alt',
            action: this.confirmDeleteColumn,
          },
        ],
        onOpen: this.addFocusClass.bind(this, target),
        onClose: this.removeFocusClass.bind(this, target),
      });
    },
    addFocusClass(target) {
      target.classList.add('focused');
    },
    removeFocusClass(target) {
      target.classList.remove('focused');
    },
    ...mapActions('boards', [
      'updateColumnWithId',
      'createTask',
      'deleteTask',
      'deleteColumnWithId',
      'moveTaskWithId',
      'moveColumnWithId',
    ]),
  },
  components: {
    Task,
    MorphingButton,
    EditableText,
  },
};
</script>

<style lang="scss" scoped>
.board-column {
  background-color: var(--board-background-color);
  border-radius: var(--global-border-radius);
  column-gap: 1rem;
  cursor: grab;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "column-name column-button"
    "column-content column-content"
    "column-add-task column-add-task";
  margin-right: 1rem;
  max-width: 22.5rem;
  min-width: 21.875rem;
  padding: 0.703rem;
  user-select: none;

  &.grabbed {
    cursor: grabbing;
    box-shadow: var(--board-grabbed-shadow);
    transform: translateY(-0.125rem);
  }

  .column-title {
    padding-bottom: 0.5rem;
    text-align: left;
    width: 100%;
    height: 1.75rem;
  }

  .column-more-icon {
    border-radius: var(--global-border-radius);
    cursor: pointer;
    font-size: 1rem;
    grid-area: column-button;
    height: 1rem;
    padding: 0.375rem;
    transition: var(--global-transition);

    &:hover,
    &.focused {
      background-color: rgba(31, 60, 73, 0.08);
    }
  }

  .tasks-container {
    grid-area: column-content;
    text-align: left;
  }

  .add-task {
    margin-top: 0.5rem;
    width: 100%;
    grid-area: column-add-task;
    font-size: var(--global-font-size);

    #form {
      display: flex;
      flex-direction: column;
      justify-content: stretch;

      #task-name {
        border-radius: var(--global-border-radius);
        border: 2px solid var(--primary-color);
        box-shadow: none;
        font-family: inherit;
        grid-area: column-name;
        margin-bottom: 0.25rem;
        padding: 0.5rem 0.75rem;
        resize: none;
      }
    }
  }
}
</style>
