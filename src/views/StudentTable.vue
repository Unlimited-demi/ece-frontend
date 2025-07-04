<template>
  <div>
    <!-- Main Content -->
    <div class="h-full w-full ml-10 bg-green-700 p-5">
      <h3 class="text-2xl text-center text-white mb-5">ECE UNN DATABASE</h3>
      <input
        type="text"
        v-model="search"
        @input="handleSearchInput"
        placeholder="Search by name or reg number"
        class="mb-4 p-2 w-full rounded-md border border-gray-300"
      />

      <table class="table-auto w-full text-left bg-white shadow-md rounded-lg">
        <thead class="bg-slate-700 text-white">
          <tr>
            <th class="p-3">Reg Number</th>
            <th class="p-3">First Name</th>
            <th class="p-3">Middle Name</th>
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
            <td class="p-3 border-b">{{ student.middle_name }}</td>
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
          :disabled="students.length < perPage"
          class="px-4 py-2 bg-slate-600 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Student Details Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-green-700">Student Details</h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Reg Number:</strong> {{ selectedStudent?.reg_number }}</p>
            <p><strong>First Name:</strong> {{ selectedStudent?.first_name }}</p>
            <p><strong>Middle Name:</strong> {{ selectedStudent?.middle_name }}</p>
            <p><strong>Last Name:</strong> {{ selectedStudent?.last_name }}</p>
            <p><strong>Gender:</strong> {{ selectedStudent?.gender }}</p>
            <p><strong>Level:</strong> {{ selectedStudent?.level }}</p>
            <p><strong>Date of Birth:</strong> {{ selectedStudent?.date_of_birth }}</p>
          </div>
          <div>
            <p><strong>Religion:</strong> {{ selectedStudent?.religion }}</p>
            <p><strong>Nationality:</strong> {{ selectedStudent?.nationality }}</p>
            <p><strong>State of Origin:</strong> {{ selectedStudent?.state_of_origin }}</p>
            <p><strong>State of Residence:</strong> {{ selectedStudent?.state_of_residence }}</p>
            <p><strong>Guardian:</strong> {{ selectedStudent?.guardian_name }}</p>
            <p><strong>Guardian Phone:</strong> {{ selectedStudent?.guardian_phone_number }}</p>
          </div>
          <div class="col-span-2 flex justify-center">
            <img
              :src="selectedStudent?.passport_url"
              alt="Student Passport"
              class="h-32 w-32 rounded-full border-2 border-green-700"
            />
          </div>
        </div>
        <button
          @click="closeModal"
          class="mt-4 w-full px-4 py-2 bg-green-700 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { debounce } from "lodash";
import axios from "axios";
import { useAuthStore } from "../stores/store";

// State
const students = ref([]);
const page = ref(1);
const search = ref("");
const showModal = ref(false);
const selectedStudent = ref(null);
const perPage = 50; // add page size constant

// Auth
const store = useAuthStore();
const token = store.token;

// Fetch All Students
const fetchDatabase = async () => {
  try {
    const response = await axios.get(
      `https://ece-database-azgbhzgrgshef4ae.canadacentral-01.azurewebsites.net/api/students`,
      {
        params: { per_page: 50, page: page.value },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) students.value = response.data.data;
  } catch (error) {
    console.error("Error fetching database:", error);
  }
};

// Fetch Search Results
const fetchSearchResults = async () => {
  try {
    if (search.value.trim() === "") {
      fetchDatabase();
      return;
    }
    const response = await axios.get(
      `https://ece-database-azgbhzgrgshef4ae.canadacentral-01.azurewebsites.net/api/students/search`,
      {
        params: { query: search.value, per_page: 50, page: page.value },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) students.value = response.data.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
};

// Modal Handlers
const openStudentDetails = (student) => {
  selectedStudent.value = student;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Handle Search
const debouncedFetchSearchResults = debounce(fetchSearchResults, 1000);
const handleSearchInput = () => {
  debouncedFetchSearchResults();
};

// Fetch Students on Mount
fetchDatabase();
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
