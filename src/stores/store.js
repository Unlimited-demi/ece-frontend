import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    user: null,
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
      if (newToken) localStorage.setItem("authToken", newToken);
      else localStorage.removeItem("authToken");
    },
    setUser(user) {
      this.user = user;
    },
    clearAuth() {
      this.setToken(null);
      this.setUser(null);
    },
  },
});
