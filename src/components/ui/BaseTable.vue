<script setup>
import { computed, ref, watch } from "vue";
import BasePagination from "@/components/ui/BasePagination.vue";

const props = defineProps({
  // ក្បាលតារាង (Headers): [{ key: 'id', label: 'ID', sortable: true }, ...]
  columns: {
    type: Array,
    required: true,
  },
  // ទិន្នន័យ (Rows Data)
  items: {
    type: Array,
    default: () => [],
  },
  // បង្ហាញ Loading State
  loading: {
    type: Boolean,
    default: false,
  },
  // អក្សរបង្ហាញពេលគ្មានទិន្នន័យ
  emptyText: {
    type: String,
    default: "មិនមានទិន្នន័យបង្ហាញឡើយ",
  },
  tableClass: {
    type: [String, Array, Object],
    default: "",
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const currentPage = ref(1);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.items.length / props.pageSize))
);
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return props.items.slice(start, start + props.pageSize);
});
const rowIndexOffset = computed(() => (currentPage.value - 1) * props.pageSize);

watch(
  () => props.items.map((item) => item?.id ?? item?.student_id ?? item),
  () => {
    currentPage.value = 1;
  }
);

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages;
});
</script>

<template>
  <div class="table-container">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span>កំពុងទាញយកទិន្នន័យ...</span>
    </div>

    <table class="base-table" :class="tableClass">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: col.width || 'auto', textAlign: col.align || 'left' }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- ករណីមានទិន្នន័យ (Data Present) -->
        <template v-if="items.length > 0">
          <tr v-for="(item, index) in paginatedItems" :key="item.id ?? item.student_id ?? index">
            <td
              v-for="col in columns"
              :key="col.key"
              :style="{ textAlign: col.align || 'left' }"
            >
              <!-- Slot សម្រាប់ Custom Content តាម Key (ឧ. #cell-status="{ row }") -->
              <slot :name="`cell-${col.key}`" :row="item" :index="rowIndexOffset + index">
                {{ item[col.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </template>

        <!-- ករណីគ្មានទិន្នន័យ (Empty State) -->
        <tr v-else-if="!loading">
          <td :colspan="columns.length" class="empty-cell">
            <div class="empty-state">
              <i class="bi bi-inbox empty-icon"></i>
              <p>{{ emptyText }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <BasePagination
      v-model:current-page="currentPage"
      :total-items="items.length"
      :page-size="pageSize"
    />
  </div>
</template>

<style scoped>
.table-container {
  position: relative;
  width: 100%;
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: left;
}

/* Header Styling */
.base-table thead tr {
  background-color: #f8faf9;
  border-bottom: 1px solid #e5e7eb;
}

.base-table th {
  padding: 12px 16px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

/* Body Row Styling */
.base-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease;
}

.base-table tbody tr:last-child {
  border-bottom: none;
}

.base-table tbody tr:hover {
  background-color: #f9fafb;
}

.base-table td {
  padding: 12px 16px;
  color: #4b5563;
  vertical-align: middle;
}

/* Empty State */
.empty-cell {
  padding: 40px 16px !important;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  gap: 8px;
}

.empty-icon {
  font-size: 32px;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 10;
  color: #16834b;
  font-weight: 500;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e3f4ea;
  border-top-color: #16834b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>