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
    <div class="task-more-icon">
      <dropdown-menu
        :menu-items="moreMenuItems"
        @board-column:delete="confirmDeleteTask"
        @board-column:edit="goToTask"
      >
        <font-awesome-icon icon="ellipsis-h" />
      </dropdown-menu>
    </div>
    <p class="task-description" v-if="task.description">
      <small>{{ task.description }}</small>
    </p>
  </div>
</template>

<script>
import DropdownMenu from '@/components/DropdownMenu.vue';
import ModalEventBus from '@/events/modal-event-bus';
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
    onMoreIconCliked() {
      this.$emit('task:more-icon-clicked', this.task._id);
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
    moreMenuItems() {
      return [
        {
          title: 'Edit task',
          icon: 'pen',
          event: 'board-column:edit',
        },
        {
          title: 'Delete task',
          icon: 'trash-alt',
          event: 'board-column:delete',
        },
      ];
    },
    ...mapGetters('boards', ['getBoard']),
  },
  components: {
    DropdownMenu,
  },
};
</script>

<style lang="scss" scoped>
.task {
  background-color: var(--task-background-color);
  border-radius: var(--global-border-radius);
  cursor: pointer;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  transition: var(--task-transition);
  user-select: none;

  &:last-child {
    margin-bottom: 0rem;
  }

  &:hover {
    background-color: var(--task-background-color-hover);
    transform: scale(1.01);
  }

  .task-name {
    display: inline-block;
    font-weight: 600;
    overflow-wrap: break-word;
    white-space: normal;
    width: calc(100% - 1rem);
  }

  .task-more-icon {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    position: absolute;
  }

  .task-description {
    font-weight: 400;
    margin-block: 0;
    overflow-wrap: break-word;
    padding: 0.5rem 0;
    white-space: normal;
  }
}
</style>
