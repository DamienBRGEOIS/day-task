/* eslint-disable no-shadow */
import AuthService from '@/services/authService';
import apiClient from '@/services/helpers/apiClient';

export const namespaced = true;

export const state = {
  userData: null,
};

export const mutations = {
  SET_USER_DATA(state, userData) {
    state.userData = userData;
    localStorage.setItem('userData', JSON.stringify(userData));
    apiClient.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
  },
  CLEAR_USER_DATA() {
    localStorage.removeItem('userData');
    document.location.reload();
  },
};

export const actions = {
  async register({ commit }, credentials) {
    return AuthService.register(credentials).then((response) => {
      commit('SET_USER_DATA', response.data);
    });
  },
  async login({ commit }, credentials) {
    return AuthService.login(credentials).then((response) => {
      commit('SET_USER_DATA', response.data);
    });
  },
  async logout({ commit }) {
    commit('CLEAR_USER_DATA');
  },
};

export const getters = {
  loggedIn(state) {
    return !!state.userData;
  },
  username(state) {
    return state.userData.user.username;
  },
  userId(state) {
    return state.userData.user._id;
  },
};
