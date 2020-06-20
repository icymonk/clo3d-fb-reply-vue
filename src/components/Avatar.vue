<template>
  <img :style="imgStyle" :src="src" :width="width" :height="height" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: require("../assets/blank_user.jpg"),
    },
    size: {
      type: [Number, String],
      default: 32,
    },
    unit: {
      type: String,
      default: "px",
    },
  },
  computed: {
    width() {
      return this.size + this.unit
    },
    height() {
      return this.size + this.unit
    },
    imgStyle() {
      return {
        borderRadius: this.size / 2 + this.unit,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
img {
  cursor: pointer;
  &:hover {
    filter: brightness(1.03);
  }
}
</style>
