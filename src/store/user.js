import { USER_KEY } from "@/lib/constant"
import { getId } from "@/lib/common"

export default {
  state: {
    authUser: {},
    users: [],
  },
  mutations: {
    SET_AUTHUSER(state, user) {
      state.authUser = user
    },
    SET_USERS(state, users) {
      state.users = users
    },
    ADD_USER(state, username) {
      state.users.push({ id: getId(), name: username })
    },
  },
  actions: {
    addUser({ commit, state }, username) {
      commit("ADD_USER", username)
      localStorage.setItem(USER_KEY, JSON.stringify(state.users))
    },
  },
}
