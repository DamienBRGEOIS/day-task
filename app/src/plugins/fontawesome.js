import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);
