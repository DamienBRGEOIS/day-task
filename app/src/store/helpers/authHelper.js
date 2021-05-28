import { mapGetters } from 'vuex';

const authComputed = {
  ...mapGetters('auth', ['loggedIn', 'username', 'userId']),
};

export default authComputed;
