import { REPLY_KEY } from "@/lib/constant"
import { getId } from "@/lib/common"

export default {
  state: {
    replies: [],
  },
  mutations: {
    SET_REPLIES(state, replies) {
      state.replies = replies
    },
    ADD_REPLY(state, { text, authorId, parentReplyId, targetUserId }) {
      state.replies.push({
        id: getId(),
        text,
        authorId,
        parentReplyId,
        targetUserId,
        likes: [],
        createdAt: Date.now(),
      })
    },
    UPDATE_REPLY(state, { replyId, replyText }) {
      const reply = state.replies.find(reply => reply.id === replyId)
      reply.text = replyText
    },
    DELETE_REPLY(state, replyId) {
      state.replies
        .filter(
          reply => reply.id === replyId || reply.parentReplyId === replyId
        )
        .map(reply => reply.id)
        .forEach(replyId => {
          const index = state.replies.findIndex(reply => reply.id === replyId)
          state.replies.splice(index, 1)
        })
    },
    TOGGLE_LIKE_REPLY(state, { replyId, userId }) {
      const likeList = state.replies.find(reply => reply.id === replyId)?.likes
      if (!likeList) return

      const likeIndex = likeList.findIndex(likeUserId => likeUserId === userId)

      return likeIndex < 0
        ? likeList.push(userId)
        : likeList.splice(likeIndex, 1)
    },
  },
  actions: {
    addReply({ state, commit }, reply) {
      commit("ADD_REPLY", reply)
      localStorage.setItem(REPLY_KEY, JSON.stringify(state.replies))
    },
    updateReply({ state, commit }, { replyId, replyText }) {
      commit("UPDATE_REPLY", { replyId, replyText })
      localStorage.setItem(REPLY_KEY, JSON.stringify(state.replies))
    },
    deleteReply({ state, commit }, replyId) {
      commit("DELETE_REPLY", replyId)
      localStorage.setItem(REPLY_KEY, JSON.stringify(state.replies))
    },
    toggleLikeReply({ state, commit }, { replyId, userId }) {
      commit("TOGGLE_LIKE_REPLY", { replyId, userId })
      localStorage.setItem(REPLY_KEY, JSON.stringify(state.replies))
    },
  },
}
