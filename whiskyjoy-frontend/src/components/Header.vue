<template>
  <nav class="navbar navbar-expand-lg navbar-dark px-3">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="@/assets/logo.png" alt="Logo" class="navbar-logo" />
        <span class="ms-2 whisky-text">WHISKY JOY</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto align-items-center">
          <router-link to="/" class="nav-link mx-2">Home</router-link>
          <router-link to="/about" class="nav-link mx-2">About US</router-link>
          <router-link to="/note" class="nav-link mx-2">Note</router-link>

          <div class="ms-lg-3 mt-3 mt-lg-0">
            <LoginButton v-if="!isAuthenticated" />
            <UserLogined v-if="isAuthenticated" :user="user" />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import LoginButton from "@/components/LoginButton.vue";
import UserLogined from "@/components/UserLogined.vue";

export default {
  components: {
    LoginButton,
    UserLogined,
  },
  computed: {
    ...mapGetters(["isAuthenticated", "user"]),
  },
};
</script>

<style scoped>
.navbar-logo {
  height: 40px;
  width: auto;
}

.navbar {
  background-color: #000000 !important;
}

.navbar-nav .nav-link {
  color: white;
  transition: color 0.3s ease;
}

.navbar-nav .nav-link:hover {
  color: orange;
}

.whisky-text {
  color: #e2c997;
  font-weight: bold;
}

.btn-warning {
  background-color: orange;
  border-color: orange;
}

.btn-warning:hover {
  background-color: darkorange;
  border-color: darkorange;
}
</style>
