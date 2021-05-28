import { Board } from '../models/Board.js';
import Invite from '../models/Invite.js';
import { ownsBoard, isGuestOnBoard } from '../permissions/Board.js';

export const getInviteIdForBoardWithId = async (request, response) => {
  try {
    const { _id: userId } = request.userData;
    const { boardId } = request.params;

    const board = await Board.findOne({ _id: boardId });

    if (!ownsBoard(userId, board)) {
      return response.status(401).json({});
    }

    const invite = await Invite.findOne({ boardId });

    if (invite) {
      return response.status(200).json(invite._id);
    }

    const newInvite = new Invite({
      boardId,
    });

    newInvite.save();

    return response.status(200).json(newInvite._id);
  } catch (error) {
    return response.status(400).json({
      success: false,
      errors: error,
    });
  }
};

export const acceptBoardInvitationWithId = async (request, response) => {
  try {
    const { _id: userId } = request.userData;
    const { inviteId } = request.params;
    const invite = await Invite.findById(inviteId);
    const board = await Board.findById(invite.boardId);

    if (!isGuestOnBoard(userId, board) && !ownsBoard(userId, board)) {
      board.guests.push(userId);
    }

    board.save();

    return response.status(200).json({ boardId: board._id });
  } catch (error) {
    return response.status(400).json({
      success: false,
      errors: error,
    });
  }
};

export const areInvitesEnabledForBoardWithId = async (request, response) => {
  try {
    const { boardId } = request.params;

    const invite = await Invite.findOne({ boardId });

    if (invite) {
      return response.status(200).json({ areInvitesEnabled: true });
    }
    return response.status(200).json({ areInvitesEnabled: false });
  } catch (error) {
    return response.status(400).json({
      success: false,
      errors: error,
    });
  }
};

export const removeInviteForBoardWithId = async (request, response) => {
  try {
    const { boardId } = request.params;

    await Invite.remove({ boardId });

    return response.status(200).json({});
  } catch (error) {
    return response.status(400).json({
      success: false,
      errors: error,
    });
  }
};
