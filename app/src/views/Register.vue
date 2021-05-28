<template>
  <div class="form-container">
    <form @submit.prevent="onSubmit">
      <h1>Register</h1>
      <label for="username">Username : </label>
      <input
        id="username"
        minlength="6"
        name="username"
        required
        type="text"
        v-model="username"
      />

      <label for="email">Email : </label>
      <input v-model="email" type="email" name="email" id="email" required />

      <label for="password">Password : </label>
      <input
        id="password"
        minlength="8"
        name="password"
        required
        type="password"
        v-model="password"
      />

      <button type="submit" name="button">Register</button>

      <ul id="error-list" v-if="errors">
        <li
          class="error"
          v-for="(error, $errorIndex) in errors"
          :key="$errorIndex"
        >
          {{ error.message }}
        </li>
      </ul>

      <router-link to="/login"> Already have an account ? Login. </router-link>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errors: null,
    };
  },
  methods: {
    onSubmit() {
      this.register({
        username: this.username.trim(),
        email: this.email.trim().toLowerCase(),
        password: this.password.trim(),
      })
        .then(() => {
          this.$router.push({ name: 'Boards' });
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
    ...mapActions('auth', ['register']),
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6.25rem);

  form {
    align-items: center;
    background: var(--form-background-color);
    border-radius: var(--global-border-radius);
    box-shadow: var(--form-shadow);
    display: flex;
    flex-direction: column;
    margin: 2.5rem 0;
    padding: 2rem 1rem;
    width: 25rem;

    h1 {
      margin-top: 0;
    }

    label {
      font-weight: 600;
      margin-bottom: 0.25rem;
      text-align: left;
      width: calc(100% - 1rem);
    }

    input {
      border-radius: var(--global-border-radius);
      border: 1px solid rgba(0, 0, 0, 0.25);
      font-size: var(--global-font-size);
      margin-bottom: 1rem;
      padding: 0.5rem;
      width: calc(100% - 2rem);
    }

    button {
      background-color: var(--button-form-background-color);
      border-radius: var(--global-border-radius);
      border: none;
      color: var(--button-color);
      cursor: pointer;
      font-size: 0.9em;
      margin-bottom: 1rem;
      padding: 1rem 0;
      transition: var(--global-transition);
      width: calc(100% - 1rem);

      &:hover {
        background-color: var(--button-form-background-color-hover);
      }
    }
    #error-list {
      color: red;
      list-style: none;
      margin-bottom: 1rem;
    }
    a {
      color: var(--link-form-color);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
