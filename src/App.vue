<template>
  <div>
    <button style="position:fixed;" @click="clearData">
      Clear
    </button>
    <select
      v-model="selectedUser"
      @change="onChangeUser"
      style="position: fixed; left: 100px;"
    >
      <option v-for="user in users" :key="user.id" :value="user">
        {{ user.name }}
      </option>
    </select>
    <input
      v-model="username"
      style="position: fixed; left:160px;"
      @keypress.enter="addUser"
    />
    <button style="position: fixed; left:280px;" @click="addUser">
      사용자 추가
    </button>

    <!-- 댓글 컨테이너 -->
    <div id="fb-reply">
      <ReplyContainer />
    </div>
  </div>
</template>

<script>
import ReplyContainer from "@/views/ReplyContainer"

export default {
  name: "App",
  components: { ReplyContainer },
  mounted() {
    this.$store.dispatch("loadData")
    this.selectedUser = this.$store.state.user.authUser
  },
  data() {
    return {
      selectedUser: null,
      username: "",
    }
  },
  methods: {
    clearData() {
      if (!confirm("데이터를 초기화하시겠습니까?")) return

      this.$store.dispatch("clearData")
    },
    addUser() {
      this.$store.dispatch("addUser", this.username)
      this.username = ""
    },
    onChangeUser() {
      this.$store.commit("SET_AUTHUSER", this.selectedUser)
    },
  },
  computed: {
    users() {
      return this.$store.state.user.users
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
