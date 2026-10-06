<script setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useClassStore } from "../../stores/classe.store";

// Base UI Component
import BaseModal from "@/components/ui/BaseModal.vue";

const classStore = useClassStore();

const search = ref("");
const formError = ref("");

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
            String(item.name || "").toLowerCase().includes(keyword)
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
        return;
    }

    formError.value = "";

    try {
        await classStore.createClass({
            name: createForm.name.trim(),
            description: createForm.description.trim(),
        });
        isCreateModalOpen.value = false;
    } catch (error) {
        formError.value =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            "មិនអាចបន្ថែមថ្នាក់បានទេ";
    }
};

const handleUpdateClass = async () => {
    if (!updateForm.name.trim()) {
        formError.value = "សូមបញ្ចូលឈ្មោះថ្នាក់";
        return;
    }

    formError.value = "";

    try {
        await classStore.updateClass(updateForm.id, {
            name: updateForm.name.trim(),
            description: updateForm.description.trim(),
        });
        isUpdateModalOpen.value = false;
    } catch (error) {
        formError.value =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            "មិនអាចកែប្រែថ្នាក់បានទេ";
    }
};

const handleDeleteClass = async () => {
    if (!selectedClass.value) return;

    formError.value = "";

    try {
        await classStore.deleteClass(selectedClass.value.id);
        isDeleteModalOpen.value = false;
    } catch (error) {
        formError.value =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            "មិនអាចលុបថ្នាក់បានទេ";
    }
};
</script>

