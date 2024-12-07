<template>
    <div class="h-full w-full ml-10 bg-slate-500 p-5">
      <h3 class="text-2xl text-center text-white mb-5">ECE UNN DATABASE</h3>
      <input
        type="text"
        v-model="search"
        @input="fetchStudents"
        placeholder="Search by reg number"
        class="mb-4 p-2 w-full rounded-md border border-gray-300"
      />
  
      <table class="table-auto w-full text-left bg-white shadow-md rounded-lg">
        <thead class="bg-slate-700 text-white">
          <tr>
            <th class="p-3">Reg Number</th>
            <th class="p-3">First Name</th>
            <th class="p-3">Last Name</th>
            <th class="p-3">Level</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in students"
            :key="student.reg_number"
            class="hover:bg-gray-100 cursor-pointer"
            @click="openStudentDetails(student)"
          >
            <td class="p-3 border-b">{{ student.reg_number }}</td>
            <td class="p-3 border-b">{{ student.first_name }}</td>
            <td class="p-3 border-b">{{ student.last_name }}</td>
            <td class="p-3 border-b">{{ student.level }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button
          :disabled="page === 1"
          @click="prevPage"
          class="px-4 py-2 bg-slate-600 text-white rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-white">Page {{ page }}</span>
        <button
          @click="nextPage"
          class="px-4 py-2 bg-slate-600 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const students = ref([]);
  const page = ref(1);
  const search = ref("");
  const token = "10|iGsCAdYcOyFGsKrRiUr46TMvnQ5endPuVQYQVmLpf660ea41";
  
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `https://ece-database-azgbhzgrgshef4ae.canadacentral-01.azurewebsites.net/api/students?per_page=50&page=${page.value}&search=${search.value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        students.value = response.data.data;
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  
  const nextPage = () => {
    page.value++;
    fetchStudents();
  };
  
  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchStudents();
    }
  };
  
  const openStudentDetails = (student) => {
    const studentData = encodeURIComponent(JSON.stringify(student));
    window.open(`/student-details?data=${studentData}`, "_blank");
  };
  
  fetchStudents();
  </script>
  
  <style scoped>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th,
  td {
    text-align: left;
    padding: 8px;
  }
  
  th {
    background-color: #f4f4f4;
    color: #333;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
  </style>
  