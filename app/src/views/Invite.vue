<template>
  <div></div>
</template>

<script>
import InvitesService from '@/services/invitesService';

export default {
  props: ['inviteId'],
  async mounted() {
    const response = await InvitesService.acceptBoardInvitationWithId(this.inviteId);
    const { boardId } = response.data;
    if (boardId) {
      this.$router.push({
        name: 'Board',
        params: {
          boardId,
        },
      });
      const notification = {
        type: 'success',
        message: 'You joined a new board !',
      };

      this.$store.dispatch('notifications/add', notification);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
