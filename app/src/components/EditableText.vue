<template>
  <div class="editable-text" :style="style">
    <span
      class="editable-text__text"
      v-if="!isEditModeEnabled"
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
      v-if="isEditModeEnabled"
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
    fontSize: {
      type: Number,
      default: 1,
    },
    fontWeight: {
      type: Number,
      default: 700,
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
    },
    disableEditMode() {
      this.isEditModeEnabled = false;
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
  cursor: pointer;
  display: inline-block;
  width: calc(100% - 1rem);

  .editable-text__text {
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    overflow-wrap: break-word;
    white-space: normal;
  }

  .editable-text__input {
    border-radius: var(--global-border-radius);
    border: 2px solid var(--primary-color);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    left: -0.25rem;
    padding: 0.25rem;
    position: relative;
    top: -0.25rem;
    width: calc(100% - 1rem);
  }
}
</style>
