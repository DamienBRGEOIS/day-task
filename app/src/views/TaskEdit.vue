<template>
  <div class="task-view" v-if="board && task">
    <input
      id="task-name"
      name="task-name"
      type="text"
      v-model="name"
      @change="updateTask"
      @keyup.enter="updateTask"
    />
    <small class="task-infos">
      In the column <span id="column-name">{{ column.name }}</span>
    </small>
    <textarea
      id="task-description"
      name="task-description"
      v-model="description"
      @change="updateTask"
    ></textarea>
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
        columnId: this.column._id,
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
    column() {
      return this.board.columns.find(
        (column) => column.tasks.findIndex((task) => task._id === this.taskId) !== -1,
      );
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
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    "title"
    "infos"
    "content";
  height: 25rem;
  margin: 0 auto;
  max-width: 43.75rem;
  padding: 1rem;
  position: relative;
  top: calc(50% - 15.625rem);
  user-select: none;
  padding: 2rem;

  #task-name {
    grid-area: title;
    background-color: transparent;
    border: none;
    font-size: 1.2rem;
    line-height: 1.5;
    width: 100%;
  }

  .task-infos {
    grid-area: infos;
    text-align: left;
    display: inline-block;
    width: 100%;
    padding-bottom: 1rem;

    #column-name {
      text-transform: uppercase;
      font-weight: 600;
    }
  }

  #task-description {
    background-color: transparent;
    border: none;
    line-height: 1.5;
    padding: 0.5rem 0;
    resize: none;
    height: 100%;
    width: 100%;
    grid-area: content;
  }
}
</style>
