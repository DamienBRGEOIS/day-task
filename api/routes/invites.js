import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  getInviteIdForBoardWithId,
  acceptBoardInvitationWithId,
  areInvitesEnabledForBoardWithId,
  removeInviteForBoardWithId,
} from '../controllers/invites.js';

const inviteRouter = Router();

inviteRouter.use(auth);

inviteRouter
  .get('/board/:boardId', getInviteIdForBoardWithId)
  .get('/:inviteId', acceptBoardInvitationWithId)
  .get('/check/:boardId', areInvitesEnabledForBoardWithId)
  .delete('/:boardId', removeInviteForBoardWithId);

export default inviteRouter;
