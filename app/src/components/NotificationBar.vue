<template>
  <div :class="['notification-bar', notificationTypeClass]">
    <p>{{ notification.message }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'NotificationBar',
  props: {
    notification: { type: Object, require: true },
    duration: { type: Number, default: 4000 },
  },
  data() {
    return {
      timeout: null,
    };
  },
  mounted() {
    this.timeout = setTimeout(() => {
      this.remove(this.notification);
    }, this.duration);
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
  },
  computed: {
    notificationTypeClass() {
      return `-text-${this.notification.type}`;
    },
  },
  methods: {
    ...mapActions('notifications', ['remove']),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/animations.scss";

div {
  animation: scale-up-center 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  border-radius: var(--global-border-radius);
  border: none;
  color: var(--notification-color);
  margin-top: 0.5rem;
  padding: 1rem;
  box-shadow: var(--notification-shadow);
}

.-text-error {
  background: --notification-error-background;
}

.-text-success {
  background: var(--notification-success-background);
}
</style>
