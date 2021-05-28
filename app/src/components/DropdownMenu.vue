<template>
  <div class="dropdown-menu">
    <div
      class="dropdown-menu__activator"
      @click.capture.stop.prevent="isOpen = !isOpen"
    >
      <slot></slot>
    </div>
    <div class="dropdown-menu__content" v-show="isOpen" :style="style">
      <ul>
        <li
          v-for="(menuItem, $itemIndex) in menuItems"
          :key="$itemIndex"
          @click.stop.prevent="onClick(menuItem.event)"
        >
          {{ menuItem.title }}
          <font-awesome-icon
            class="icon"
            v-if="menuItem.icon"
            :icon="menuItem.icon"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
    rightOffset: {
      type: Number,
      default: 0,
    },
    topOffset: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return { isOpen: false };
  },
  methods: {
    onClick(event) {
      this.$emit(event);
      this.close();
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    handleOutsideClick(event) {
      const componentElement = this.$el;
      let targetElement = event.target;

      do {
        if (targetElement === componentElement) {
          return;
        }

        targetElement = targetElement.parentNode;
      } while (targetElement);
      this.close();
    },
  },
  computed: {
    style() {
      return {
        '--right-offset': `${this.rightOffset}rem`,
        '--top-offset': `${this.topOffset}rem`,
      };
    },
  },
  watch: {
    isOpen(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        document.addEventListener('click', this.handleOutsideClick);
      } else {
        document.removeEventListener('click', this.handleOutsideClick);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-menu {
  font-weight: 500;
  .dropdown-menu__background {
    background-color: rgba(0, 0, 0, 0.25);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 9998;
  }
  .dropdown-menu__activator {
    visibility: visible;
  }

  .dropdown-menu__content {
    background-color: var(--dropdown-menu-background-color);
    border-radius: var(--global-border-radius);
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.15);
    padding: 0.5rem;
    position: absolute;
    right: var(--right-offset);
    margin-top: var(--top-offset);
    visibility: visible;
    width: 11.25rem;
    z-index: 9999;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      padding: 0;

      li {
        border-radius: var(--global-border-radius);
        padding: 0.5rem 1rem;
        text-align: left;

        &:hover {
          background-color: rgba(9, 30, 66, 0.08);
          cursor: pointer;
        }

        .icon {
          float: right;
        }
      }
    }
  }
}
</style>
