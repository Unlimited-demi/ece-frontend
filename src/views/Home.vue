<template>
  <div>
    <!-- Main Content -->
    <div class="h-full w-full bg-green-700 p-5">
      <h3 class="text-2xl text-center text-white mb-5">ECE UNN DATABASE</h3>

      <!-- Search Input -->
      <input
        type="text"
        v-model="search"
        @input="handleSearchInput"
        placeholder="Search by name or reg number"
        class="mb-4 p-2 w-full rounded-md border border-gray-300"
      />

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center items-center h-32">
        <LoadingSpinner />
      </div>

      <!-- Student Table -->
      <table v-if="!loading" class="table-auto w-full text-left bg-white shadow-md rounded-lg">
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
          :disabled="page === 1 || loading"
          @click="prevPage"
          class="px-4 py-2 bg-slate-600 text-white rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-white">Page {{ page }}</span>
        <button
          @click="nextPage"
          :disabled="loading"
          class="px-4 py-2 bg-slate-600 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-green-700">Student Details</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <div>
            <p class="p-2"><strong>Reg Number:</strong> {{ selectedStudent?.reg_number }}</p>
            <p class="p-2"><strong>First Name:</strong> {{ selectedStudent?.first_name }}</p>
            <p class="p-2"><strong>Middle Name:</strong> {{ selectedStudent?.middle_name }}</p>
            <p class="p-2"><strong>Last Name:</strong> {{ selectedStudent?.last_name }}</p>
            <p class="p-2"><strong>Gender:</strong> {{ selectedStudent?.gender }}</p>
            <p class="p-2"><strong>Level:</strong> {{ selectedStudent?.level }}</p>
            <p class="p-2"><strong>Date of Birth:</strong> {{ selectedStudent?.date_of_birth.split('T')[0] }}</p>
          </div>
          <div>
            <p class="p-2"><strong>Religion:</strong> {{ selectedStudent?.religion }}</p>
            <p class="p-2"><strong>Nationality:</strong> {{ selectedStudent?.nationality }}</p>
            <p class="p-2"><strong>State of Origin:</strong> {{ selectedStudent?.state_of_origin }}</p>
            <p class="p-2"><strong>State of Residence:</strong> {{ selectedStudent?.state_of_residence }}</p>
            <p class="p-2"><strong>Guardian:</strong> {{ selectedStudent?.guardian_name }}</p>
            <p class="p-2"><strong>Guardian Phone:</strong> {{ selectedStudent?.guardian_phone_number }}</p>
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
import { ref, onMounted } from "vue";
import { debounce } from "lodash";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { useAuthStore } from "../stores/store";

const students = ref([]);
const page = ref(1);
const search = ref("");
const loading = ref(false);
const showModal = ref(false);
const selectedStudent = ref(null);

const store = useAuthStore();
const token = store.token; // Replace with your token management logic

const fetchDatabase = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/api/students`,
      {
        params: { per_page: 50, page: page.value },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) students.value = response.data.data;
  } catch (error) {
    console.error("Error fetching database:", error);
  } finally {
    loading.value = false;
  }
};

const fetchSearchResults = async () => {
  if (!search.value.trim()) {
    fetchDatabase();
    return;
  }
  loading.value = true;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/api/students/search`,
      {
        params: { query: search.value, per_page: 50, page: page.value },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) students.value = response.data.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
  } finally {
    loading.value = false;
  }
};

const handleSearchInput = debounce(() => {
  fetchSearchResults();
}, 1000);

const openStudentDetails = (student) => {
  selectedStudent.value = student;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchDatabase();
  }
};

const nextPage = () => {
  page.value++;
  fetchDatabase();
};

onMounted(() => {
  fetchDatabase();
});
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
