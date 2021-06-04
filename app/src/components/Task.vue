<template>
  <div
    @click="goToTask"
    @dragenter.prevent
    @dragover.prevent
    @dragstart="pickupTask($event)"
    @drop.stop="onDrop"
    class="task"
    draggable
  >
    <div class="task-name">
      {{ task.name }}
    </div>
    <div class="task-more-icon" @click.stop.prevent="onMoreButtonClicked">
      <font-awesome-icon icon="ellipsis-h" />
    </div>
    <p class="task-description" v-if="task.description">
      <small>{{ task.description }}</small>
    </p>
  </div>
</template>

<script>
import DropdownEventBus from '@/events/DropdownEventBus';
import ModalEventBus from '@/events/ModalEventBus';
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    boardId: {
      type: String,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
    column: {
      type: Object,
      required: true,
    },
    taskIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    pickupTask(event) {
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.effectAllowed = 'move';
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('task-id', this.task._id);
      event.dataTransfer.setData('from-column-id', this.column._id);
      event.dataTransfer.setData('type', 'task');
    },
    confirmDeleteTask() {
      ModalEventBus.$emit('open-confirm-modal', {
        title: 'Delete this task ?',
        text: 'This task will be permanantly deleted.',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        confirmAction: this.handleDeleteTask,
        confirmActionParams: [],
      });
    },
    handleDeleteTask() {
      this.deleteTaskWithId({
        boardId: this.boardId,
        columnId: this.columnId,
        taskId: this.task._id,
      });
    },
    goToTask() {
      this.$router.push({
        name: 'Task',
        params: {
          boardId: this.boardId,
          taskId: this.task._id,
        },
      });
    },
    onMoreButtonClicked(event) {
      const target = event.currentTarget;

      DropdownEventBus.$emit('open-dropdown-menu', {
        target,
        items: [
          {
            title: 'Edit task',
            icon: 'pen',
            action: this.goToTask,
          },
          {
            title: 'Delete task',
            icon: 'trash-alt',
            action: this.confirmDeleteTask,
          },
        ],
        onOpen: this.addFocusClass.bind(this, target),
        onClose: this.removeFocusClass.bind(this, target),
      });
    },
    addFocusClass(target) {
      this.$el.classList.add('focused');
      target.classList.add('focused');
    },
    removeFocusClass(target) {
      this.$el.classList.remove('focused');
      target.classList.remove('focused');
    },
    onDrop(event) {
      this.$emit('dropped', event, this.taskIndex);
    },
    ...mapActions('boards', ['deleteTaskWithId']),
  },
  computed: {
    columnId() {
      return this.getBoard.columns.find(
        (column) => column.tasks.findIndex((task) => task._id === this.task._id) !== -1,
      )._id;
    },
    ...mapGetters('boards', ['getBoard']),
  },
};
</script>

<style lang="scss" scoped>
.task {
  display: grid;
  background-color: var(--task-background-color);
  border-radius: var(--global-border-radius);
  cursor: pointer;
  grid-template-areas:
    "name button"
    "content content";
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  transition: var(--task-transition);
  user-select: none;

  &:last-child {
    margin-bottom: 0rem;
  }

  &:hover,
  &.focused {
    background-color: var(--task-background-color-hover);
  }

  .task-name {
    font-weight: 600;
    overflow-wrap: break-word;
    white-space: normal;
    grid-area: name;
    font-size: var(--task-name-font-size);
    padding: 0.375rem 0;
  }

  .task-more-icon {
    color: rgba(0, 0, 0, 0.65);
    grid-area: button;
    height: 1rem;
    padding: 0.375rem;
    transition: var(--global-transition);
    border-radius: var(--global-border-radius);

    &:hover,
    &.focused {
      background-color: rgba(31, 60, 73, 0.08);
    }
  }

  .task-description {
    font-weight: 400;
    grid-area: content;
    margin-block: 0;
    overflow-wrap: break-word;
    padding: 0.5rem 0;
    white-space: normal;
  }
}
</style>
