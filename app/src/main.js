import '@/plugins/fontawesome';

import App from '@/App.vue';
import Vue from 'vue';
import axios from 'axios';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;

Vue.prototype.$appName = 'daytask';

new Vue({
  router,
  store,
  created() {
    const userString = localStorage.getItem('userData');

    if (userString) {
      const userData = JSON.parse(userString);
      this.$store.commit('auth/SET_USER_DATA', userData);
    }
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          this.$store.dispatch('auth/logout');
        }
        return Promise.reject(error);
      },
    );
  },
  render: (h) => h(App),
}).$mount('#app');
