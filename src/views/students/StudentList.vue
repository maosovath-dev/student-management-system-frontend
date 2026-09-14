<script setup>
import { ref, computed, onMounted } from "vue";
import { api } from "../../api/api";

const students = ref([]);
const loading = ref(false);
const error = ref("");
const search = ref("");

/* =========================
   Get Students
========================= */

const getAllStudents = async () => {
    try {
        loading.value = true;
        error.value = "";

        const token = localStorage.getItem("token");

        const response = await api.get("/students", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Student API Response:", response.data);

        if (response.data.success) {
            students.value = response.data.data || [];
        } else {
            error.value =
                response.data.message ||
                response.data.msg ||
                "មិនអាចទាញយកទិន្នន័យសិស្សបានទេ";
        }
    } catch (err) {
        console.error("Get Students Error:", err);

        error.value =
            err.response?.data?.message ||
            err.response?.data?.msg ||
            "មិនអាចភ្ជាប់ទៅ Server បានទេ";
    } finally {
        loading.value = false;
    }
};


/* =========================
   Search
========================= */

const filteredStudents = computed(() => {
    const keyword = search.value.trim().toLowerCase();

    if (!keyword) {
        return students.value;
    }

    return students.value.filter((student) => {
        const fullName =
            `${student.first_name || ""} ${student.last_name || ""}`
                .toLowerCase();

        return (
            fullName.includes(keyword) ||
            String(student.student_code || "")
                .toLowerCase()
                .includes(keyword) ||
            String(student.phone || "")
                .toLowerCase()
                .includes(keyword) ||
            String(student.class_name || "")
                .toLowerCase()
                .includes(keyword)
        );
    });
});


/* =========================
   Total
========================= */

const totalStudents = computed(() => {
    return students.value.length;
});


/* =========================
   Date
========================= */

const formatDate = (date) => {
    if (!date) return "-";

    return String(date).split("T")[0];
};


/* =========================
   Gender
========================= */

const genderText = (gender) => {
    if (gender === "male") return "ប្រុស";
    if (gender === "female") return "ស្រី";
    if (gender === "other") return "ផ្សេងៗ";

    return "-";
};


/* =========================
   Initial
========================= */

const getInitial = (student) => {
    return (
        student.first_name?.charAt(0)?.toUpperCase() ||
        student.last_name?.charAt(0)?.toUpperCase() ||
        "S"
    );
};


/* =========================
   Refresh
========================= */

const refreshStudents = () => {
    getAllStudents();
};


onMounted(() => {
    getAllStudents();
});
</script>


<template>
    <div class="student-page">

        <!-- =================================
             Page Header
        ================================== -->

        <div class="page-header">

            <div class="page-title">

                <div class="title-icon">
                    <i class="bi bi-people-fill"></i>
                </div>

                <div>
                    <h1>សិស្ស</h1>

                    <p>
                        គ្រប់គ្រង និងមើលព័ត៌មានសិស្សទាំងអស់
                    </p>
                </div>

            </div>


            <button
                class="refresh-btn"
                @click="refreshStudents"
                :disabled="loading"
            >
                <i
                    class="bi bi-arrow-clockwise"
                    :class="{ spinning: loading }"
                ></i>

                <span>ធ្វើបច្ចុប្បន្នភាព</span>
            </button>

        </div>


        <!-- =================================
             Statistics
        ================================== -->

        <div class="stats-section">

            <div class="student-stat-card">

                <div class="stat-icon">
                    <i class="bi bi-person-vcard-fill"></i>
                </div>

                <div class="stat-content">

                    <span>
                        សិស្សសរុប
                    </span>

                    <strong>
                        {{ totalStudents }}
                    </strong>

                    <small>
                        សិស្សដែលមានក្នុងប្រព័ន្ធ
                    </small>

                </div>

            </div>

        </div>


        <!-- =================================
             Student Table Card
        ================================== -->

        <div class="student-card">

            <!-- Card Header -->

            <div class="student-card-header">

                <div>

                    <h2>
                        បញ្ជីសិស្ស
                    </h2>

                    <p>
                        រកឃើញ
                        <strong>{{ filteredStudents.length }}</strong>
                        នាក់
                    </p>

                </div>


                <!-- Search -->

                <div class="search-box">

                    <i class="bi bi-search"></i>

                    <input
                        v-model="search"
                        type="text"
                        placeholder="ស្វែងរកសិស្ស..."
                    />

                    <button
                        v-if="search"
                        class="clear-search"
                        @click="search = ''"
                    >
                        <i class="bi bi-x"></i>
                    </button>

                </div>

            </div>


            <!-- =================================
                 Loading
            ================================== -->

            <div
                v-if="loading"
                class="loading-state"
            >
                <div class="loader"></div>

                <p>
                    កំពុងទាញយកទិន្នន័យ...
                </p>
            </div>


            <!-- =================================
                 Error
            ================================== -->

            <div
                v-else-if="error"
                class="error-state"
            >
                <div class="error-icon">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                </div>

                <h3>
                    មានបញ្ហា
                </h3>

                <p>
                    {{ error }}
                </p>

                <button
                    @click="getAllStudents"
                    class="retry-btn"
                >
                    <i class="bi bi-arrow-clockwise"></i>
                    ព្យាយាមម្ដងទៀត
                </button>
            </div>


            <!-- =================================
                 Table
            ================================== -->

            <div
                v-else-if="filteredStudents.length"
                class="table-container"
            >

                <table>

                    <thead>

                        <tr>

                            <th class="number-column">
                                #
                            </th>

                            <th>
                                សិស្ស
                            </th>

                            <th>
                                លេខសម្គាល់សិស្ស
                            </th>

                            <th>
                                ភេទ
                            </th>

                            <th>
                                ថ្ងៃខែឆ្នាំកំណើត
                            </th>

                            <th>
                                លេខទូរស័ព្ទ
                            </th>

                            <th>
                                ថ្នាក់
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr
                            v-for="(student, index) in filteredStudents"
                            :key="student.id"
                        >

                            <!-- Number -->

                            <td class="number-cell">
                                {{ index + 1 }}
                            </td>


                            <!-- Student -->

                            <td>

                                <div class="student-info">

                                    <div class="student-avatar">
                                        {{ getInitial(student) }}
                                    </div>

                                    <div>

                                        <strong>
                                            {{ student.first_name }}
                                            {{ student.last_name }}
                                        </strong>

                                        <span>
                                            ID: {{ student.id }}
                                        </span>

                                    </div>

                                </div>

                            </td>


                            <!-- Student Code -->

                            <td>

                                <span class="student-code">
                                    {{ student.student_code }}
                                </span>

                            </td>


                            <!-- Gender -->

                            <td>

                                <span
                                    class="gender-badge"
                                    :class="student.gender"
                                >

                                    <i
                                        :class="
                                            student.gender === 'male'
                                                ? 'bi bi-gender-male'
                                                : 'bi bi-gender-female'
                                        "
                                    ></i>

                                    {{ genderText(student.gender) }}

                                </span>

                            </td>


                            <!-- DOB -->

                            <td>

                                <div class="date-cell">

                                    <i class="bi bi-calendar3"></i>

                                    <span>
                                        {{ formatDate(student.date_of_birth) }}
                                    </span>

                                </div>

                            </td>


                            <!-- Phone -->

                            <td>

                                <div class="phone-cell">

                                    <i class="bi bi-telephone"></i>

                                    <span>
                                        {{ student.phone || "-" }}
                                    </span>

                                </div>

                            </td>


                            <!-- Class -->

                            <td>

                                <span class="class-badge">

                                    <i class="bi bi-mortarboard-fill"></i>

                                    {{ student.class_name || "-" }}

                                </span>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- =================================
                 Empty
            ================================== -->

            <div
                v-else
                class="empty-state"
            >

                <div class="empty-icon">
                    <i class="bi bi-people"></i>
                </div>

                <h3>
                    មិនមានសិស្សទេ
                </h3>

                <p v-if="search">
                    មិនរកឃើញសិស្សដែលត្រូវនឹង
                    "{{ search }}"
                </p>

                <p v-else>
                    មិនទាន់មានទិន្នន័យសិស្សនៅឡើយទេ
                </p>

            </div>

        </div>

    </div>
</template>


<style scoped>

/* =========================================
   Page
========================================= */

.student-page {
    width: 100%;
    min-height: calc(100vh - 70px);

    padding: 32px;

    background: #f5f9f7;
}


/* =========================================
   Header
========================================= */

.page-header {
    display: flex;

    align-items: center;

    justify-content: space-between;

    margin-bottom: 25px;
}

.page-title {
    display: flex;

    align-items: center;

    gap: 16px;
}

.title-icon {
    width: 62px;
    height: 62px;

    border-radius: 17px;

    display: flex;

    align-items: center;
    justify-content: center;

    background: #e2f6eb;

    color: #15945a;

    font-size: 28px;
}

.page-title h1 {
    margin: 0;

    color: #172b23;

    font-size: 28px;

    font-weight: 800;
}

.page-title p {
    margin: 5px 0 0;

    color: #7b8982;

    font-size: 13px;
}


.refresh-btn {
    height: 46px;

    padding: 0 20px;

    display: flex;

    align-items: center;

    gap: 8px;

    border: none;

    border-radius: 11px;

    background: #168c54;

    color: white;

    font-size: 13px;

    font-weight: 700;

    cursor: pointer;

    box-shadow: 0 5px 15px rgba(22, 140, 84, 0.18);

    transition: 0.2s;
}

.refresh-btn:hover {
    background: #117b49;
}

.refresh-btn:disabled {
    opacity: 0.7;

    cursor: not-allowed;
}

.spinning {
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}


/* =========================================
   Statistics
========================================= */

.stats-section {
    margin-bottom: 28px;
}

.student-stat-card {
    width: 275px;

    min-height: 110px;

    background: white;

    border: 1px solid #e4eee8;

    border-radius: 17px;

    padding: 18px 20px;

    display: flex;

    align-items: center;

    gap: 16px;

    box-shadow: 0 5px 20px rgba(25, 70, 45, 0.04);
}

.stat-icon {
    width: 56px;
    height: 56px;

    border-radius: 15px;

    display: flex;

    align-items: center;
    justify-content: center;

    background: #e3f6eb;

    color: #168c54;

    font-size: 25px;
}

.stat-content span {
    display: block;

    color: #77857e;

    font-size: 12px;

    font-weight: 600;
}

.stat-content strong {
    display: block;

    margin: 2px 0;

    color: #14251d;

    font-size: 28px;

    line-height: 1.2;
}

.stat-content small {
    color: #168c54;

    font-size: 9px;
}


/* =========================================
   Student Card
========================================= */

.student-card {
    width: 100%;

    background: white;

    border: 1px solid #e3ece7;

    border-radius: 19px;

    overflow: hidden;

    box-shadow: 0 7px 25px rgba(25, 70, 45, 0.05);
}


/* =========================================
   Card Header
========================================= */

.student-card-header {
    min-height: 105px;

    padding: 22px 27px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    border-bottom: 1px solid #e9efec;
}

.student-card-header h2 {
    margin: 0;

    color: #17251f;

    font-size: 20px;

    font-weight: 800;
}

.student-card-header p {
    margin: 4px 0 0;

    color: #8a9790;

    font-size: 11px;
}

.student-card-header p strong {
    color: #168c54;
}


/* =========================================
   Search
========================================= */

.search-box {
    width: 330px;
    height: 48px;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 0 15px;

    border: 1px solid #dfe9e4;

    border-radius: 11px;

    background: white;

    transition: 0.2s;
}

.search-box:focus-within {
    border-color: #35a66f;

    box-shadow: 0 0 0 3px rgba(
        53,
        166,
        111,
        0.08
    );
}

.search-box > i {
    color: #87948e;

    font-size: 18px;
}

.search-box input {
    flex: 1;

    width: 100%;

    border: none;

    outline: none;

    color: #27362f;

    background: transparent;

    font-size: 12px;
}

.search-box input::placeholder {
    color: #a0aaa5;
}

.clear-search {
    border: none;

    background: transparent;

    color: #9aa59f;

    cursor: pointer;

    font-size: 17px;
}


/* =========================================
   Table
========================================= */

.table-container {
    width: 100%;

    overflow-x: auto;
}

table {
    width: 100%;

    min-width: 1050px;

    border-collapse: collapse;
}

thead {
    background: #f3f9f6;
}

th {
    height: 55px;

    padding: 0 18px;

    text-align: left;

    color: #587066;

    font-size: 11px;

    font-weight: 800;

    white-space: nowrap;
}

td {
    height: 75px;

    padding: 0 18px;

    border-top: 1px solid #edf2ef;

    color: #67766e;

    font-size: 11px;

    white-space: nowrap;
}

tbody tr {
    transition: 0.15s;
}

tbody tr:hover {
    background: #fafffc;
}

.number-column {
    width: 55px;
}

.number-cell {
    color: #68766f;

    font-weight: 500;
}


/* =========================================
   Student Info
========================================= */

.student-info {
    display: flex;

    align-items: center;

    gap: 12px;
}

.student-avatar {
    width: 46px;
    height: 46px;

    border-radius: 50%;

    display: flex;

    align-items: center;
    justify-content: center;

    background: #e1f4e9;

    color: #168c54;

    font-size: 16px;

    font-weight: 800;
}

.student-info strong {
    display: block;

    color: #182a21;

    font-size: 12px;

    font-weight: 700;
}

.student-info span {
    display: block;

    margin-top: 4px;

    color: #98a39e;

    font-size: 9px;
}


/* =========================================
   Student Code
========================================= */

.student-code {
    display: inline-block;

    padding: 8px 11px;

    border-radius: 8px;

    background: #edf7f1;

    color: #168c54;

    font-size: 10px;

    font-weight: 800;
}


/* =========================================
   Gender
========================================= */

.gender-badge {
    display: inline-flex;

    align-items: center;

    gap: 6px;

    padding: 8px 11px;

    border-radius: 20px;

    font-size: 10px;

    font-weight: 600;
}

.gender-badge.male {
    background: #eaf2ff;

    color: #3676d0;
}

.gender-badge.female {
    background: #fff0f6;

    color: #d64b8b;
}

.gender-badge.other {
    background: #f1f1f1;

    color: #666;
}


/* =========================================
   Date
========================================= */

.date-cell {
    display: flex;

    align-items: center;

    gap: 8px;
}

.date-cell i {
    color: #15945a;

    font-size: 15px;
}


/* =========================================
   Phone
========================================= */

.phone-cell {
    display: flex;

    align-items: center;

    gap: 8px;
}

.phone-cell i {
    color: #15945a;

    font-size: 15px;
}


/* =========================================
   Class
========================================= */

.class-badge {
    display: inline-flex;

    align-items: center;

    gap: 6px;

    padding: 8px 11px;

    border-radius: 8px;

    background: #edf8f2;

    color: #168c54;

    font-size: 10px;

    font-weight: 700;
}

.class-badge i {
    font-size: 12px;
}


/* =========================================
   Loading
========================================= */

.loading-state {
    min-height: 300px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    color: #7c8983;
}

.loader {
    width: 38px;
    height: 38px;

    border: 3px solid #dcece3;

    border-top-color: #168c54;

    border-radius: 50%;

    animation: spin 0.8s linear infinite;

    margin-bottom: 15px;
}

.loading-state p {
    font-size: 12px;
}


/* =========================================
   Error
========================================= */

.error-state {
    min-height: 300px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;
}

.error-icon {
    width: 55px;
    height: 55px;

    border-radius: 50%;

    display: flex;

    align-items: center;
    justify-content: center;

    background: #fff0f1;

    color: #e45262;

    font-size: 23px;

    margin-bottom: 12px;
}

.error-state h3 {
    margin: 0;

    color: #28372f;

    font-size: 16px;
}

.error-state p {
    margin: 5px 0 15px;

    color: #8a9690;

    font-size: 11px;
}

.retry-btn {
    border: none;

    border-radius: 8px;

    padding: 9px 15px;

    background: #168c54;

    color: white;

    cursor: pointer;

    font-size: 11px;

    font-weight: 600;
}


/* =========================================
   Empty
========================================= */

.empty-state {
    min-height: 300px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    text-align: center;
}

.empty-icon {
    width: 65px;
    height: 65px;

    border-radius: 50%;

    display: flex;

    align-items: center;
    justify-content: center;

    background: #e8f5ee;

    color: #168c54;

    font-size: 28px;

    margin-bottom: 12px;
}

.empty-state h3 {
    margin: 0;

    color: #27362f;

    font-size: 16px;
}

.empty-state p {
    margin-top: 5px;

    color: #89958f;

    font-size: 11px;
}


/* =========================================
   Responsive
========================================= */

@media (max-width: 1000px) {

    .student-page {
        padding: 20px;
    }

    .page-header {
        align-items: flex-start;

        gap: 15px;
    }

    .search-box {
        width: 260px;
    }
}


@media (max-width: 700px) {

    .student-page {
        padding: 15px;
    }

    .page-header {
        flex-direction: column;
    }

    .refresh-btn {
        width: 100%;

        justify-content: center;
    }

    .student-card-header {
        flex-direction: column;

        align-items: stretch;

        gap: 15px;
    }

    .search-box {
        width: 100%;
    }

    .student-stat-card {
        width: 100%;
    }
}

</style>