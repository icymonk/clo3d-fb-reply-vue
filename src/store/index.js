import Vue from "vue"
import Vuex from "vuex"

import reply from "./reply"
import user from "./user"

import { USER_KEY, REPLY_KEY } from "../lib/constant"

Vue.use(Vuex)

export default new Vuex.Store({
  namespace: true,
  state: {},
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
  mutations: {},
  actions: {
    loadData({ commit }) {
      const users = JSON.parse(localStorage.getItem(USER_KEY) || "[]")

      // authUser
      users.push({ id: 0, name: "김찬중" })

      const replies = JSON.parse(localStorage.getItem(REPLY_KEY) || "[]")

      commit("SET_USERS", users)
      commit("SET_REPLIES", replies)
    },
  },
  modules: {
    user,
    reply,
  },
})
