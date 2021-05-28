import express from 'express';
import Mongoose from 'mongoose';
import config from 'config';
import debug from 'debug';
import cors from 'cors';

import boardRouter from './routes/boards.js';
import authRouter from './routes/auth.js';
import inviteRouter from './routes/invites.js';

const databaseDebugger = debug('api:db');
const serverDebugger = debug('api:server');

const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

app.use(express.json());

app.use('/api/boards', boardRouter);
app.use('/api/auth', authRouter);
app.use('/api/invite', inviteRouter);

Mongoose.connect(config.get('connectionString'), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => databaseDebugger('Connected to MongoDB...'))
  .catch((error) => databaseDebugger('Could not connect to MongoDB :', error));

app.listen(port, () => {
  serverDebugger(`Listening on port ${port} ...`);
});
