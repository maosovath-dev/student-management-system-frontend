<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["update:currentPage"]);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / props.pageSize))
);

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = props.currentPage;

  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) {
    return [1, "…", total - 3, total - 2, total - 1, total];
  }
  return [1, "…", current - 1, current, current + 1, "…", total];
});

const firstItem = computed(() =>
  props.totalItems ? (props.currentPage - 1) * props.pageSize + 1 : 0
);
const lastItem = computed(() =>
  Math.min(props.currentPage * props.pageSize, props.totalItems)
);

const goToPage = (page) => {
  if (typeof page !== "number" || page < 1 || page > totalPages.value || page === props.currentPage) {
    return;
  }
  emit("update:currentPage", page);
};
</script>

<template>
  <nav v-if="totalItems > pageSize" class="base-pagination" aria-label="ទំព័រទិន្នន័យ">
    <span class="pagination-summary">
      បង្ហាញ {{ firstItem }}–{{ lastItem }} ក្នុងចំណោម {{ totalItems }} ធាតុ
    </span>

    <div v-if="totalPages > 1" class="pagination-controls">
      <button
        type="button"
        class="pagination-button pagination-arrow"
        :disabled="currentPage === 1"
        aria-label="ទំព័រមុន"
        @click="goToPage(currentPage - 1)"
      >
        <i class="bi bi-chevron-left" aria-hidden="true"></i>
      </button>

      <template v-for="(page, index) in visiblePages" :key="`${page}-${index}`">
        <span v-if="page === '…'" class="pagination-ellipsis" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          class="pagination-button"
          :class="{ active: currentPage === page }"
          :aria-label="`ទំព័រ ${page}`"
          :aria-current="currentPage === page ? 'page' : undefined"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </template>

      <button
        type="button"
        class="pagination-button pagination-arrow"
        :disabled="currentPage === totalPages"
        aria-label="ទំព័របន្ទាប់"
        @click="goToPage(currentPage + 1)"
      >
        <i class="bi bi-chevron-right" aria-hidden="true"></i>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.base-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-top: 1px solid #edf2ef;
  color: #64756b;
  font-size: 12px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination-button {
  display: inline-grid;
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  place-items: center;
  border: 1px solid #dfe8e3;
  border-radius: 8px;
  background: #fff;
  color: #52665a;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  transition: background .16s ease, border-color .16s ease, color .16s ease;
}

.pagination-button:hover:not(:disabled) {
  border-color: #9dc9aa;
  background: #f0f8f2;
  color: #176b3e;
}

.pagination-button.active {
  border-color: #16834b;
  background: #16834b;
  color: #fff;
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: .45;
}

.pagination-button:focus-visible {
  outline: 3px solid rgb(22 131 75 / 22%);
  outline-offset: 2px;
}

.pagination-ellipsis {
  min-width: 20px;
  color: #829188;
  text-align: center;
}

:global(:root[data-theme="dark"]) .base-pagination {
  border-color: #2b3c31;
  color: #bdcbc1;
}

:global(:root[data-theme="dark"]) .pagination-button {
  border-color: #405447;
  background: #17221b;
  color: #dce7df;
}

:global(:root[data-theme="dark"]) .pagination-button:hover:not(:disabled) {
  border-color: #50755b;
  background: #24382a;
  color: #a4e9b7;
}

:global(:root[data-theme="dark"]) .pagination-button.active {
  border-color: #48a66a;
  background: #28784a;
  color: #fff;
}

:global(:root[data-theme="dark"]) .pagination-ellipsis {
  color: #aebdb3;
}

@media (max-width: 560px) {
  .base-pagination {
    align-items: flex-start;
    flex-direction: column;
    padding: 14px;
  }

  .pagination-controls {
    align-self: center;
    max-width: 100%;
    overflow-x: auto;
  }
}
</style>
