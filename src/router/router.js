  import { createRouter } from "vue-router";
  import { useAuthStore } from "../stores/store";

  const routes = [
    { path: "/login", name: "Login", component: () => import("../views/Login.vue") },
    { path: "/", name: "Home", component: () => import("../views/Home.vue") },
  ];

  const router = createRouter({
    
    routes,
  });

  // Global route guard
  router.beforeEach((to, from, next) => {
    const store = useAuthStore();
    const token = store.token || localStorage.getItem("authToken");

    if (to.name !== "Login" && !token) {
      return next({ name: "Login" }); // Redirect to login
    }

    if (token && !store.token) {
      // Restore token in store from localStorage
      store.setToken(token);
    }

    next();
  });

  export default router;
