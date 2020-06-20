<template>
  <div>
    <button @click="clearReplies">Clear</button>
    <div id="fb-reply">
      <ReplyContainer :replies="replies" />
    </div>
  </div>
</template>

<script>
import ReplyContainer from "@/containers/ReplyContainer"
import { REPLY_KEY } from "./lib/constant"

export default {
  name: "App",
  components: { ReplyContainer },
  computed: {
    replies() {
      return this.$store.getters.arragedReplies
    },
  },
  mounted() {
    this.$store.dispatch("loadData")
  },
  methods: {
    clearReplies() {
      localStorage.removeItem(REPLY_KEY)
      location.reload()
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/variables";

#fb-reply {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  min-height: 100vh;
}
</style>
