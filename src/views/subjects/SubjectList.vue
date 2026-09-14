<script setup>
const subjects = [
  { id: 1, name: 'Mathematics', teacher: 'Mr. Sok' },
  { id: 2, name: 'Science', teacher: 'Ms. Nary' },
  { id: 3, name: 'English', teacher: 'Mr. Vuth' }
];
</script>

<template>
  <div class="page-shell">
    <div class="page-header">
      <div>
        <h1>Subjects</h1>
        <p>Available subjects in school</p>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="subject in subjects" :key="subject.id" class="subject-card">
        <span class="tag">Subject</span>
        <h3>{{ subject.name }}</h3>
        <p>Teacher: {{ subject.teacher }}</p>
      </div>
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

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.subject-card {
  background: white;
  border: 1px solid #e4eee8;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(23, 70, 49, 0.04);
}

.tag {
  display: inline-block;
  background: #e7f0ff;
  color: #3978cc;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 10px;
  font-weight: 700;
}

.subject-card h3 {
  margin: 12px 0 8px;
  color: #17251f;
}

.subject-card p {
  margin: 4px 0;
  color: #67766e;
  font-size: 12px;
}
</style>
