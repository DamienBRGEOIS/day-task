<template>
  <div id="board">
    <div id="board-name-container">
      <editable-text
        ref="boardName"
        v-model="board.name"
        :fontSize="1.25"
        @editableText:text-edited="onTextEdited"
      />
    </div>
    <div id="column-container" v-if="board">
      <board-column
        v-for="(column, $columnIndex) in board.columns"
        :key="$columnIndex"
        :boardId="boardId"
        :column="column"
        :columnIndex="$columnIndex"
      />
      <morphing-button
        button-text="Create a new column"
        font-awesome-icon="plus"
        @open-button:opened="onOpen"
        @open-button:outside-click="clearFields"
      >
        <form @submit.prevent="handleCreateColumn">
          <input
            autocomplete="off"
            id="column-name"
            name="column-name"
            placeholder="Enter the column's title..."
            ref="input"
            type="text"
            v-model="columnName"
          />
          <button type="submit" class="buttons">Create a new column</button>
        </form>
      </morphing-button>
    </div>
    <div id="task-background" v-if="isTaskOpen" @click.self="goToBoard">
      <router-view :board="board"></router-view>
    </div>
  </div>
</template>

<script>
import EditableText from '@/components/EditableText.vue';
import MorphingButton from '@/components/MorphingButton.vue';
import BoardColumn from '@/components/BoardColumn.vue';
import { mapActions, mapState } from 'vuex';

export default {
  props: ['boardId', 'taskId'],
  data() {
    return {
      columnName: '',
      isConfirmModalOpen: false,
      config: {},
    };
  },
  methods: {
    clearFields() {
      this.columnName = '';
    },
    handleCreateColumn() {
      if (this.columnName.trim().length === 0) {
        return;
      }

      this.createColumn({
        boardId: this.boardId,
        column: { name: this.columnName },
      });
      this.clearFields();
    },
    onOpen() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    goToBoard() {
      this.$router.push({
        name: 'Board',
        params: {
          boardId: this.boardId,
        },
      });
    },
    onTextEdited(name) {
      this.updateBoardWithId({
        boardId: this.board._id,
        board: {
          name,
        },
      });
    },
    ...mapActions('boards', ['fetchBoardWithId', 'createColumn', 'updateBoardWithId']),
  },
  computed: {
    isTaskOpen() {
      return this.$route.name === 'Task' && this.taskId;
    },
    ...mapState('boards', ['board']),
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    next((component) => {
      component.fetchBoardWithId(component.boardId);
    });
  },
  beforeRouteUpdate(routeTo, routeFrom, next) {
    this.fetchBoardWithId(this.boardId);

    if (routeTo.name === 'Board') {
      document.title = `${this.board.name} | ${this.$appName}`;
    }
    next();
  },
  components: {
    BoardColumn,
    MorphingButton,
    EditableText,
  },
  mounted() {
    // const pageTitle = `${this.board.name} | ${this.$appName}`;
    document.title = this.$appName;
  },
};
</script>

<style lang="scss" scoped>
#board {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6.25rem);
  overflow-y: auto;
  padding: 1rem;

  #board-name-container {
    margin-bottom: 1rem;
    text-align: left;
  }

  h1 {
    display: block;
    text-align: left;
  }

  #column-container {
    align-items: flex-start;
    display: flex;
    flex-direction: row;

    #column-name {
      border-radius: var(--global-border-radius);
      border: none;
      border: 2px solid var(--editable-text-border-color);
      box-shadow: none;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      width: calc(100% - 1.5rem);
    }
  }

  #task-background {
    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
