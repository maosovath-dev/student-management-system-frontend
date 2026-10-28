<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useClassStore } from "../../stores/classe.store";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import { useToast } from "@/composables/useToast";

// Base UI Component
import BaseModal from "@/components/ui/BaseModal.vue";

const classStore = useClassStore();
const { showToast } = useToast();

const search = ref("");
const formError = ref("");
const canManageClasses = computed(() => {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}").role === "admin";
    } catch {
        return false;
    }
});

// Modal States
const isCreateModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isViewModalOpen = ref(false);

// Active Item Selection for Delete
const selectedClass = ref(null);

// Forms
const createForm = reactive({
    name: "",
    description: "",
});

const updateForm = reactive({
    id: null,
    name: "",
    description: "",
});

const classTableColumns = computed(() => [
    { key: "number", label: "#" },
    { key: "class", label: "ឈ្មោះថ្នាក់" },
    { key: "description", label: "ការពិពណ៌នា" },
    { key: "code", label: "លេខសម្គាល់" },
    { key: "students", label: "ចំនួនសិស្ស" },
    { key: "status", label: "ស្ថានភាព" },
    ...(canManageClasses.value ? [{ key: "actions", label: "សកម្មភាព" }] : []),
]);

onMounted(() => {
    classStore.fetchClasses();
});

const filteredClasses = computed(() => {
    if (!search.value) {
        return classStore.classes;
    }

    const keyword = search.value.toLowerCase();

    return classStore.classes.filter((item) => {
        return (
            String(item.id).toLowerCase().includes(keyword) ||
            String(item.name || "").toLowerCase().includes(keyword) ||
            String(item.description || "").toLowerCase().includes(keyword)
        );
    });
});

// Reset forms on modal open
const openCreateModal = () => {
    createForm.name = "";
    createForm.description = "";
    formError.value = "";
    isCreateModalOpen.value = true;
};

const openEditModal = (item) => {
    updateForm.id = item.id;
    updateForm.name = item.name;
    updateForm.description = item.description || "";
    formError.value = "";
    isUpdateModalOpen.value = true;
};

const openDeleteModal = (item) => {
    selectedClass.value = item;
    formError.value = "";
    isDeleteModalOpen.value = true;
};

const openViewModal = (item) => {
    selectedClass.value = item;
    isViewModalOpen.value = true;
};

// Handlers connected to Pinia Store
const handleCreateClass = async () => {
    if (!createForm.name.trim()) {
        formError.value = "សូមបញ្ចូលឈ្មោះថ្នាក់";
        showToast(formError.value, "warning");
        return;
    }

    formError.value = "";

    try {
        await classStore.createClass({
            name: createForm.name.trim(),
            description: createForm.description.trim(),
        });
        isCreateModalOpen.value = false;
        showToast("បានបន្ថែមថ្នាក់រៀនជោគជ័យ។", "success");
    } catch (error) {
        formError.value =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            "មិនអាចបន្ថែមថ្នាក់បានទេ";
        showToast(formError.value, "error");
    }
};

const handleUpdateClass = async () => {
    if (!updateForm.name.trim()) {
        formError.value = "សូមបញ្ចូលឈ្មោះថ្នាក់";
        showToast(formError.value, "warning");
        return;
    }

    formError.value = "";

    try {
        await classStore.updateClass(updateForm.id, {
            name: updateForm.name.trim(),
            description: updateForm.description.trim(),
        });
        isUpdateModalOpen.value = false;
        showToast("បានកែប្រែព័ត៌មានថ្នាក់រៀនជោគជ័យ។", "success");
    } catch (error) {
        formError.value =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            "មិនអាចកែប្រែថ្នាក់បានទេ";
        showToast(formError.value, "error");
    }
};

const handleDeleteClass = async () => {
    if (!selectedClass.value) return;

    formError.value = "";

    try {
        await classStore.deleteClass(selectedClass.value.id);
        isDeleteModalOpen.value = false;
        showToast("បានលុបថ្នាក់រៀនជោគជ័យ។", "success");
    } catch (error) {
        formError.value =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            "មិនអាចលុបថ្នាក់បានទេ";
        showToast(formError.value, "error");
    }
};
</script>

