export const ownsBoard = (userId, board) => board.author.equals(userId);
export const isGuestOnBoard = (userId, board) => board.guests.includes(userId);
export const canEditBoard = (userId, board) => ownsBoard(userId, board) || isGuestOnBoard(userId, board);
export const canViewBoard = (userId, board) => ownsBoard(userId, board) || isGuestOnBoard(userId, board);