<template>
    <div class="page">
        <!-- Page Header -->
        <div class="page-header">
            <div class="page-title">
                <div class="title-icon">🏫</div>
                <div>
                    <h1>ថ្នាក់</h1>
                    <p>គ្រប់គ្រង និងមើលព័ត៌មានថ្នាក់រៀន</p>
                </div>
            </div>

            <button class="add-btn" @click="openCreateModal">
                <span>＋</span> បន្ថែមថ្នាក់
            </button>
        </div>

        <!-- Summary -->
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-icon">🏫</div>
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
                    <span>⌕</span>
                    <input
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
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ឈ្មោះថ្នាក់</th>
                            <th>ការពិពណ៌នា</th>
                            <th>លេខសម្គាល់</th>
                            <th>ចំនួនសិស្ស</th>
                            <th>ស្ថានភាព</th>
                            <th>សកម្មភាព</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="(item, index) in filteredClasses"
                            :key="item.id"
                        >
                            <td>{{ index + 1 }}</td>

                            <td>
                                <div class="class-info">
                                    <div class="class-avatar">🏫</div>
                                    <div>
                                        <strong>{{ item.name }}</strong>
                                        <small>ID: {{ item.id }}</small>
                                    </div>
                                </div>
                            </td>

                            <td>{{ item.description || "-" }}</td>

                            <td>
                                <span class="code">
                                    {{ item.code || `CLS${String(item.id).padStart(3, "0")}` }}
                                </span>
                            </td>

                            <td>
                                <span class="student-count">
                                    👥 {{ item.student_count || 0 }}
                                </span>
                            </td>

                            <td>
                                <span class="status">● សកម្ម</span>
                            </td>

                            <td>
                                <div class="actions">
                                    <button
                                        class="view"
                                        title="មើលព័ត៌មានលម្អិត"
                                        aria-label="មើលព័ត៌មានលម្អិត"
                                        @click="openViewModal(item)"
                                    >
                                        👁
                                    </button>
                                    <button
                                        class="edit"
                                        title="Edit"
                                        @click="openEditModal(item)"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        class="delete"
                                        title="Delete"
                                        @click="openDeleteModal(item)"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Empty -->
                        <tr v-if="filteredClasses.length === 0">
                            <td colspan="7" class="empty">
                                មិនមានទិន្នន័យថ្នាក់ទេ
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                <button
                    type="button"
                    class="btn-cancel"
                    @click="isViewModalOpen = false"
                >
                    បិទ
                </button>
            </template>
        </BaseModal>

        <!-- Create Class Modal -->
        <BaseModal
            :is-open="isCreateModalOpen"
            title="បន្ថែមថ្នាក់"
            @close="isCreateModalOpen = false"
        >
            <form @submit.prevent="handleCreateClass" class="modal-form">
                <div class="form-group">
                    <label>ឈ្មោះថ្នាក់</label>
                    <input
                        v-model="createForm.name"
                        type="text"
                        placeholder="ឧ. Year 4 - CS"
                        required
                    />
                </div>

                <div class="form-group">
                    <label>ការពិពណ៌នា</label>
                    <input
                        v-model="createForm.description"
                        type="text"
                        placeholder="ឧ. ថ្នាក់ទី១១ ក្រុម A"
                    />
                </div>
            </form>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <template #footer>
                <button
                    type="button"
                    class="btn-cancel"
                    @click="isCreateModalOpen = false"
                >
                    បោះបង់
                </button>
                <button
                    type="button"
                    class="btn-save"
                    :disabled="classStore.loading"
                    @click="handleCreateClass"
                >
                    {{ classStore.loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក" }}
                </button>
            </template>
        </BaseModal>

        <!-- Update Class Modal -->
        <BaseModal
            :is-open="isUpdateModalOpen"
            title="កែប្រែថ្នាក់"
            @close="isUpdateModalOpen = false"
        >
            <form @submit.prevent="handleUpdateClass" class="modal-form">
                <div class="form-group">
                    <label>ឈ្មោះថ្នាក់</label>
                    <input
                        v-model="updateForm.name"
                        type="text"
                        required
                    />
                </div>

                <div class="form-group">
                    <label>ការពិពណ៌នា</label>
                    <input
                        v-model="updateForm.description"
                        type="text"
                        placeholder="ឧ. ថ្នាក់ទី១១ ក្រុម A"
                    />
                </div>
            </form>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <template #footer>
                <button
                    type="button"
                    class="btn-cancel"
                    @click="isUpdateModalOpen = false"
                >
                    បោះបង់
                </button>
                <button
                    type="button"
                    class="btn-save"
                    :disabled="classStore.loading"
                    @click="handleUpdateClass"
                >
                    {{ classStore.loading ? "កំពុងកែប្រែ..." : "បច្ចុប្បន្នភាព" }}
                </button>
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
                <button
                    type="button"
                    class="btn-cancel"
                    @click="isDeleteModalOpen = false"
                >
                    បោះបង់
                </button>
                <button
                    type="button"
                    class="btn-delete"
                    :disabled="classStore.loading"
                    @click="handleDeleteClass"
                >
                    {{ classStore.loading ? "កំពុងលុប..." : "លុប" }}
                </button>
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

/* ================= ADD BUTTON ================= */
.add-btn {
    border: 0;
    background: #149b50;
    color: white;
    padding: 14px 24px;
    border-radius: 14px;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(20, 155, 80, 0.2);
    transition: 0.2s;
}

.add-btn:hover {
    background: #108c48;
    transform: translateY(-1px);
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

.table-search span {
    font-size: 28px;
}

.table-search input {
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

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 850px;
}

thead {
    background: #f1f8f4;
}

th {
    padding: 18px 22px;
    text-align: left;
    color: #50665a;
    font-size: 14px;
    font-weight: 700;
}

td {
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
    gap: 7px;
}

.actions button {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 9px;
    cursor: pointer;
    background: #f2f6f4;
    transition: 0.2s;
}

.actions .view:hover {
    background: #e3f3fc;
}

.actions .edit:hover {
    background: #fff5dc;
}

.actions .delete:hover {
    background: #ffe8e8;
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

.btn-cancel {
    background: #f2f6f4;
    border: 0;
    color: #607168;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
}

.btn-cancel:hover {
    background: #e5ece8;
}

.btn-save {
    background: #149b50;
    border: 0;
    color: white;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
}

.btn-save:hover {
    background: #108c48;
}

.btn-delete {
    background: #e53935;
    border: 0;
    color: white;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
}

.btn-delete:hover {
    background: #d32f2f;
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