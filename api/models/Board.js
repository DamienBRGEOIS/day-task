import Joi from 'joi';
import Mongoose from 'mongoose';
import { columnSchema } from './Column.js';

const boardSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  columns: { type: [columnSchema], default: [] },
  creationDate: { type: Date, default: Date.now },
  author: { type: Mongoose.Schema.Types.ObjectId, required: true },
  guests: [
    { type: Mongoose.Schema.Types.ObjectId, required: true },
  ],
});

export const Board = Mongoose.model('Board', boardSchema);

export const validateBoard = (board) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return schema.validate(board);
};
