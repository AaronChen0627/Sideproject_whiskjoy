<template>
  <div class="comment-section mt-5">
    <h3 class="section-title mb-4">
      品飲評論 <small class="text-gold fs-6">/ REVIEWS</small>
    </h3>

    <div
      v-if="errorMessage"
      class="error-gold mb-4 animate__animated animate__fadeIn"
    >
      <i class="bi bi-exclamation-circle me-2"></i> {{ errorMessage }}
    </div>

    <div class="comment-input-card p-4 mb-5">
      <h5 class="text-gold mb-3">
        {{ isEditing ? "編輯您的筆記" : "留下您的品飲紀錄" }}
      </h5>
      <textarea
        v-model="newCommentContent"
        class="form-control whisky-textarea"
        rows="4"
        :placeholder="
          isEditing ? '修改您的評論內容...' : '這支威士忌的酒體、香氣如何？'
        "
        @input="errorMessage = ''"
      ></textarea>
      <div class="d-flex justify-content-end gap-2">
        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="btn btn-outline-light mt-3 rounded-pill px-4"
        >
          取消
        </button>
        <button
          @click="isEditing ? saveComment() : addComment()"
          class="btn whisky-btn-primary mt-3 rounded-pill px-4"
          :disabled="!newCommentContent.trim()"
        >
          {{ isEditing ? "儲存更新" : "發布評論" }}
        </button>
      </div>
    </div>

    <hr class="divider-gold mb-5" />

    <div v-if="comments.length === 0" class="empty-state text-center py-5">
      <i class="bi bi-chat-dots fs-1 text-gold-50 d-block mb-3"></i>
      <p>目前尚無評論，成為第一個分享品飲經驗的人吧！</p>
    </div>

    <div v-else class="comment-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-card d-flex align-items-start mb-4 p-4"
      >
        <div class="avatar-wrapper me-4">
          <img
            v-if="comment.avatar_url"
            :src="comment.avatar_url"
            alt="Avatar"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            {{ comment.account?.charAt(0).toUpperCase() }}
          </div>
        </div>

        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="user-account text-gold">{{ comment.account }}</span>
            <small class="text-white-50">{{
              formatDate(comment.created_at)
            }}</small>
          </div>

          <div class="comment-body">
            <p class="mb-0">{{ comment.comment }}</p>
          </div>

          <div
            v-if="comment.user_id === currentUserId"
            class="mt-3 d-flex gap-2 justify-content-end"
          >
            <button @click="editComment(comment)" class="btn-icon" title="編輯">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button
              @click="deleteComment(comment.id)"
              class="btn-icon delete"
              title="刪除"
            >
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  name: "CommentSection",
  props: {
    productId: {
      type: [String, Number], // 允許 String 或 Number
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      newCommentContent: "",
      isEditing: false,
      editingCommentId: null,
      errorMessage: "",
    };
  },
  computed: {
    currentUserId() {
      const token = sessionStorage.getItem("token");
      if (!token) return null;
      try {
        const decoded = jwtDecode(token);
        return decoded.userId;
      } catch (e) {
        return null;
      }
    },
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    async fetchComments() {
      try {
        // 加入開頭斜線，避免相對路徑錯誤
        const response = await axios.get(`/api/comments/${this.productId}`);
        this.comments = response.data.comments || [];
      } catch (error) {
        console.error("獲取評論失敗:", error);
      }
    },
    async addComment() {
      // 1. 防呆檢查
      const existing = this.comments.find(
        (c) => c.user_id === this.currentUserId,
      );
      if (existing) {
        this.errorMessage = "您已發表過評論，請透過編輯功能修改內容。";
        return;
      }

      const token = sessionStorage.getItem("token");
      if (!token) {
        this.$router.push("/login");
        return;
      }

      try {
        await axios.post(
          `/api/comments/add`,
          {
            productId: this.productId,
            comment: this.newCommentContent, // 確保 Key 是 comment
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        this.newCommentContent = "";
        this.fetchComments();
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "發布失敗，請稍後再試";
      }
    },
    editComment(comment) {
      this.isEditing = true;
      this.editingCommentId = comment.id;
      this.newCommentContent = comment.comment;
      // 滾動到輸入區
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingCommentId = null;
      this.newCommentContent = "";
    },
    async saveComment() {
      const token = sessionStorage.getItem("token");
      try {
        await axios.put(
          `/api/comments/${this.editingCommentId}`,
          {
            comment: this.newCommentContent,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        this.cancelEdit();
        this.fetchComments();
      } catch (error) {
        this.errorMessage = "儲存失敗";
      }
    },
    async deleteComment(commentId) {
      if (!confirm("確定要刪除這則品飲筆記嗎？")) return;
      const token = sessionStorage.getItem("token");
      try {
        await axios.delete(`/api/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.fetchComments();
      } catch (error) {
        this.errorMessage = "刪除失敗";
      }
    },
  },
  mounted() {
    this.fetchComments();
  },
};
</script>

<style scoped>
.section-title {
  color: #fff;
  letter-spacing: 2px;
  border-left: 4px solid #e2c997;
  padding-left: 15px;
}

.text-gold {
  color: #e2c997;
}
.text-gold-50 {
  color: rgba(226, 201, 151, 0.5);
}

/* 毛玻璃輸入框卡片 */
.comment-input-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 201, 151, 0.2);
  border-radius: 20px;
}

.whisky-textarea {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s;
}

.whisky-textarea:focus {
  border-color: #e2c997 !important;
  box-shadow: 0 0 15px rgba(226, 201, 151, 0.2) !important;
}

/* 評論卡片 */
.comment-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.3s;
}

.comment-card:hover {
  background: rgba(255, 255, 255, 0.07);
}

/* 頭像樣式 */
.avatar-wrapper {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid #e2c997;
  overflow: hidden;
  background: #222;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e2c997;
  font-weight: bold;
}

.user-account {
  font-weight: 600;
  letter-spacing: 1px;
}

/* 琥珀金錯誤提示 */
.error-gold {
  background: rgba(226, 201, 151, 0.1);
  border: 1px solid #e2c997;
  color: #e2c997;
  padding: 12px;
  border-radius: 10px;
  font-size: 0.9rem;
}

/* 按鈕美化 */
.whisky-btn-primary {
  background-color: #e2c997 !important;
  color: #000 !important;
  font-weight: 600;
  border: none;
}

.btn-icon {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  transition: color 0.2s;
}

.btn-icon:hover {
  color: #e2c997;
}
.btn-icon.delete:hover {
  color: #ff4d4d;
}

.divider-gold {
  border-top: 1px solid rgba(226, 201, 151, 0.2);
  opacity: 1;
}
</style>
