<template>
  <div
    class="share-modal-background"
    v-if="isOpen"
    @click.self.stop="closeModal"
  >
    <div class="share-modal-container">
      <div class="share-modal">
        <div class="share-modal__header">Invite on this board</div>
        <div class="share-modal__content">
          <span id="section-title">Link invite</span>
          <span id="activation-toggle-label" @click="toggleInviteActivation">{{
            activationToggleLabel
          }}</span>
          <p>
            <small>Anyone with this link can join this board as a member</small>
          </p>
          <div v-if="islinkInviteActivated">
            <input
              @focus="selectInput"
              id="link"
              name="link"
              ref="input"
              type="text"
              v-model="link"
            />
            <button @click="copyToClipboard">Copy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalEventBus from '@/events/ModalEventBus';
import InvitesService from '@/services/invitesService';
import config from '../../config/config';

export default {
  data() {
    return {
      isOpen: false,
      config: {},
      link: '',
      islinkInviteActivated: false,
    };
  },
  methods: {
    selectInput() {
      this.$refs.input.select();
    },
    copyToClipboard() {
      this.selectInput();
      document.execCommand('copy');
      const notification = {
        type: 'success',
        message: 'Invite link copied to clipboard!',
      };

      this.$store.dispatch('notifications/add', notification);
    },
    closeModal() {
      this.isOpen = false;
    },
    async toggleInviteActivation() {
      this.islinkInviteActivated = !this.islinkInviteActivated;
      if (this.islinkInviteActivated) {
        const response = await InvitesService.getInviteLink(this.boardId);

        this.link = `${config.baseUrl}invite/${response.data}`;
      } else {
        await InvitesService.removeInviteLink(this.boardId);
      }
    },
  },
  computed: {
    activationToggleLabel() {
      return this.islinkInviteActivated ? 'Disable' : 'Enable';
    },
  },
  mounted() {
    ModalEventBus.$on('open-share-modal', async (boardId) => {
      this.isOpen = true;
      this.boardId = boardId;

      const response = await InvitesService.areInvitesEnabledForBoardWithId(boardId);
      this.islinkInviteActivated = response.data.areInvitesEnabled;

      if (this.islinkInviteActivated) {
        const response_ = await InvitesService.getInviteLink(this.boardId);
        this.link = `${config.baseUrl}invite/${response_.data}`;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/animations.scss";

.share-modal-background {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: block;
  left: 0;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9999;

  .share-modal-container {
    left: 50%;
    max-height: 100%;
    max-height: 31.25rem;
    max-width: 18.75rem;
    min-width: 18.75rem;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);

    .share-modal {
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

      .share-modal__header {
        font-size: 1.125rem;
        font-weight: 600;
        padding: 1rem;
      }

      .share-modal__content {
        padding: 1rem;
        text-align: left;

        p {
          margin: 0.5rem 0;
        }

        input {
          border-radius: var(--global-border-radius);
          border: 1px solid rgba(0, 0, 0, 0.25);
          font-size: var(--global-font-size);
          margin-bottom: 1rem;
          padding: 0.5rem;
          width: calc(100% - 1rem);
        }

        button {
          background-color: var(--button-form-background-color);
          border-radius: var(--global-border-radius);
          border: none;
          color: var(--button-color);
          cursor: pointer;
          font-size: 0.875rem;
          margin-bottom: 0.875rem;
          padding: 0.875rem 0;
          transition: var(--global-transition);
          width: 100%;

          &:hover {
            background-color: var(--button-form-background-color-hover);
          }
        }

        #section-title {
          font-weight: 600;
        }
        #activation-toggle-label {
          float: right;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