<template>
    <div class="page">
        <!-- Page Header -->
        <div class="page-header">
            <div class="page-title">
                <div class="title-icon"><i class="bi bi-building-fill" aria-hidden="true"></i></div>
                <div>
                    <h1>ថ្នាក់</h1>
                    <p>គ្រប់គ្រង និងមើលព័ត៌មានថ្នាក់រៀន</p>
                </div>
            </div>

            <BaseButton
                v-if="canManageClasses"
                variant="primary"
                icon="bi bi-plus-lg"
                @click="openCreateModal"
            >
                បន្ថែមថ្នាក់
            </BaseButton>
        </div>

        <!-- Summary -->
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-icon"><i class="bi bi-building" aria-hidden="true"></i></div>
                <div>
                    <p>ចំនួនថ្នាក់</p>
                    <h2>{{ classStore.totalClasses }}</h2>
                    <span>ថ្នាក់សរុបក្នុងប្រព័ន្ធ</span>
                </div>
            </div>
        </div>

        <!-- Table Card -->
        <section class="table-card">
            <!-- Table Header -->
            <div class="table-header">
                <div>
                    <h2>បញ្ជីថ្នាក់</h2>
                    <p>មានថ្នាក់សរុប {{ filteredClasses.length }} ថ្នាក់</p>
                </div>

                <div class="table-search">
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <BaseInput
                        v-model="search"
                        type="text"
                        placeholder="ស្វែងរកថ្នាក់..."
                    />
                </div>
            </div>

            <!-- Loading -->
            <div v-if="classStore.loading" class="loading">
                កំពុងផ្ទុកទិន្នន័យ...
            </div>

            <!-- Error -->
            <div v-else-if="classStore.error" class="error">
                {{ classStore.error }}
            </div>

            <!-- Table -->
            <div v-else class="table-wrapper">
                <BaseTable
                    :columns="classTableColumns"
                    :items="filteredClasses"
                    empty-text="មិនមានទិន្នន័យថ្នាក់ទេ"
                >
                    <template #cell-number="{ index }">{{ index + 1 }}</template>
                    <template #cell-class="{ row }">
                        <div class="class-info">
                            <div class="class-avatar">🏫</div>
                            <div>
                                <strong>{{ row.name }}</strong>
                                <small>ID: {{ row.id }}</small>
                            </div>
                        </div>
                    </template>
                    <template #cell-description="{ row }">{{ row.description || "-" }}</template>
                    <template #cell-code="{ row }">
                        <span class="code">
                            {{ row.code || `CLS${String(row.id).padStart(3, "0")}` }}
                        </span>
                    </template>
                    <template #cell-students="{ row }">
                        <span class="student-count">👥 {{ row.student_count || 0 }}</span>
                    </template>
                    <template #cell-status><span class="status">● សកម្ម</span></template>
                    <template #cell-actions="{ row }">
                        <div class="actions">
                            <BaseButton
                                class="view"
                                variant="ghost"
                                size="sm"
                                icon="bi bi-eye"
                                icon-only
                                icon-tone="view"
                                title="មើលព័ត៌មានលម្អិត"
                                aria-label="មើលព័ត៌មានលម្អិត"
                                @click="openViewModal(row)"
                            />
                            <BaseButton
                                v-if="canManageClasses"
                                class="edit"
                                variant="ghost"
                                size="sm"
                                icon="bi bi-pencil-square"
                                icon-only
                                icon-tone="edit"
                                title="កែប្រែថ្នាក់"
                                aria-label="កែប្រែថ្នាក់"
                                @click="openEditModal(row)"
                            />
                            <BaseButton
                                v-if="canManageClasses"
                                class="delete"
                                variant="ghost"
                                size="sm"
                                icon="bi bi-trash3"
                                icon-only
                                icon-tone="delete"
                                title="លុបថ្នាក់"
                                aria-label="លុបថ្នាក់"
                                @click="openDeleteModal(row)"
                            />
                        </div>
                    </template>
                </BaseTable>
            </div>
        </section>

        <!-- ================= MODALS USING BASEMODAL ================= -->

        <!-- Class Detail Modal -->
        <BaseModal
            :is-open="isViewModalOpen"
            title="ព័ត៌មានលម្អិតថ្នាក់"
            @close="isViewModalOpen = false"
        >
            <dl v-if="selectedClass" class="class-details">
                <div>
                    <dt>ឈ្មោះថ្នាក់</dt>
                    <dd>{{ selectedClass.name || "-" }}</dd>
                </div>
                <div>
                    <dt>ការពិពណ៌នា</dt>
                    <dd>{{ selectedClass.description || "-" }}</dd>
                </div>
                <div>
                    <dt>លេខសម្គាល់</dt>
                    <dd>{{ selectedClass.code || `CLS${String(selectedClass.id).padStart(3, "0")}` }}</dd>
                </div>
                <div>
                    <dt>ចំនួនសិស្ស</dt>
                    <dd>{{ selectedClass.student_count || 0 }}</dd>
                </div>
                <div>
                    <dt>ស្ថានភាព</dt>
                    <dd>{{ selectedClass.status || "សកម្ម" }}</dd>
                </div>
            </dl>

            <template #footer>
                <BaseButton
                    type="button"
                    variant="secondary"
                    @click="isViewModalOpen = false"
                >
                    បិទ
                </BaseButton>
            </template>
        </BaseModal>

        <!-- Create Class Modal -->
        <BaseModal
            :is-open="isCreateModalOpen"
            title="បន្ថែមថ្នាក់"
            @close="isCreateModalOpen = false"
        >
            <form @submit.prevent="handleCreateClass" class="modal-form class-form">
                <div class="form-group">
                    <label>ឈ្មោះថ្នាក់</label>
                    <BaseInput
                        v-model="createForm.name"
                        type="text"
                        placeholder="ឧ. Year 4 - CS"
                        required
                    />
                </div>

                <div class="form-group">
                    <label>ការពិពណ៌នា</label>
                    <BaseInput
                        v-model="createForm.description"
                        type="text"
                        placeholder="ឧ. ថ្នាក់ទី១១ ក្រុម A"
                    />
                </div>
            </form>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <template #footer>
                <BaseButton
                    type="button"
                    variant="secondary"
                    @click="isCreateModalOpen = false"
                >
                    បោះបង់
                </BaseButton>
                <BaseButton
                    type="button"
                    variant="primary"
                    :disabled="classStore.loading"
                    @click="handleCreateClass"
                >
                    {{ classStore.loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក" }}
                </BaseButton>
            </template>
        </BaseModal>

        <!-- Update Class Modal -->
        <BaseModal
            :is-open="isUpdateModalOpen"
            title="កែប្រែថ្នាក់"
            @close="isUpdateModalOpen = false"
        >
            <form @submit.prevent="handleUpdateClass" class="modal-form class-form">
                <div class="form-group">
                    <label>ឈ្មោះថ្នាក់</label>
                    <BaseInput
                        v-model="updateForm.name"
                        type="text"
                        required
                    />
                </div>

                <div class="form-group">
                    <label>ការពិពណ៌នា</label>
                    <BaseInput
                        v-model="updateForm.description"
                        type="text"
                        placeholder="ឧ. ថ្នាក់ទី១១ ក្រុម A"
                    />
                </div>
            </form>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <template #footer>
                <BaseButton
                    type="button"
                    variant="secondary"
                    @click="isUpdateModalOpen = false"
                >
                    បោះបង់
                </BaseButton>
                <BaseButton
                    type="button"
                    variant="primary"
                    :disabled="classStore.loading"
                    @click="handleUpdateClass"
                >
                    {{ classStore.loading ? "កំពុងកែប្រែ..." : "បច្ចុប្បន្នភាព" }}
                </BaseButton>
            </template>
        </BaseModal>

        <!-- Delete Class Modal -->
        <BaseModal
            :is-open="isDeleteModalOpen"
            title="លុបថ្នាក់"
            @close="isDeleteModalOpen = false"
        >
            <div class="delete-confirm-text">
                <p>តើអ្នកពិតជាចង់លុបថ្នាក់នេះមែនទេ?</p>
                <strong v-if="selectedClass">{{ selectedClass.name }}</strong>
            </div>
            <p v-if="formError" class="form-error">{{ formError }}</p>

            <template #footer>
                <BaseButton
                    type="button"
                    variant="secondary"
                    @click="isDeleteModalOpen = false"
                >
                    បោះបង់
                </BaseButton>
                <BaseButton
                    type="button"
                    variant="danger"
                    :disabled="classStore.loading"
                    @click="handleDeleteClass"
                >
                    {{ classStore.loading ? "កំពុងលុប..." : "លុប" }}
                </BaseButton>
            </template>
        </BaseModal>
    </div>
</template>

<style scoped>
.page {
    max-width: 100%;
    padding: 32px 24px;
}

/* ================= HEADER ================= */
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
}

.page-title {
    display: flex;
    align-items: center;
    gap: 20px;
}

.title-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: #e0f7ea;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
}

