<template>
  <div class="modal-background" v-if="isOpen" @click.self.stop="closeModal">
    <div class="modal-container">
      <div class="modal">
        <div class="modal__header">
          {{ config.title }}
        </div>
        <div class="modal__content">
          {{ config.text }}
        </div>
        <div class="modal__footer">
          <button class="cancel-button buttons" @click.self.stop="cancelAction">
            {{ config.cancelButtonText }}
          </button>
          <button
            class="confirm-button buttons"
            @click.self.stop="confirmAction"
          >
            {{ config.confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalEventBus from '@/events/ModalEventBus';

export default {
  data() {
    return {
      isOpen: false,
      config: {},
    };
  },
  methods: {
    cancelAction() {
      ModalEventBus.$emit('modal:cancel-action');
      this.closeModal();
    },
    confirmAction() {
      ModalEventBus.$emit('modal:confirm-action', {
        action: this.config.confirmAction,
        params: this.config.confirmActionParams,
      });
      this.closeModal();
    },
    closeModal() {
      this.isOpen = false;
    },
  },
  mounted() {
    ModalEventBus.$on('open-confirm-modal', (config) => {
      this.config = config;
      this.isOpen = true;
    });
  },
  beforeDestroy() {
    ModalEventBus.$off();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/animations.scss";

.modal-background {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: block;
  left: 0;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9999;

  .modal-container {
    left: 50%;
    max-height: 100%;
    max-height: 31.25rem;
    max-width: 43.75rem;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);

    .modal {
      animation: scale-up-center 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
      background-color: var(--modal-background-color);
      border-radius: var(--global-border-radius);
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
      padding: 1rem;
      position: relative;
      width: 100%;

      .modal__header {
        font-weight: 600;
        padding: 1rem;
      }

      .modal__content {
        padding: 1rem;
      }

      .modal__footer {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 1rem;

        .buttons {
          margin-left: 0.5rem;

          &.cancel-button {
            background-color: dimgray;
          }

          &.confirm-button {
            background-color: orangered;
          }
        }
      }
    }
  }
}
</style>
