<template>
  <div :class="[{ 'is-open': isOpen }, 'morphing-button']" :style="style">
    <div
      @click.capture="open"
      class="morphing-button__trigger"
      v-show="!isOpen"
    >
      <font-awesome-icon
        :icon="fontAwesomeIcon"
        class="icon"
        v-if="fontAwesomeIcon"
      />
      <span>{{ buttonText }}</span>
    </div>
    <div class="morphing-button__content" v-if="isOpen">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MorphingButton',
  props: {
    buttonText: {
      type: String,
      required: true,
    },
    fontAwesomeIcon: {
      type: String,
    },
    backgroundColor: {
      type: String,
      default: 'rgba(255,255,255,0.2)',
    },
    hoverBackgroundColor: {
      type: String,
      default: 'rgba(31, 60, 73, 0.08)',
    },
    marginX: {
      type: Number,
      default: 0.875,
    },
    triggerTextAlign: {
      type: String,
      default: 'center',
    },
    triggerPaddingX: {
      type: Number,
      default: 1,
    },
    triggerPaddingY: {
      type: Number,
      default: 1.375,
    },
    contentPaddingX: {
      type: Number,
      default: 1,
    },
    contentPaddingY: {
      type: Number,
      default: 1,
    },
    textColor: {
      type: String,
      default: 'var(--white)',
    },
    openBackgroundColor: {
      type: String,
      default: 'rgba(255,255,255,0.35)',
    },
    openByDefault: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: this.openByDefault,
    };
  },
  methods: {
    open() {
      this.isOpen = true;
      this.$emit('open-button:opened');
    },
    handleOutsideClick(event) {
      const componentElement = this.$el;
      let targetElement = event.target;

      do {
        if (targetElement === componentElement || componentElement.contains(targetElement)) {
          return;
        }

        targetElement = targetElement.parentNode;
      } while (targetElement);

      this.isOpen = false;
      this.$emit('open-button:outside-click');
    },
  },
  computed: {
    style() {
      return {
        '--background-color': this.backgroundColor,
        '--hover-background-color': this.hoverBackgroundColor,
        '--open-background-color': this.openBackgroundColor,
        '--margin-x': `${this.marginX}rem`,
        '--padding-trigger': `${this.triggerPaddingY}rem ${this.triggerPaddingX}rem`,
        '--padding-content': `${this.contentPaddingY}rem ${this.contentPaddingX}rem`,
        '--color': this.textColor,
        '--text-align-trigger': this.triggerTextAlign,
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
  created() {
    if (this.openByDefault) {
      this.$emit('open-button:opened');
    }
  },
};
</script>

<style lang="scss" scoped>
.morphing-button {
  background-color: var(--background-color);
  border-radius: var(--global-border-radius);
  color: var(--color);
  cursor: pointer;
  min-width: 15.625rem;
  text-align: left;
  transition: var(--global-transition);

  &:hover {
    background-color: var(--hover-background-color);
  }

  &.is-open {
    background-color: var(--open-background-color);
    height: auto;
  }

  .icon {
    margin-right: 0.5rem;
  }
  .morphing-button__trigger {
    padding: var(--padding-trigger);
    text-align: var(--text-align-trigger);
  }

  .morphing-button__content {
    cursor: initial;
    padding: var(--padding-content);
  }
}
</style>
