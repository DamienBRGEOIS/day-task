/* eslint-disable no-underscore-dangle */
import apiClient from '@/services/helpers/apiClient';

export default {
  getBoards() {
    return apiClient.get('/api/boards');
  },
  getBoardWithId(boardId) {
    return apiClient.get(`/api/boards/${boardId}`);
  },
  postBoard(board) {
    return apiClient.post('/api/boards', board);
  },
  updateBoardWithId(boardId, board) {
    return apiClient.patch(`/api/boards/${boardId}`, board);
  },
  deleteBoardWithId(boardId) {
    return apiClient.delete(`/api/boards/${boardId}`);
  },
  postColumn(boardId, column) {
    return apiClient.post(`/api/boards/${boardId}/columns`, column);
  },
  deleteColumnWithId(boardId, columnId) {
    return apiClient.delete(`/api/boards/${boardId}/columns/${columnId}`);
  },
  updateColumnWithId(boardId, column) {
    return apiClient.patch(`/api/boards/${boardId}/columns/${column._id}`, column);
  },
  createTask(boardId, columnId, task) {
    return apiClient.post(`/api/boards/${boardId}/columns/${columnId}/tasks`, task);
  },
  editTaskWithId(boardId, columnId, taskId, task) {
    return apiClient.patch(`/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`, task);
  },
  deleteTaskWithId(boardId, columnId, taskId) {
    return apiClient.delete(`/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
  },
  moveTaskWithId(boardId, columnId, taskId, toColumnId, destinationIndex) {
    return apiClient.post(`/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}/move/${toColumnId}/index/${destinationIndex}`);
  },
  moveColumnWithId(boardId, columnId, destinationIndex) {
    return apiClient.post(`/api/boards/${boardId}/columns/${columnId}/index/${destinationIndex}`);
  },
};
