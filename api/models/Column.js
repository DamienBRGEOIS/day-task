import Joi from 'joi';
import Mongoose from 'mongoose';
import { taskSchema, taskJoiSchema } from './Task.js';

export const columnSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  tasks: { type: [taskSchema], default: [] },
  creationDate: { type: Date, default: Date.now },
  // TODO : Add author ObjectId
});

export const Column = Mongoose.model('Column', columnSchema);

export const validateColumn = (column) => {
  const schema = Joi.object({
    _id: Joi.string().alphanum().length(24),
    name: Joi.string().required(),
    tasks: Joi.array().items(taskJoiSchema),
    creationDate: Joi.string(),
  });

  return schema.validate(column);
};
