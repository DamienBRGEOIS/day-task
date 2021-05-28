import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';

import { User, validateLoginUser, validateRegisterUser } from '../models/User.js';

export const registerUser = async (request, response) => {
  const { error: errors } = validateRegisterUser(request.body);

  if (errors) {
    return response.status(400).json({
      errors: errors.details,
    });
  }

  try {
    let { username, email, password } = request.body;

    username = username.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const userExists = await User.exists({ email });

    if (userExists) {
      return response.status(400).json({
        errors: [{
          message: 'This email is already linked to an account',
        }],
      });
    }

    const user = await newUser.save();
    const token = jwt.sign({ user: newUser }, config.get('JWT_SECRET'));

    return response.status(201).json({ user, token });
  } catch (error) {
    return response.status(400).json({ error });
  }
};

export const loginUser = async (request, response) => {
  const { error: errors } = validateLoginUser(request.body);

  if (errors) {
    return response.status(400).json({
      errors: errors.details,
    });
  }

  try {
    let { email, password } = request.body;

    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(401).json({
        errors: [{
          message: 'Invalid email or password',
        }],
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return response.status(401).json({
        errors: [{
          message: 'Invalid email or password',
        }],
      });
    }

    const token = jwt.sign({ user }, config.get('JWT_SECRET'));

    return response.status(200).json({ user, token });
  } catch (error) {
    return response.status(400).json({ error });
  }
};
