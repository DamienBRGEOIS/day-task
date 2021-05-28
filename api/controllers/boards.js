/* eslint-disable no-underscore-dangle */
import { Board, validateBoard } from '../models/Board.js';
import { Column, validateColumn } from '../models/Column.js';
import { Task, validateTask } from '../models/Task.js';
import { canEditBoard, canViewBoard } from '../permissions/Board.js';

export const getAllUserBoards = async (request, response) => {
  try {
    const { _id: userId } = request.userData;
    const boards = await Board.find().or([{ author: userId }, { guests: [userId] }]);
    return response.status(200).json(boards);
  } catch (error) {
    return response.status(400).json({
      errors: error,
    });
  }
};

export const createBoard = async (request, response) => {
  const { error: errors } = validateBoard(request.body);

  if (errors) {
    return response.status(400).json({
      errors: errors.details,
    });
  }

  try {
    const { _id: userId } = request.userData;
    const { name } = request.body;
    const board = new Board({
      name,
      author: userId,
    });

    const result = await board.save();

    return response.status(201).json(result);
  } catch (error) {
    return response.status(400).json({
      errors: error,
    });
  }
};

export const getBoardWithId = async (request, response) => {
  try {
    const { _id: userId } = request.userData;
    const { boardId } = request.params;

    const board = await Board.findOne({ _id: boardId });

    if (!canViewBoard(userId, board)) {
      return response.status(401).json({});
    }

    return response.status(200).json(board);
  } catch (error) {
    return response.status(400).json({
      errors: error,
    });
  }
};

export const updateBoardWithId = async (request, response) => {
  const { error: errors } = validateBoard(request.body);

  if (errors) {
    return response.status(400).json({
      errors: errors.details,
    });
  }

  try {
    const { _id: userId } = request.userData;
    const { boardId } = request.params;
    const { name } = request.body;

    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    board.name = name;
    board.save();

    return response.status(200).json(board);
  } catch (error) {
    return response.status(400).json({
      errors: error,
    });
  }
};

export const deleteBoardWithId = async (request, response) => {
  const { boardId } = request.params;

  try {
    const { _id: userId } = request.userData;

    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    await Board.remove(board);

    return response.status(204).json({});
  } catch (error) {
    return response.status(400).json({
      errors: error,
    });
  }
};

export const addColumnToBoard = async (request, response) => {
  const { error: errors } = validateColumn(request.body);

  if (errors) {
    return response.status(400).json({
      errors: errors.details,
    });
  }

  try {
    const { _id: userId } = request.userData;
    const { boardId } = request.params;
    const { name } = request.body;

    const columnToAdd = new Column({ name });
    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    board.columns.push(columnToAdd);
    board.save();

    return response.status(200).json(columnToAdd);
  } catch (error) {
    return response.status(400).json({
      errors: error,
    });
  }
};

export const deleteColumnWithId = async (request, response) => {
  try {
    const { _id: userId } = request.userData;
    const { boardId, columnId } = request.params;

    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    const columnToDelete = board.columns.find((column) => column._id.equals(columnId));
    board.columns = board.columns.filter((column) => column._id !== columnToDelete._id);
    board.save();

    return response.status(204).json({});
  } catch (error) {
    return response.status(400).json({
      errors: error,
    });
  }
};

export const editColumnWithId = async (request, response) => {
  const { error: errors } = validateColumn(request.body);

  if (errors) {
    return response.status(400).json({
      errors: errors.details,
    });
  }
  try {
    const { _id: userId } = request.userData;
    const { boardId, columnId } = request.params;
    const { name } = request.body;

    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    const columnToEdit = board.columns.find((column) => column._id.equals(columnId));
    columnToEdit.name = name;
    board.save();

    return response.status(200).json(columnToEdit);
  } catch (error) {
    return response.status(400).json({
      errors: error,
    });
  }
};

export const addTaskToColumn = async (request, response) => {
  const { error: errors } = validateTask(request.body);

  if (errors) {
    return response.status(400).json({
      errors: errors.details,
    });
  }

  try {
    const { _id: userId } = request.userData;

    const { boardId, columnId } = request.params;
    const { name, description } = request.body;

    const task = new Task({ name, description });
    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    const columnToEdit = board.columns.find((column) => column._id.equals(columnId));
    columnToEdit.tasks.push(task);
    board.save();
    return response.status(200).json(task);
  } catch (error) {
    return response.status(400).json({
      errors: errors.details,
    });
  }
};

export const editTaskWithId = async (request, response) => {
  const { error: errors } = validateTask(request.body);

  if (errors) {
    return response.status(400).json({
      errors: errors.details,
    });
  }

  try {
    const { boardId, columnId, taskId } = request.params;
    const { name, description } = request.body;

    const board = await Board.findById(boardId);
    const columnToEdit = board.columns.find((column) => column._id.equals(columnId));
    const taskToEdit = columnToEdit.tasks.find((task) => task._id.equals(taskId));
    taskToEdit.name = name;
    taskToEdit.description = description;
    board.save();

    return response.status(200).json(taskToEdit);
  } catch (error) {
    return response.status(400).json({
      errors: error.details,
    });
  }
};

export const deleteTaskWithId = async (request, response) => {
  try {
    const { _id: userId } = request.userData;
    const { boardId, columnId, taskId } = request.params;
    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    const columnToEdit = board.columns.find((column) => column._id.equals(columnId));
    columnToEdit.tasks = columnToEdit.tasks.filter((task) => !task._id.equals(taskId));
    board.save();

    return response.status(200).json({});
  } catch (error) {
    return response.status(400).json({
      errors: error.details,
    });
  }
};

export const moveTaskWithId = async (request, response) => {
  try {
    const {
      boardId,
      columnId,
      taskId,
      toColumnId,
      destinationIndex,
    } = request.params;

    const { _id: userId } = request.userData;
    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    const fromColumn = board.columns.find((column) => column._id.equals(columnId));
    const toColumn = board.columns.find((column) => column._id.equals(toColumnId));
    const taskIndex = fromColumn.tasks.findIndex((task) => task._id.equals(taskId));
    const taskToMove = fromColumn.tasks.splice(taskIndex, 1)[0];
    toColumn.tasks.splice(destinationIndex, 0, taskToMove);
    board.save();

    return response.status(200).json(toColumn);
  } catch (error) {
    return response.status(400).json({
      errors: error.details,
    });
  }
};

export const moveColumnWithId = async (request, response) => {
  try {
    const { _id: userId } = request.userData;
    const { boardId, columnId, destinationIndex } = request.params;

    const board = await Board.findById(boardId);

    if (!canEditBoard(userId, board)) {
      return response.status(401).json({});
    }

    const columnList = board.columns;
    const fromColumnIndex = columnList.findIndex((column) => column._id.equals(columnId));
    const columnToMove = columnList.splice(fromColumnIndex, 1)[0];
    columnList.splice(destinationIndex, 0, columnToMove);
    board.save();

    return response.status(200).json(columnList);
  } catch (error) {
    return response.status(400).json({
      errors: error.details,
    });
  }
};
