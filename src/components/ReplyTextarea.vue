<template>
  <textarea
    ref="textarea"
    v-model.trim="text"
    :style="textareaStyle"
    :placeholder="placeholder"
    @keypress.enter.exact.prevent="addReply"
    @keydown.esc="$emit('cancel')"
    :rows="rows"
  />
</template>

<script>
export default {
  name: "ReplyTextarea",
  props: {
    placeholder: {
      type: String,
      default: "댓글을 입력하세요...",
    },
    initValue: {
      type: String,
      default: "",
    },
    isSub: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      text: "",
    }
  },
  created() {
    this.text = this.initValue
  },
  mounted() {
    this.$refs.textarea.focus()
  },
  methods: {
    addReply() {
      if (!this.text) return

      this.$emit("submit", this.text)
      this.text = ""
    },
  },
  computed: {
    rows() {
      const enterCount = (this.text.match(/\n/g) || []).length
      return enterCount + 1
    },
    textareaStyle() {
      return {
        width: this.width,
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/variables";

textarea {
  font: {
    size: 15px;
  }
  color: $base-color-5;
  padding: 12px 16px;
  margin: {
    top: -4px;
    left: 8px;
  }
  background: $base-color-3;
  outline: none;
  border: none;
  border-radius: 18px;
  overflow: hidden;
  resize: none;
  &::-webkit-input-placeholder {
    color: $base-color-4;
    /* color: #8d949e; */
  }
}
</style>
