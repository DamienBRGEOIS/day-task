<template>
  <nav id="nav">
    <div id="nav__home-container">
      <router-link to="/">
        <font-awesome-icon icon="home" class="icon" />
      </router-link>
    </div>

    <div id="app-name">daytask</div>
    <div v-if="!loggedIn" id="nav__links">
      <router-link to="/login" id="nav__login-link">Login</router-link>
      <router-link to="/register">
        <button id="nav__register-button">Register</button>
      </router-link>
    </div>
    <div v-else id="nav__logged-in-user">
      <dropdown-menu
        :rightOffset="1"
        :topOffset="0.625"
        :menu-items="moreMenuItems"
        @logout="logout"
      >
        <div id="nav__logged-in-user__username">
          {{ username }}
        </div>
      </dropdown-menu>
    </div>
  </nav>
</template>

<script>
import authComputed from '@/store/helpers/authHelper';
import DropdownMenu from '@/components/DropdownMenu.vue';
import { mapActions } from 'vuex';

export default {
  name: 'AppNav',
  computed: {
    moreMenuItems() {
      return [
        {
          title: 'Logout',
          icon: 'sign-out-alt',
          event: 'logout',
        },
      ];
    },
    ...authComputed,
  },
  methods: {
    ...mapActions('auth', ['logout']),
  },
  components: {
    DropdownMenu,
  },
};
</script>

<style lang="scss" scoped>
#nav {
  align-items: center;
  background-color: var(--primary-color);
  display: flex;
  flex-direction: row;
  height: 1.5625rem;
  justify-items: flex-start;
  padding: 1rem;

  #nav__home-container {
    text-align: left;
    width: 11rem;
  }

  #nav__links {
    width: 11rem;

    #nav__login-link {
      color: var(--nav-color);
      font-weight: 500;
      margin-right: 1rem;
      transition: var(--global-transition);

      &:hover {
        color: var(--nav-color-hover);
      }
    }

    #nav__register-button {
      -webkit-appearance: none;
      background-color: var(--button-navigation-background-color);
      border-radius: var(--global-border-radius);
      border: 1px solid transparent;
      color: var(--button-color);
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      padding: 0.85em 1em;
      text-align: center;
      transition: var(--global-transition);
      vertical-align: middle;
      &:hover {
        background-color: var(--button-navigation-background-color-hover);
      }
    }
  }

  #nav__logged-in-user {
    #nav__logged-in-user__username {
      color: var(--nav-color);
      cursor: pointer;
      display: flex;
      transition: var(--global-transition);

      &:hover {
        color: var(--nav-color-hover);
      }
    }
  }

  .icon {
    color: var(--nav-color);

    &:hover {
      transition: var(--global-transition);
      color: var(--nav-color-hover);
    }
  }

  a {
    color: var(--text-color);
    text-decoration: none;
  }
}
</style>
