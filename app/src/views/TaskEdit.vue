<template>
  <div class="task-view">
    <div class="task-details" v-if="board && task">
      <div class="task-name-container">
        <input
          id="task-name"
          name="task-name"
          type="text"
          v-model="name"
          @change="updateTask"
          @keyup.enter="updateTask"
        />
      </div>
      <small>In the column {{ board.name }}</small>
      <div class="task-description-container">
        <textarea
          id="task-description"
          name="task-description"
          v-model="description"
          @change="updateTask"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'TaskEdit',
  props: ['board', 'taskId'],
  data() {
    return {
      name: '',
      description: '',
    };
  },
  created() {
    const pageTitle = `${this.task.name} from ${this.board.name} | ${this.$appName}`;
    document.title = pageTitle;
    this.name = this.task.name;
    this.description = this.task.description;
  },
  methods: {
    updateTask() {
      this.updateTaskWithId({
        boardId: this.board._id,
        columnId: this.columnId,
        taskId: this.taskId,
        task: {
          name: this.name,
          description: this.description,
        },
      });
    },
    ...mapActions('boards', ['updateTaskWithId']),
  },
  computed: {
    task() {
      if (!this.board) {
        return null;
      }
      return this.getTaskWithId;
    },
    columnId() {
      return this.board.columns.find(
        (column) => column.tasks.findIndex((task) => task._id === this.taskId) !== -1,
      )._id;
    },
    getTaskWithId() {
      const tasks = this.board.columns.map((column) => column.tasks).flat();
      return tasks.find((task) => task._id === this.taskId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/animations.scss";

.task-view {
  animation: scale-up-center 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  background-color: var(--modal-background-color);
  border-radius: var(--global-border-radius);
  box-shadow: var(--task-shadow);
  display: flex;
  flex-direction: row;
  height: 25rem;
  margin: 0 auto;
  max-width: 43.75rem;
  padding: 1rem;
  position: relative;
  top: calc(50% - 15.625rem);
  user-select: none;

  .task-details {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem;

    .task-name-container {
      #task-name {
        background-color: transparent;
        border: none;
        font-size: var(--global-font-size);
        font-weight: 600;
        line-height: 1.5;
        width: 41.875rem;
      }
    }
    .task-description-container {
      #task-description {
        background-color: transparent;
        border: none;
        height: 19.6875rem;
        height: 25rem;
        line-height: 1.5;
        margin-top: 1rem;
        padding: 0.5rem 0;
        resize: none;
        width: 41.875rem;
      }
    }
  }
}
</style>
