import Joi from 'joi';

import Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
});

export const User = Mongoose.model('User', userSchema);

export const validateRegisterUser = (board) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(6).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required(),
  });

  return schema.validate(board, { abortEarly: false });
};

export const validateLoginUser = (board) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required(),
  });

  return schema.validate(board, { abortEarly: false });
};
