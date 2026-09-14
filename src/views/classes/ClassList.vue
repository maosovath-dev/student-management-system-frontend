<script setup>
const classes = [
  { id: 1, name: 'Grade 10A', teacher: 'Mr. Sok', students: 32 },
  { id: 2, name: 'Grade 11B', teacher: 'Ms. Nary', students: 28 },
  { id: 3, name: 'Grade 12C', teacher: 'Mr. Vuth', students: 24 }
];
</script>

<template>
  <div class="page-shell">
    <div class="page-header">
      <div>
        <h1>Classes</h1>
        <p>Academic classes in the system</p>
      </div>
    </div>

    <div class="card-grid">
      <div v-for="item in classes" :key="item.id" class="class-card">
        <span class="tag">Class</span>
        <h3>{{ item.name }}</h3>
        <p>Teacher: {{ item.teacher }}</p>
        <p>Students: {{ item.students }}</p>
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

.class-card {
  background: white;
  border: 1px solid #e4eee8;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(23, 70, 49, 0.04);
}

.tag {
  display: inline-block;
  background: #e3f6eb;
  color: #169253;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 10px;
  font-weight: 700;
}

.class-card h3 {
  margin: 12px 0 8px;
  color: #17251f;
}

.class-card p {
  margin: 4px 0;
  color: #67766e;
  font-size: 12px;
}
</style>
