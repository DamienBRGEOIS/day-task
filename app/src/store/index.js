import * as auth from '@/store/modules/auth';
import * as boards from '@/store/modules/boards';
import * as notifications from '@/store/modules/notifications';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    boards,
    notifications,
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
  },
});
