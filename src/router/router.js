import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/store";

const routes = [
  { path: "/login", name: "Login", component: () => import("../views/Login.vue"), meta: { requiresAuth: false } },
  { path: "/", name: "Home", component: () => import("../views/Home.vue"), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global route guard
router.beforeEach((to, from, next) => {
  const store = useAuthStore();
  const token = store.token || localStorage.getItem("authToken");

  if (to.meta.requiresAuth && !token) {
    return next({ name: "Login", query: { redirect: to.fullPath } }); // Redirect to login with redirect query
  }

  if (token && !store.token) {
    // Restore token in store from localStorage
    store.setToken(token);
  }

  next();
});

export default router;