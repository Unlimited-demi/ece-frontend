<template>
    <div class="h-full w-full p-10 bg-gray-100">
      <h3 class="text-2xl font-bold mb-5">Student Details</h3>
      <div class="p-5 bg-white shadow-lg rounded-md">
        <div v-for="(value, key) in student" :key="key" class="mb-3">
          <strong class="capitalize">{{ key.replace(/_/g, " ") }}:</strong>
          <span>{{ value }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  
  const student = ref({});
  
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
  