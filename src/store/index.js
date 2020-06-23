import Vue from "vue"
import Vuex from "vuex"

import reply from "./reply"
import user from "./user"

import { USER_KEY, REPLY_KEY } from "@/lib/constant"

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    users(state) {
      return state.user.users
    },
    arragedReplies(state) {
      return state.reply.replies.reduce(
        (acc, cur) => {
          if (cur.parentReplyId === null || cur.parentReplyId === undefined) {
            acc.parents.push(cur)
          } else {
            acc.children.push(cur)
          }
          return acc
        },
        { parents: [], children: [] }
      )
    },
  },
  actions: {
    loadData({ commit, state }) {
      const users = JSON.parse(localStorage.getItem(USER_KEY) || "[]")
      const replies = JSON.parse(localStorage.getItem(REPLY_KEY) || "[]")

      if (!users.length) {
        users.push({ id: 0, name: "김찬중" })
      }

      commit("SET_USERS", users)
      commit("SET_REPLIES", replies)
      commit("SET_AUTHUSER", state.user.users[0])
    },
    clearData() {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(REPLY_KEY)
      location.reload()
    },
  },
  modules: {
    user,
    reply,
  },
})
