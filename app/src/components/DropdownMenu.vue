<template>
  <div class="dropdown-menu">
    <div class="dropdown-menu__content" v-if="isOpen">
      <ul v-if="config && config.items">
        <li
          v-for="(item, $itemIndex) in config.items"
          :key="$itemIndex"
          @click.stop.prevent="performAction(item.action)"
        >
          {{ item.title }}
          <font-awesome-icon class="icon" v-if="item.icon" :icon="item.icon" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import DropdownEventBus from '@/events/DropdownEventBus';
import { directions, alignments, isAlignedTowards } from '@/helpers/alignmentHelper';

export default {
  data() {
    return {
      isOpen: false,
      config: {},
      defaultTopOffset: 4,
      defaultLeftOffset: 0,
      defaultAlignment: alignments.BOTTOM_RIGHT,
    };
  },
  mounted() {
    DropdownEventBus.$on('open-dropdown-menu', (config) => {
      if (this.isOpen) {
        this.close();
      }

      // Ensures that dropdownMenu close() has been called
      this.$nextTick(() => {
        this.handleOpenRequest(config);
      });
    });
  },
  methods: {
    handleOpenRequest(config) {
      this.setConfig(config);
      this.open();
    },
    setConfig(config) {
      this.verifyConfig(config);
      this.config = this.getConfigWithUnsetValuesSetToDefault(config);
    },
    open() {
      this.isOpen = true;

      if (this.config.onOpen) {
        this.config.onOpen();
      }

      this.updatePositionToTarget();
    },
    close() {
      this.isOpen = false;

      if (this.config.onClose) {
        this.config.onClose();
      }

      this.resetConfig();

      DropdownEventBus.$emit('close-dropdown-menu');
    },
    performAction(action) {
      action();
      this.close();
    },
    resetConfig() {
      this.config = {};
    },
    updatePositionToTarget() {
      this.$nextTick(() => {
        const { topOffset, leftOffset, alignment } = this.config;

        const {
          offsetTop: targetTop,
          offsetLeft: targetLeft,
          offsetHeight: targetHeight,
          offsetWidth: targetWidth,
        } = this.config.target;

        const dropdownHeight = this.$el.scrollHeight;
        const dropdownWidth = this.$el.scrollWidth;

        let top = targetTop;
        let left = targetLeft;

        if (isAlignedTowards(alignment, directions.TOP)) {
          top -= dropdownHeight - targetHeight + topOffset;
        } else if (isAlignedTowards(alignment, directions.BOTTOM)) {
          top += targetHeight + topOffset;
        }

        if (isAlignedTowards(alignment, directions.RIGHT)) {
          left += targetWidth - dropdownWidth + leftOffset;
        }

        /* TODO : Implement method that adjust position if
        the dropdown is rendered outside of the viewport */

        this.$el.style.top = `${top}px`;
        this.$el.style.left = `${left}px`;
      });
    },
    verifyConfig(config) {
      if (!config) {
        throw new Error('DropdownMenu : Config cannot be null or undefined.');
      }

      if (!Object.prototype.hasOwnProperty.call(config, 'items')) {
        throw new Error('DropdownMenu : Config should have an "items" property.');
      }

      if (!Array.isArray(config.items)) {
        throw new Error('DropdownMenu : Config "items" property should be an array.');
      }

      if (config.items.length === 0) {
        throw new Error('DropdownMenu : Config "items" property should not be empty.');
      }

      config.items.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'title')) {
          throw new Error('DropdownMenu : Config items should all have a title property.');
        }

        if (typeof item.title !== 'string') {
          throw new Error('DropdownMenu : Config items title property should be a string.');
        }

        if (item.title.length === 0 || item.title.trim() === '') {
          throw new Error('DropdownMenu : Config items title property should not be empty.');
        }

        if (!(item.action instanceof Function)) {
          throw new Error('DropdownMenu : Config items action property should be a function.');
        }
      });
    },
    getConfigWithUnsetValuesSetToDefault(config) {
      const configWithUnsetValuesSetToDefault = config;

      if (!configWithUnsetValuesSetToDefault.topOffset) {
        configWithUnsetValuesSetToDefault.topOffset = this.defaultTopOffset;
      }

      if (!configWithUnsetValuesSetToDefault.leftOffset) {
        configWithUnsetValuesSetToDefault.leftOffset = this.defaultLeftOffset;
      }

      if (!configWithUnsetValuesSetToDefault.position) {
        configWithUnsetValuesSetToDefault.alignment = this.defaultAlignment;
      }

      return configWithUnsetValuesSetToDefault;
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
  watch: {
    isOpen(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        document.addEventListener('click', this.handleOutsideClick);
      } else {
        document.removeEventListener('click', this.handleOutsideClick);
      }
    },
  },
  beforeDestroy() {
    DropdownEventBus.$off();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/animations.scss";

.dropdown-menu {
  font-weight: 500;
  position: absolute;
  font-size: var(--global-font-size);

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
    animation: slide-top 0.12s cubic-bezier(0.23, 1, 0.32, 1) both;

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
