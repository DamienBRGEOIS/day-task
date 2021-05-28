/* eslint-disable no-shadow */

export const namespaced = true;
export const state = {
  notifications: [],
};

let nextId = 1;

export const mutations = {
  PUSH(state, notification) {
    nextId += 1;
    state.notifications.push({
      ...notification,
      id: nextId,
    });
  },
  DELETE(state, notificationToRemove) {
    state.notifications = state.notifications.filter(
      (notification) => notificationToRemove.id !== notification.id,
    );
  },
};

export const actions = {
  add({ commit }, notification) {
    commit('PUSH', notification);
  },
  remove({ commit }, notification) {
    commit('DELETE', notification);
  },
};
