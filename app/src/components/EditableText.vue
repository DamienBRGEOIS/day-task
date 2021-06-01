<template>
  <div class="editable-text" :style="style">
    <span
      class="editable-text__text"
      v-show="!isEditModeEnabled"
      @click.prevent="enableEditMode"
    >
      {{ text }}
    </span>
    <input
      autocomplete="off"
      class="editable-text__input"
      name="column-title-input"
      ref="textInput"
      type="text"
      v-show="isEditModeEnabled"
      v-model="editedText"
      @change="editText"
      @click.prevent
      @focusout="disableEditMode"
      @keyup.enter="editText"
      @keyup.esc="disableEditMode"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },
    height: {
      type: Number,
      default: 1.75,
    },
    fontSize: {
      type: Number,
      default: 0.906,
    },
    fontWeight: {
      type: Number,
      default: 700,
    },
    maxInputWidth: {
      type: Number,
      default: 700,
    },
    enforceUppercase: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editedText: '',
      isEditModeEnabled: false,
      text: '',
    };
  },
  methods: {
    enableEditMode() {
      this.isEditModeEnabled = true;
      this.$emit('editableText:edit-mode-enabled');
    },
    disableEditMode() {
      this.isEditModeEnabled = false;
      this.$emit('editableText:edit-mode-disabled');
    },
    editText() {
      if (this.text !== this.editedText) {
        if (this.editedText.trim() !== '') {
          this.$emit('editableText:text-edited', this.editedText);
          this.text = this.editedText;
        } else {
          this.editedText = this.text;
        }
      }
      this.disableEditMode();
    },
  },
  computed: {
    style() {
      return {
        '--font-size': `${this.fontSize}rem`,
        '--font-weight': this.fontWeight,
        '--text-transform': this.enforceUppercase ? 'uppercase' : 'none',
        '--height': `${this.height}rem`,
      };
    },
  },
  watch: {
    isEditModeEnabled(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.$nextTick(() => {
          this.$refs.textInput.select();
        });
      }
    },
    value(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.editedText = newValue;
        this.text = newValue;
      }
    },
  },
  mounted() {
    this.text = this.value;
    this.editedText = this.value;
  },
};
</script>

<style lang="scss" scoped>
.editable-text {
  display: inline-block;
  width: 100%;

  .editable-text__text {
    border-radius: var(--global-border-radius);
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    height: var(--height);
    line-height: var(--height);
    max-height: var(--height);
    overflow-wrap: break-word;
    padding: 0 0.375rem;
    position: relative;
    text-transform: var(--text-transform);
    transition: var(--global-transition);
    white-space: normal;

    &:hover {
      background-color: rgba(31, 60, 73, 0.08);
    }
  }

  .editable-text__input {
    border-radius: var(--global-border-radius);
    border: 2px solid var(--primary-color);
    box-sizing: border-box;
    display: inline-block;
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    height: var(--height);
    max-height: var(--height);
    padding: 0 0.25rem;
    position: relative;
    text-transform: var(--text-transform);
    width: 100%;
  }
}
</style>
