import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),

  actions: {
    setToken(token) {
      this.token = token;
    },
    setUser(user) {
      this.user = user;
    },
    logout() {
      this.token = null;
      this.user = null;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },

  // Enable persistence
  persist: {
    key: 'auth-store', // Optional: customize the storage key
    storage: localStorage, // Specify storage type: localStorage or sessionStorage
  },
});
