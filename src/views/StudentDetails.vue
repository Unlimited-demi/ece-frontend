<template>
  <div class="h-full w-full p-10 bg-gray-100">
    <h3 class="text-2xl font-bold mb-5">Student Details</h3>
    <div class="p-5 bg-white shadow-lg rounded-md">
      <div v-for="(value, key) in student" :key="key" class="mb-3">
        <strong class="capitalize">{{ key.replace(/_/g, " ") }}:</strong>
        <span>{{ value }}</span>
      </div>
      <!-- Render passport image using sanitized url -->
      <div v-if="sanitizedPassportUrl">
        <img :src="sanitizedPassportUrl" alt="Student Passport" class="mt-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/store";

const student = ref({});

const store = useAuthStore();
console.log(store.$state.token);

// Computed property to remove backslashes from passport_url.
const sanitizedPassportUrl = computed(() => {
  return student.value.passport_url
    ? student.value.passport_url.replace(/\\/g, "")
    : "";
});

onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const data = queryParams.get("data");
  if (data) {
    student.value = JSON.parse(decodeURIComponent(data));
  }
});
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}
</style>
