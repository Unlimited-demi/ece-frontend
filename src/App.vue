<template>
  <AppLayout />
</template>

<script setup>
import AppLayout from './layouts/AppLayout.vue';
import { useAuthStore } from "./stores/store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  try {
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    authStore.clearAuth();
    router.push("/login");
  }
};
</script>
