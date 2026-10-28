<script setup>
import { useTheme } from "@/composables/useTheme";

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="isDark ? 'ប្ដូរទៅរបៀបពន្លឺ' : 'ប្ដូរទៅរបៀបងងឹត'"
    :aria-pressed="isDark"
    :title="isDark ? 'របៀបពន្លឺ' : 'របៀបងងឹត'"
    @click="toggleTheme"
  >
    <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill'" aria-hidden="true"></i>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  width: 36px;
  min-width: 36px;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid #dfe9e2;
  border-radius: 9px;
  background: #fff;
  color: #53685c;
  cursor: pointer;
  font: inherit;
  transition: color .18s ease, border-color .18s ease, background .18s ease;
}

.theme-toggle:hover {
  border-color: #a9cfb7;
  background: #f1f8f3;
  color: #13865e;
}

.theme-toggle:focus-visible {
  outline: 3px solid rgba(19, 134, 94, .24);
  outline-offset: 2px;
}

.theme-toggle i {
  font-size: 15px;
}
</style>
