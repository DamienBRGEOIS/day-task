<template>
  <div id="app">
    <app-nav />
    <router-view />
    <notification-container />
    <confirm-modal />
  </div>
</template>
<script>
import AppNav from '@/components/AppNav.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import ModalEventBus from '@/events/modal-event-bus';
import NotificationContainer from '@/components/NotificationContainer.vue';

export default {
  components: {
    ConfirmModal,
    NotificationContainer,
    AppNav,
  },
  mounted() {
    ModalEventBus.$on('modal:confirm-action', ({ action, params }) => {
      action(...params);
    });
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/fonts.scss";
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/scrollbar.scss";

* {
  font-family: var(--global-font-family);
  margin: 0;
  padding: 0;
}

h1 {
  font-size: var(--title-font-size);
  margin: 1rem 0;
}

body {
  background-color: var(--secondary-color);
  margin: 0;
  padding: 0;
  color: var(--text-color);
}

#app-name {
  color: var(--logo-color);
  display: flex;
  flex-grow: 1;
  font-family: var(--logo-font-family);
  font-size: var(--logo-font-size);
  font-weight: var(--logo-font-weight);
  justify-content: center;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
}

.buttons {
  background-color: var(--success-color);
  border-radius: var(--global-border-radius);
  border: none;
  color: var(--button-color);
  cursor: pointer;
  padding: 0.5rem 1rem;
}

#app {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-align: center;
}
</style>
