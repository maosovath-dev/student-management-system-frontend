<script setup>
const profile = {
  name: 'Teacher Admin',
  email: 'admin@school.edu',
  role: 'Administrator',
  phone: '+855 12 345 678'
};
</script>

<template>
  <div class="page-shell">
    <div class="page-header">
      <div>
        <h1>Profile</h1>
        <p>Account information</p>
      </div>
    </div>

    <div class="profile-card">
      <div class="avatar">TA</div>
      <h2>{{ profile.name }}</h2>
      <p>{{ profile.role }}</p>
      <ul>
        <li><strong>Email:</strong> {{ profile.email }}</li>
        <li><strong>Phone:</strong> {{ profile.phone }}</li>
      </ul>
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

.profile-card {
  max-width: 480px;
  background: white;
  border: 1px solid #e4eee8;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 6px 20px rgba(23, 70, 49, 0.04);
}

.avatar {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e3f6eb;
  color: #169253;
  font-weight: 800;
  font-size: 24px;
}

.profile-card h2 {
  margin: 18px 0 4px;
  color: #17251f;
}

.profile-card p {
  margin: 0 0 14px;
  color: #6a7a72;
}

.profile-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  color: #495d56;
}

.profile-card li {
  margin: 8px 0;
}
</style>