.page-title h1 {
    margin: 0 0 5px;
    font-size: 30px;
    color: #183c2b;
}

.page-title p {
    margin: 0;
    color: #8b9992;
}

/* ================= SUMMARY ================= */
.summary-grid {
    display: flex;
    margin-bottom: 34px;
}

.summary-card {
    width: 325px;
    background: white;
    border: 1px solid #e3eee8;
    border-radius: 20px;
    padding: 25px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 8px 25px rgba(37, 74, 56, 0.04);
}

.summary-icon {
    width: 65px;
    height: 65px;
    background: #e3f7ec;
    border-radius: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
}

.summary-card p {
    margin: 0;
    color: #7f9187;
    font-size: 14px;
}

.summary-card h2 {
    margin: 3px 0;
    font-size: 30px;
    color: #183c2b;
}

.summary-card span {
    color: #169c51;
    font-size: 12px;
}

/* ================= TABLE CARD ================= */
.table-card {
    background: white;
    border-radius: 22px;
    border: 1px solid #e1ebe6;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(38, 77, 57, 0.04);
}

.table-header {
    min-height: 120px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.table-header h2 {
    margin: 0;
    font-size: 23px;
    color: #183c2b;
}

.table-header p {
    margin: 4px 0 0;
    color: #9aa69f;
    font-size: 14px;
}

.table-search {
    width: 390px;
    height: 56px;
    border: 1px solid #dce7e1;
    border-radius: 14px;
    display: flex;
    align-items: center;
    padding: 0 18px;
    color: #82928a;
}

.table-search > i {
    flex: 0 0 auto;
    color: #82928a;
    font-size: 16px;
}

.table-search :deep(.input-group) {
    min-width: 0;
}

.table-search :deep(.input-wrapper) {
    min-width: 0;
}

.table-search :deep(.base-input) {
    width: 100%;
    border: 0;
    outline: 0;
    margin-left: 12px;
    font-family: inherit;
    font-size: 14px;
}

/* ================= TABLE ================= */
.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

:deep(.base-table) {
    width: 100%;
    border-collapse: collapse;
    min-width: 850px;
}

:deep(.base-table thead) {
    background: #f1f8f4;
}

:deep(.base-table th) {
    padding: 18px 22px;
    text-align: left;
    color: #50665a;
    font-size: 14px;
    font-weight: 700;
}

:deep(.base-table td) {
    padding: 18px 22px;
    border-top: 1px solid #edf2ef;
    color: #607168;
    font-size: 14px;
}

.class-info {
    display: flex;
    align-items: center;
    gap: 13px;
}

.class-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #e2f7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.class-info strong {
    display: block;
    color: #1b3c2c;
    font-size: 15px;
}

