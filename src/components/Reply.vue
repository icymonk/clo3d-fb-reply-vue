<template>
  <div :style="rootCoverStyle">
    <div
      class="reply-cover"
      :style="{ marginBottom: isEditing ? '24px' : '' }"
      @mouseenter="moreIconShow = true"
      @mouseleave="moreIconShow = false"
    >
      <Avatar :size="isSub ? 24 : 32" />

      <ReplyTextarea
        v-if="isEditing"
        :initValue="item.text"
        @submit="updateReply"
        @cancel="isEditing = false"
      />
      <div v-else class="content-cover">
        <div class="text-cover">
          <div class="text">
            <div>
              <span class="username">{{ author.name }}</span>
            </div>
            <div>
              <span class="username" v-if="targetUser"
                >{{ targetUser.name }}
              </span>
              <div class="content">
                <div
                  v-for="(line, i) in item.text.split('\n')"
                  :key="i"
                  v-text="line"
                ></div>
              </div>
              <span
                v-if="item.likes.length"
                class="like-count"
                @mouseenter="likeListShow = true"
                @mouseleave="likeListShow = false"
                ><img
                  width="20"
                  style="display: inline"
                  src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"
                />
                <span>{{ item.likes.length }}</span>
              </span>
              <span v-show="likeListShow" class="like-list">
                <p v-for="userId in item.likes" :key="userId">
                  {{
                    $store.state.user.users.find(user => user.id === userId)
                      .name
                  }}
                </p>
              </span>
            </div>
          </div>
          <div class="more-icon" @click="openMoreList">
            {{ moreIconShow ? "…" : "ㅤ" }}
          </div>
        </div>

        <div class="action-bar">
          <a href="#" @click="toggleLikeReply"
            >좋아요 {{ isLiked ? "취소" : "" }}</a
          >
          <span>·</span>
          <a href="#" @click="openReplyArea()">답글달기</a>
          <span>·</span>
          <a href="#">{{ item.createdAt | pastTimeFormat }}</a>
        </div>
      </div>
    </div>

    <Reply
      v-for="item in subItem"
      :key="item.id"
      :item="item"
      @openReplyArea="openReplyArea"
      isSub
    />

    <div v-if="!isSub && textareaShow" class="is-sub">
      <Avatar size="24" />
      <ReplyTextarea
        placeholder="댓글 달기"
        @submit="addReply"
        @cancel="textareaShow = false"
        isSub
      />
    </div>

    <div v-show="moreListShow" class="more-list" @click="moreListShow = false">
      <div class="content">
        <div @click="startEdit">수정</div>
        <hr />
        <div @click="deleteReply">삭제</div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar"
import ReplyTextarea from "@/components/ReplyTextarea"
import { SECOND, MINUTE, HOUR, DAY } from "@/lib/constant"

export default {
  name: "Reply",
  components: { Avatar, ReplyTextarea },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
    subItem: {
      type: Array,
      default() {
        return []
      },
    },
    isSub: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    pastTimeFormat(time) {
      const past = Date.now() - time

      if (past < 10 * SECOND) return "방금"
      if (past < MINUTE) return Math.round(past / SECOND) + "초 전"
      else if (past < HOUR) return Math.round(past / MINUTE) + "분 전"
      else if (past < DAY) return Math.round(past / HOUR) + "시간 전"
      else return Math.round(past / DAY) + "일 전"
    },
  },
  data() {
    return {
      textareaShow: false,
      moreIconShow: false,
      moreListShow: false,
      likeListShow: false,
      isEditing: false,
      targetUserId: null,
      targetReply: null,
    }
  },
  methods: {
    openReplyArea(targetUserId) {
      if (this.isSub) {
        this.$emit("openReplyArea", this.item.authorId)
      } else {
        this.targetUserId = targetUserId
        this.textareaShow = true
      }
    },
    openMoreList() {
      this.moreListShow = true
      this.targetReply = this.item
    },
    addReply(text) {
      this.$store.dispatch("addReply", {
        text,
        authorId: this.authUser.id,
        parentReplyId: this.item.id,
        targetUserId: this.targetUserId,
      })
    },
    startEdit() {
      this.isEditing = true
    },
    updateReply(text) {
      this.$store.dispatch("updateReply", {
        replyId: this.targetReply.id,
        replyText: text,
      })
      this.isEditing = false
    },
    deleteReply() {
      if (!confirm("댓글을 삭제하시겠습니까?")) return

      console.log(this.targetReply)
      this.$store.dispatch("deleteReply", this.targetReply.id)
    },
    toggleLikeReply() {
      this.$store.dispatch("toggleLikeReply", {
        replyId: this.item.id,
        userId: this.authUser.id,
      })
    },
  },
  computed: {
    authUser() {
      return this.$store.state.user.authUser
    },
    author() {
      return this.$store.getters.users.find(
        user => user.id === this.item.authorId
      )
    },
    targetUser() {
      if (!this.item.targetUserId) return null

      return this.$store.getters.users.find(
        user => user.id === this.item.targetUserId
      )
    },
    rootCoverStyle() {
      return {
        paddingLeft: this.isSub ? "40px" : "0",
        paddingBottom: this.isSub ? "0" : "8px",
      }
    },
    isLiked() {
      return this.item.likes.includes(this.authUser.id)
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/variables";

.reply-cover {
  width: 100%;
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  padding: 0;

  .content-cover {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    max-width: calc(100% - 32px);
    margin: {
      bottom: 4px;
    }
    .text-cover {
      display: flex;
      align-items: center;
    }

    .text {
      padding: 8px 32px 8px 16px;
      margin: {
        left: 8px;
      }
      font: {
        size: 15px;
      }
      color: $base-color-5;
      border-radius: 18px;
      background: $base-color-3;

      div {
        position: relative;
        .username {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .content {
          display: inline;
          word-break: break-all;
        }
      }

      .like-count {
        line-height: 20px;
        position: absolute;
        bottom: -12px;
        right: -60px;
        width: 36px;
        height: 20px;
        border-radius: 14px;
        background: #ddd8;
        cursor: pointer;
        &:hover {
          text-decoration: none;
        }

        span {
          color: $base-color-5;
          font-size: 12px;
          display: block;
          transform: translate(23px, -23px);
        }
      }

      .like-list {
        text-align: center;
        position: absolute;
        bottom: -32px;
        right: -84px;
        color: $base-color-3;
        font-size: 12px;
        line-height: 20px;
        width: 60px;
        height: 20px;
        border-radius: 14px;
        background: #ddd;
        p {
          margin: auto;
        }
      }
    }

    .action-bar {
      color: $base-color-4;
      font: {
        size: 12px;
      }
      margin: 4px;

      a,
      span {
        margin: {
          left: 4px;
        }
        color: $base-color-4;
        text-decoration: none;
        &:visited {
          color: $base-color-4;
        }
      }
    }
  }

  .more-icon {
    color: $base-color-4;
    padding-left: 16px;
    font-size: 24px;
    cursor: pointer;
    transform: translateY(-8px);
    user-select: none;
  }
}

.more-list {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #0003;
  z-index: 10;

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    background: $base-color-3;
    border-radius: 8px;

    div {
      color: $base-color-5;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      &:hover {
        filter: contrast(0.9) brightness(0.9);
      }
      &:last-child {
        color: red;
      }
    }

    hr {
      border-color: grey;
      margin: 0;
    }
  }
}

.is-sub {
  display: flex;
  justify-content: flex-start;
  margin-left: 40px;
}
</style>
