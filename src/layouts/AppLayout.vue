    <template>
  <div>
    <header class="w-full h-12 mt-20  bg-green-700 py-4 px-6 flex justify-between items-center">
      <h1 class="text-white text-2xl">
        <img src="../assets/cropped-unnlogo.jpeg" alt="Legend Logo" class="w-30 mb-4 mr-90" />
      </h1>
      <button
        v-if="authStore.token"
        @click="logout"
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/store";
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