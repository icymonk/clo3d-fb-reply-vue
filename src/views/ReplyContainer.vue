<template>
  <div class="reply-container">
    <Reply
      v-for="item in replies.parents"
      :key="item.id"
      :item="item"
      :subItem="findChildrenReply(item.id)"
      @addReply="addReply"
    />
    <div class="bottom-textarea">
      <Avatar />
      <ReplyTextarea @submit="addReply" />
    </div>
  </div>
</template>

<script>
import Reply from "@/containers/Reply"
import Avatar from "@/components/Avatar"
import ReplyTextarea from "@/components/ReplyTextarea"

export default {
  name: "ReplyContainer",
  components: { Avatar, Reply, ReplyTextarea },
  methods: {
    findChildrenReply(parentReplyId) {
      return this.replies.children.filter(
        item => item.parentReplyId === parentReplyId
      )
    },
    addReply(text) {
      this.$store.dispatch("addReply", {
        text,
        authorId: this.$store.state.user.authUser.id,
      })
      this.$nextTick(() => {
        scrollTo(0, document.body.scrollHeight)
      })
    },
  },
  computed: {
    replies() {
      return this.$store.getters.arragedReplies
    },
  },
}
</script>

<style scoped lang="scss">
@import "@/assets/variables";

.reply-container {
  display: flex;
  flex-direction: column;
  background: $base-color-2;
  padding: 16px;
  width: 558px;
  border-radius: 8px;
}
.bottom-textarea {
  display: flex;
  align-items: flex-start;
  margin: {
    top: 8px;
  }
}
</style>
