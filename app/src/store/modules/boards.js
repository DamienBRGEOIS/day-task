/* eslint-disable no-shadow */
import BoardService from '@/services/boardService';

export const namespaced = true;

export const state = {
  boards: [],
  board: {},
};

export const mutations = {
  CREATE_BOARD(state, board) {
    state.boards.push(board);
  },
  SET_BOARDS(state, boards) {
    state.boards = boards;
  },
  SET_BOARD(state, board) {
    state.board = board;
  },
  UPDATE_BOARD(state, newBoard) {
    const boardIndex = state.boards.findIndex((board) => board._id === newBoard._id);
    state.boards[boardIndex] = newBoard;
  },
  DELETE_BOARD(state, boardId) {
    state.boards = state.boards.filter((board) => board._id !== boardId);
  },
  CREATE_COLUMN(state, column) {
    state.board.columns.push(column);
  },
  DELETE_COLUMN(state, columnId) {
    state.board.columns = state.board.columns.filter((column) => column._id !== columnId);
  },
  SET_COLUMN(state, newColumn) {
    const index = state.board.columns.findIndex((column) => column._id === newColumn._id);
    state.board.columns[index] = newColumn;
  },
  CREATE_TASK(state, { columnId, task }) {
    const indexColumn = state.board.columns.findIndex((column) => column._id === columnId);
    state.board.columns[indexColumn].tasks.push(task);
  },
  UPDATE_TASK(state, { columnId, taskId, editedTask }) {
    const indexColumn = state.board.columns.findIndex((column) => column._id === columnId);
    const indexTask = state.board.columns[indexColumn]
      .tasks.findIndex((task) => task._id === taskId);
    state.board.columns[indexColumn].tasks[indexTask] = editedTask;
  },
  DELETE_TASK(state, { columnId, taskId }) {
    const indexColumn = state.board.columns.findIndex((column) => column._id === columnId);
    state.board.columns[indexColumn].tasks = state.board.columns[indexColumn].tasks
      .filter((task) => task._id !== taskId);
  },
  MOVE_TASK(state, {
    columnId, taskId, toColumnId, destinationIndex,
  }) {
    const fromColumn = state.board.columns.find((column) => column._id === columnId);
    const taskIndex = fromColumn.tasks.findIndex((task) => task._id === taskId);
    const taskToMove = fromColumn.tasks.splice(taskIndex, 1)[0];
    const toColumn = state.board.columns.find((column) => column._id === toColumnId);
    toColumn.tasks.splice(destinationIndex, 0, taskToMove);
  },
  MOVE_COLUMN(state, { columnId, destinationIndex }) {
    const columnList = state.board.columns;
    const fromColumnIndex = columnList.findIndex((column) => column._id === columnId);
    const columnToMove = columnList.splice(fromColumnIndex, 1)[0];
    columnList.splice(destinationIndex, 0, columnToMove);
  },
};

export const actions = {
  async createBoard({ commit, dispatch }, board) {
    return BoardService.postBoard(board).then((response) => {
      commit('CREATE_BOARD', response.data);
      const notification = {
        type: 'success',
        message: 'Board successfully created !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  fetchBoards({ commit }) {
    BoardService.getBoards().then((response) => {
      commit('SET_BOARDS', response.data);
    }).catch((error) => {
      throw error;
    });
  },
  fetchBoardWithId({ commit, getters }, id) {
    const board = getters.getBoardWithId(id);
    if (board) {
      commit('SET_BOARD', board);
    } else {
      BoardService.getBoardWithId(id).then((response) => {
        commit('SET_BOARD', response.data);
      }).catch((error) => {
        throw error;
      });
    }
  },
  deleteBoardWithId({ commit, dispatch }, id) {
    BoardService.deleteBoardWithId(id).then(() => {
      commit('DELETE_BOARD', id);
      const notification = {
        type: 'success',
        message: 'Board successfully deleted !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  updateBoardWithId({ commit, dispatch }, { boardId, board }) {
    BoardService.updateBoardWithId(boardId, board).then((response) => {
      commit('UPDATE_BOARD', response.data);
      const notification = {
        type: 'success',
        message: 'Board successfully updated !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  createColumn({ commit, dispatch }, { boardId, column }) {
    return BoardService.postColumn(boardId, column).then((response) => {
      commit('CREATE_COLUMN', response.data);
      const notification = {
        type: 'success',
        message: 'Column successfully created !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  deleteColumnWithId({ commit, dispatch }, { boardId, columnId }) {
    BoardService.deleteColumnWithId(boardId, columnId).then(() => {
      commit('DELETE_COLUMN', columnId);
      const notification = {
        type: 'success',
        message: 'Column successfully deleted !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  updateColumnWithId({ commit, dispatch }, { boardId, column }) {
    BoardService.updateColumnWithId(boardId, column).then((response) => {
      commit('SET_COLUMN', response.data);
      const notification = {
        type: 'success',
        message: 'Column successfully updated !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  createTask({ commit, dispatch }, { boardId, columnId, task }) {
    BoardService.createTask(boardId, columnId, task).then(() => {
      commit('CREATE_TASK', { columnId, task });
      const notification = {
        type: 'success',
        message: 'Task successfully created !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  updateTaskWithId({ commit, dispatch }, {
    boardId, columnId, taskId, task,
  }) {
    BoardService.editTaskWithId(boardId, columnId, taskId, task).then((response) => {
      const editedTask = response.data;
      commit('UPDATE_TASK', { columnId, taskId, editedTask });
      const notification = {
        type: 'success',
        message: 'Task successfully edited !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  deleteTaskWithId({ commit, dispatch }, { boardId, columnId, taskId }) {
    BoardService.deleteTaskWithId(boardId, columnId, taskId).then(() => {
      commit('DELETE_TASK', { columnId, taskId });
      const notification = {
        type: 'success',
        message: 'Task successfully deleted !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  moveTaskWithId({ commit, dispatch }, {
    boardId, columnId, taskId, toColumnId, destinationIndex,
  }) {
    BoardService.moveTaskWithId(
      boardId,
      columnId,
      taskId,
      toColumnId,
      destinationIndex,
    ).then(() => {
      commit('MOVE_TASK', {
        columnId, taskId, toColumnId, destinationIndex,
      });
      const notification = {
        type: 'success',
        message: 'Task successfully moved !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
  moveColumnWithId({ commit, dispatch }, { boardId, columnId, destinationIndex }) {
    BoardService.moveColumnWithId(boardId, columnId, destinationIndex).then(() => {
      commit('MOVE_COLUMN', { columnId, destinationIndex });
      const notification = {
        type: 'success',
        message: 'Column successfully moved !',
      };
      dispatch('notifications/add', notification, { root: true });
    }).catch((error) => {
      throw error;
    });
  },
};

export const getters = {
  getBoardWithId: (state) => (boardId) => {
    const board = state.boards.find((board) => board.id === boardId);
    return board;
  },
  getBoard: (state) => state.board,
};
