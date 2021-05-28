import Joi from 'joi';
import Mongoose from 'mongoose';

export const taskSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, defafult: '' },
  creationDate: { type: Date, default: Date.now },
  // TODO : Add author ObjectId
});

export const Task = Mongoose.model('Task', taskSchema);

export const taskJoiSchema = Joi.object({
  _id: Joi.string().alphanum().length(24),
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  creationDate: Joi.string(),
});

export const validateTask = (task) => taskJoiSchema.validate(task);
