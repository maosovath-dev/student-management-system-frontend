<script setup>
const attendanceRecords = [
  { id: 1, subject: 'Math', status: 'Present', date: '2026-06-12' },
  { id: 2, subject: 'Science', status: 'Late', date: '2026-06-12' },
  { id: 3, subject: 'English', status: 'Absent', date: '2026-06-13' }
];
</script>

<template>
  <div class="page-shell">
    <div class="page-header">
      <div>
        <h1>Attendance</h1>
        <p>Student attendance overview</p>
      </div>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in attendanceRecords" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.subject }}</td>
            <td>{{ record.status }}</td>
            <td>{{ record.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  padding: 32px;
  background: #f5f9f7;
  min-height: calc(100vh - 70px);
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #1a2c24;
  font-size: 28px;
}

.page-header p {
  margin: 6px 0 0;
  color: #72847d;
}

.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e4eee8;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(23, 70, 49, 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #edf2ef;
}

th {
  color: #587066;
  font-size: 12px;
}

td {
  color: #4f625b;
  font-size: 12px;
}
</style>
