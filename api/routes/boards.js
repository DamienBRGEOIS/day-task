import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  getAllUserBoards,
  createBoard,
  getBoardWithId,
  updateBoardWithId,
  deleteBoardWithId,
  addColumnToBoard,
  deleteColumnWithId,
  editColumnWithId,
  addTaskToColumn,
  editTaskWithId,
  deleteTaskWithId,
  moveTaskWithId,
  moveColumnWithId,
} from '../controllers/boards.js';

const boardRouter = Router();

boardRouter.use(auth);

boardRouter
  .get('/', getAllUserBoards)
  .post('/', createBoard)
  .get('/:boardId', getBoardWithId)
  .patch('/:boardId', updateBoardWithId)
  .delete('/:boardId', deleteBoardWithId);

boardRouter
  .post('/:boardId/columns', addColumnToBoard)
  .delete('/:boardId/columns/:columnId', deleteColumnWithId)
  .patch('/:boardId/columns/:columnId', editColumnWithId);

boardRouter
  .post('/:boardId/columns/:columnId/tasks', addTaskToColumn)
  .patch('/:boardId/columns/:columnId/tasks/:taskId', editTaskWithId)
  .delete('/:boardId/columns/:columnId/tasks/:taskId', deleteTaskWithId)
  .post('/:boardId/columns/:columnId/tasks/:taskId/move/:toColumnId/index/:destinationIndex', moveTaskWithId)
  .post('/:boardId/columns/:columnId/index/:destinationIndex', moveColumnWithId);

export default boardRouter;