.class-info small {
    display: block;
    margin-top: 4px;
    color: #9ba8a2;
}

.code {
    padding: 7px 13px;
    border-radius: 8px;
    background: #eaf8f0;
    color: #149b50;
    font-weight: 700;
    font-size: 12px;
}

.student-count {
    color: #5e7067;
    font-weight: 600;
}

.status {
    background: #e6f8ee;
    color: #149b50;
    padding: 7px 13px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
}

.actions {
    display: flex;
    align-items: center;
    gap: 7px;
}

.loading,
.error,
.empty {
    text-align: center;
    padding: 50px;
    color: #8b9992;
}

.error {
    color: #d84c4c;
}

/* ================= MODAL FORM STYLES ================= */
.modal-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 10px 0;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #183c2b;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #dce7e1;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: 0.2s;
}

.form-group input:focus,
.form-group select:focus {
    border-color: #149b50;
    box-shadow: 0 0 0 3px rgba(20, 155, 80, 0.1);
}

.delete-confirm-text {
    text-align: center;
    padding: 15px 0;
    color: #50665a;
}

.delete-confirm-text strong {
    display: block;
    margin-top: 8px;
    font-size: 16px;
    color: #183c2b;
}

.form-error {
    margin: 0;
    color: #d84c4c;
    font-size: 14px;
}

.class-details {
    display: grid;
    gap: 14px;
    margin: 0;
}

.class-details > div {
    display: grid;
    grid-template-columns: minmax(110px, 0.8fr) 1.2fr;
    gap: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #edf2ef;
}

.class-details dt {
    color: #82928a;
    font-size: 14px;
}

.class-details dd {
    margin: 0;
    color: #183c2b;
    font-weight: 600;
    overflow-wrap: anywhere;
}

@media (max-width: 900px) {
    .page-header {
        align-items: flex-start;
        gap: 20px;
        flex-direction: column;
    }

    .table-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    .table-search {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .page {
        padding-inline: 16px;
    }
}
</style>