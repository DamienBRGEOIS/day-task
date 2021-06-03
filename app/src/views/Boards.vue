<template>
  <div class="boards">
    <h1>My boards</h1>
    <div class="boards-list">
      <router-link
        v-for="board in userBoards"
        :key="board._id"
        :to="`/board/${board._id}`"
      >
        <board
          :board="board"
          @board:delete="confirmDeleteBoard(board._id)"
          @board:name-changed="onNameChange($event, board)"
          @click.self="goToBoard(board._id)"
        />
      </router-link>
      <morphing-button
        button-text="Create a new board"
        font-awesome-icon="plus"
        @open-button:opened="onOpen"
        @open-button:outside-click="clearFields"
      >
        <form @submit.prevent="handleCreateBoard">
          <input
            autocomplete="off"
            id="board-name"
            name="board-name"
            placeholder="Enter the board's title..."
            ref="input"
            type="text"
            v-model="boardName"
          />
          <button type="submit" class="buttons">Create a new board</button>
        </form>
      </morphing-button>
    </div>
    <div v-if="invitedOnBoards.length > 0">
      <h1>Boards I'm invited in</h1>
      <div class="boards-list">
        <router-link
          v-for="board in invitedOnBoards"
          :key="board._id"
          :to="`/board/${board._id}`"
        >
          <board :board="board" :isEditable="false" />
        </router-link>
      </div>
    </div>
    <share-modal />
  </div>
</template>

<script>
import MorphingButton from '@/components/MorphingButton.vue';
import Board from '@/components/Board.vue';
import ModalEventBus from '@/events/ModalEventBus';
import ShareModal from '@/components/ShareModal.vue';
import authComputed from '@/store/helpers/authHelper';
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      boardName: '',
    };
  },
  computed: {
    userBoards() {
      return this.boards.filter((board) => board.author === this.userId);
    },
    invitedOnBoards() {
      return this.boards.filter((board) => board.guests.includes(this.userId));
    },
    ...authComputed,
    ...mapState('boards', ['boards']),
  },
  methods: {
    handleCreateBoard() {
      if (this.boardName.trim().length === 0) {
        return;
      }
      this.createBoard({
        name: this.boardName,
      });
      this.clearFields();
    },
    clearFields() {
      this.boardName = '';
    },
    onOpen() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    confirmDeleteBoard(boardId) {
      ModalEventBus.$emit('open-confirm-modal', {
        title: 'Delete this board ?',
        text: "The board and all it's columns & tasks will be permanantly deleted.",
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        confirmAction: this.deleteBoardWithId,
        confirmActionParams: [boardId],
      });
    },
    onNameChange(name, board) {
      this.updateBoardWithId({
        boardId: board._id,
        board: {
          name,
        },
      });
    },
    ...mapActions('boards', [
      'fetchBoards',
      'createBoard',
      'deleteBoardWithId',
      'updateBoardWithId',
    ]),
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    next((component) => {
      component.fetchBoards();
    });
  },
  beforeRouteUpdate() {
    this.fetchBoards();
  },
  components: {
    MorphingButton,
    Board,
    ShareModal,
  },
  created() {
    document.title = `My boards | ${this.$appName}`;
  },
};
</script>

<style lang="scss" scoped>
.boards {
  padding: 1rem;

  h1 {
    display: block;
    text-align: left;
  }

  .boards-list {
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    #board-name {
      border-radius: var(--global-border-radius);
      border: none;
      border: 2px solid var(--editable-text-border-color);
      box-shadow: none;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      width: calc(100% - 1.5rem);
    }

    a {
      color: var(--text-color);
      font-weight: 700;
      text-decoration: none;
    }
  }
}
</style>
