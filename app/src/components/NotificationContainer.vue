<template>
  <div class="notification-container">
    <NotificationBar
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import NotificationBar from '@/components/NotificationBar.vue';
import { mapState } from 'vuex';

export default {
  components: {
    NotificationBar,
  },
  computed: {
    ...mapState('notifications', ['notifications']),
  },
};
</script>

<style lang="scss" scoped>
.notification-container {
  bottom: 0.625rem;
  position: fixed;
  right: 0.625rem;
  transition: var(--global-transition);
  z-index: 99999;
}
</style>
