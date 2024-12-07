  
<template>
<div class="h-full w-full ml-10  bg-slate-500"> 
<h3 class="text-2xl justify-items-center ">ECE UNN DATABASE</h3>
</div>
<div v-for="student in students">
  <pre> {{ student.first_name }} </pre>
  <div></div>
</div> 

//implement search bar to ppoint to a url and then display results in this same vue and then display the results in a table style withh css only return firstname ,last name ,reg_number
  <!-- <div>
    <Table class="p-2 text-sm">
      <TableHeader class="bg-[#E4E4E5]">
        <TableRow>
          <TableHead class="table-header">Ticket Number</TableHead>
          <TableHead class="table-header">Customer Name</TableHead>
          <TableHead class="table-header">Created At</TableHead>
          <TableHead class="table-header">Agent Action</TableHead>
          <TableHead class="table-header">Last Conversation</TableHead>
          <TableHead class="table-header">Channel</TableHead>
          <TableHead class="table-header">Agent Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(row, index) in escalationList"
          :key="row.id"
          :style="{ backgroundColor: row.background_color || '#ffffff' }"
          class="border-b border-gray-300 p-2 text-sm hover:bg-opacity-90"
        >
          <TableCell class="text-sm font-normal">{{ row.ticket_number }}</TableCell>
          <TableCell class="text-sm font-normal">{{ row.customer_name }}</TableCell>
          <TableCell class="text-sm font-normal">{{ row.created_at }}</TableCell>
          <TableCell class="text-sm font-normal br-3" ><Badge
            class="w-fit text-center"
            :variant="getBadgeColor(row.agent_action)"
            >{{ row.agent_action }}</Badge></TableCell>
          <TableCell class="text-sm font-normal">{{ row.last_conversation }}</TableCell>
          <TableCell class="text-sm font-normal">{{ row.channel }}</TableCell>
          <TableCell class="text-sm font-normal">{{ row.agent_name || 'N/A' }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div> -->
</template>


<script setup>
import { onMounted, ref } from 'vue';

// import { useRouter } from 'vue-router';
// import { useToast } from 'vue-toastification';
// import 'vue-toastification/dist/index.css';
import axios from 'axios';
// import Table from '../components/Table.vue';
// import TableBody from '../components/TableBody.vue';
// import TableHead from '../components/TableHeader.vue';
// import TableRow from '../components/TableRow.vue';

import { useAuthStore } from "../stores/store";

const data = ref([])
const store = useAuthStore();
console.log("token" , store.token , store.$state.token)
const token = "10|iGsCAdYcOyFGsKrRiUr46TMvnQ5endPuVQYQVmLpf660ea41"
const students = ref([]);
const getStudentData = async () => {
 try {
  const response = await axios.get('https://ece-database-azgbhzgrgshef4ae.canadacentral-01.azurewebsites.net/api/students', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if(response.status === 200){
    students.value = response.data.data;
  }
  
  console.log(students.value);
} catch (error) {
  console.error(error);
}
};


onMounted( () => {
  getStudentData();
})
</script>