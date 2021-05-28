import apiClient from '@/services/helpers/apiClient';

export default {
  getInviteLink(boardId) {
    return apiClient.get(`/api/invite/board/${boardId}`);
  },
  acceptBoardInvitationWithId(inviteId) {
    return apiClient.get(`/api/invite/${inviteId}`);
  },
  areInvitesEnabledForBoardWithId(boardId) {
    return apiClient.get(`/api/invite/check/${boardId}`);
  },
  removeInviteLink(boardId) {
    return apiClient.delete(`/api/invite/${boardId}`);
  },
};
