<template>
  <div>
    <!-- Main Content -->
    <div class="h-full w-full ml-10 bg-green-700 p-5">
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
  </div>
</template>

<script>
import { ref } from "vue";
import { debounce } from "lodash";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { useAuthStore } from "../stores/store";

export default {
  components: {
    LoadingSpinner,
  },
  setup() {
    const students = ref([]);
    const page = ref(1);
    const search = ref("");
    const loading = ref(false);
    const store = useAuthStore()

    const token = store.token; // Replace with your token management logic

    // Fetch All Students
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

    // Fetch Search Results
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

    // Handle Search Input
    const debouncedFetchSearchResults = debounce(fetchSearchResults, 1000);
    const handleSearchInput = () => {
      debouncedFetchSearchResults();
    };

    // Pagination Handlers
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

    // Fetch Students on Mount
    fetchDatabase();

    return {
      students,
      page,
      search,
      loading,
      fetchDatabase,
      fetchSearchResults,
      handleSearchInput,
      prevPage,
      nextPage,
    };
  },
};
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
