<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/store";
import axios from "axios";

const router = useRouter();
const store = useAuthStore();
const loading = ref(false);
const email = ref("");
const password = ref("");
const error = ref(null);
const students = ref([]);

const login = async () => {
  try {
    loading.value = true;
    if (!email.value || !password.value) {
      throw new Error("Email and password are required");
    }

    const response = await axios.post(`https://ece-database-azgbhzgrgshef4ae.canadacentral-01.azurewebsites.net/api/login`, {
      email: email.value,
      password: password.value,
    });
    console.log()
    
    const status = response.status;

    

    if (status === 200) {
     students.value = response.data.data;
      
      store.setToken(students.token);
      store.setUser(students.user)
      console.log(store.$state.token )
      router.push({ name: "Home" });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
  
};
</script>

<template>
  <main class="relative flex h-screen items-center justify-center bg-green-700">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <img src="../assets/cropped-unnlogo.jpeg" alt="Legend Logo" class="w-32 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-center mb-6">ECE UNN</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="email@ece-unn.com"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="*************"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <input type="checkbox" id="remember" class="mr-2" />
            <label for="remember" class="text-gray-600">Remember me</label>
          </div>
          <a href="#" class="text-blue-600 hover:underline text-sm">Forgot Password?</a>
        </div>
        <button
          type="submit"
          class="w-full bg-green-700 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          :disabled="loading"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Loading...</span>
        </button>
      </form>
      <div class="text-center mt-4">
        <p class="text-gray-600">Don't have an account?</p>
        <a href="#" class="text-blue-600 hover:underline text-sm">Sign Up</a>
      </div>
    </div>
  </main>
</template>