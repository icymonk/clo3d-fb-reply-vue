export default {
  state: {
    authUser: { id: 0, name: "김찬중" },
    users: [],
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },
  },
  actions: {},
}
