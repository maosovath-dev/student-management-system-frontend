<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "@/api/api";

const dashboardData = ref(null);
const dashboardLoading = ref(true);
const dashboardError = ref("");

const user = computed(() => {

    try {

        return JSON.parse(
            localStorage.getItem("user")
        ) || {};

    } catch {

        return {};

    }

});


const userName = computed(() => {
    return user.value.name
        || "អ្នកប្រើប្រាស់";
});

const fetchDashboard = async () => {
    dashboardLoading.value = true;
    dashboardError.value = "";
    try {
        const response = await api.get("/dashboard");
        dashboardData.value = response.data?.data;
        if (!dashboardData.value?.stats) {
            throw new Error("ទិន្នន័យ Dashboard មិនត្រឹមត្រូវទេ។");
        }
    } catch (error) {
        dashboardError.value =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            error.message ||
            "មិនអាចទាញយកទិន្នន័យ Dashboard បានទេ។";
    } finally {
        dashboardLoading.value = false;
    }
};

const todayLabel = computed(() => {
    const today = new Date();
    return formatDate([
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-"));
});

const formatDate = (value) => {
    if (!value) return "—";
    const dateText = String(value).slice(0, 10);
    const [year, month, day] = dateText.split("-").map(Number);
    if (!year || !month || !day) return dateText;
    return new Intl.DateTimeFormat("km-KH", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(year, month - 1, day));
};

const classAttendanceRate = (item) => `${Number(item.attendanceRate || 0).toFixed(1)}%`;
const statusBarWidth = (count) => {
    const total = Number(dashboardData.value?.todayAttendance?.total || 0);
    return `${total ? (Number(count) / total) * 100 : 0}%`;
};

const statusLabel = (status) => ({
    present: "មានវត្តមាន",
    absent: "អវត្តមាន",
    late: "មកយឺត",
}[status] || "មិនស្គាល់");

onMounted(fetchDashboard);
</script>


<template>

    <div class="dashboard">

        <!-- =================================
             Welcome Banner
        ================================== -->

        <section class="welcome-card">

            <div class="welcome-content">

                <span class="hello">
                    សួស្តី 👋
                </span>

                <h1>

                    សូមស្វាគមន៍,
                    <strong>
                        {{ userName }}!
                    </strong>

                </h1>

                <p>
                    សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ
                    គ្រប់គ្រងសិស្ស
                    និងព័ត៌មានសិក្សា។
                </p>


                <div class="admin-status">

                    <i class="bi bi-shield-check"></i>

                    ប្រព័ន្ធកំពុងដំណើរការ

                </div>

            </div>


            <div class="welcome-image">

                <i class="bi bi-mortarboard-fill"></i>

                <div class="book book-blue"></div>
                <div class="book book-yellow"></div>
                <div class="book book-green"></div>

            </div>

        </section>

        <div v-if="dashboardError" class="dashboard-error" role="alert">
            <span>{{ dashboardError }}</span>
            <button type="button" @click="fetchDashboard">ព្យាយាមម្ដងទៀត</button>
        </div>

        <!-- =================================
             Statistics
        ================================== -->

        <section class="stats-grid">


            <div class="stat-card">

                <div class="stat-icon blue">
                    <i class="bi bi-people-fill"></i>
                </div>

                <div>
                    <span>សិស្សសរុប</span>

                    <strong>{{ dashboardLoading ? "…" : dashboardData?.stats?.totalStudents ?? "—" }}</strong>

                    <small>
                        សិស្សក្នុងប្រព័ន្ធ
                    </small>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon green">
                    <i class="bi bi-person-badge-fill"></i>
                </div>

                <div>
                    <span>គ្រូបង្រៀន</span>

                    <strong>{{ dashboardLoading ? "…" : dashboardData?.stats?.totalTeachers ?? "—" }}</strong>

                    <small>
                        គ្រូបង្រៀនសរុប
                    </small>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon blue">
                    <i class="bi bi-building"></i>
                </div>

                <div>
                    <span>ថ្នាក់សិក្សា</span>

                    <strong>{{ dashboardLoading ? "…" : dashboardData?.stats?.totalClasses ?? "—" }}</strong>

                    <small>
                        ថ្នាក់សរុប
                    </small>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon purple">
                    <i class="bi bi-book-fill"></i>
                </div>

                <div>
                    <span>មុខវិជ្ជា</span>

                    <strong>{{ dashboardLoading ? "…" : dashboardData?.stats?.totalSubjects ?? "—" }}</strong>

                    <small>
                        មុខវិជ្ជាសរុប
                    </small>
                </div>

            </div>


        </section>


        <section class="today-attendance-card dashboard-card">
            <div class="card-header">
                <div>
                    <h2>វត្តមានថ្ងៃនេះ</h2>
                    <p>{{ todayLabel }} · សរុប {{ dashboardLoading ? "…" : dashboardData?.todayAttendance?.total ?? 0 }} កំណត់ត្រា</p>
                </div>
                <a href="/attendance">មើលប្រវត្តិវត្តមាន →</a>
            </div>
            <div class="today-attendance-grid">
                <div class="today-attendance-stat present-stat">
                    <span>មានវត្តមាន</span>
                    <strong>{{ dashboardLoading ? "…" : dashboardData?.todayAttendance?.present ?? 0 }}</strong>
                </div>
                <div class="today-attendance-stat absent-stat">
                    <span>អវត្តមាន</span>
                    <strong>{{ dashboardLoading ? "…" : dashboardData?.todayAttendance?.absent ?? 0 }}</strong>
                </div>
                <div class="today-attendance-stat late-stat">
                    <span>មកយឺត</span>
                    <strong>{{ dashboardLoading ? "…" : dashboardData?.todayAttendance?.late ?? 0 }}</strong>
                </div>
                <div class="today-attendance-stat rate-stat">
                    <span>អត្រាមានវត្តមាន</span>
                    <strong>{{ dashboardLoading ? "…" : `${dashboardData?.todayAttendance?.attendanceRate ?? 0}%` }}</strong>
                </div>
            </div>
        </section>

        <section class="dashboard-grid attendance-overview-grid">
            <div class="dashboard-card overview-card">
                <div class="card-header">
                    <div>
                        <h2>វត្តមានតាមថ្នាក់</h2>
                        <p>អត្រាសិស្សមានវត្តមានក្នុងថ្ងៃនេះ</p>
                    </div>
                </div>
                <div class="chart-list">
                    <div v-if="dashboardLoading" class="dashboard-table-state">កំពុងទាញយកទិន្នន័យ...</div>
                    <div v-else-if="dashboardData?.attendanceByClass?.length === 0" class="dashboard-table-state">
                        មិនទាន់មានទិន្នន័យវត្តមានថ្ងៃនេះទេ
                    </div>
                    <div
                        v-for="item in dashboardData?.attendanceByClass || []"
                        :key="item.classId"
                        class="class-attendance-row"
                    >
                        <div class="class-attendance-label">
                            <strong>{{ item.className }}</strong>
                            <span>{{ classAttendanceRate(item) }}</span>
                        </div>
                        <div
                            class="chart-track"
                            role="progressbar"
                            :aria-label="`អត្រាមានវត្តមាន ${item.className}`"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            :aria-valuenow="item.attendanceRate"
                        >
                            <div class="chart-bar class-chart-bar" :style="{ width: `${item.attendanceRate}%` }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-card overview-card">
                <div class="card-header">
                    <div>
                        <h2>ស្ថានភាពវត្តមាន</h2>
                        <p>ចំនួនកំណត់ត្រាតាមស្ថានភាពថ្ងៃនេះ</p>
                    </div>
                </div>
                <div class="chart-list status-chart-list">
                    <div
                        v-for="status in [
                            { key: 'present', label: 'មានវត្តមាន', className: 'present-chart-bar', count: dashboardData?.todayAttendance?.present ?? 0 },
                            { key: 'absent', label: 'អវត្តមាន', className: 'absent-chart-bar', count: dashboardData?.todayAttendance?.absent ?? 0 },
                            { key: 'late', label: 'មកយឺត', className: 'late-chart-bar', count: dashboardData?.todayAttendance?.late ?? 0 },
                        ]"
                        :key="status.key"
                        class="status-chart-row"
                    >
                        <div class="class-attendance-label">
                            <strong>{{ status.label }}</strong>
                            <span>{{ dashboardLoading ? "…" : status.count }}</span>
                        </div>
                        <div
                            class="chart-track"
                            role="progressbar"
                            :aria-label="status.label"
                            aria-valuemin="0"
                            :aria-valuemax="dashboardData?.todayAttendance?.total || 0"
                            :aria-valuenow="status.count"
                        >
                            <div
                                :class="['chart-bar', status.className]"
                                :style="{ width: statusBarWidth(status.count) }"
                            ></div>
                        </div>
                    </div>
                    <p v-if="!dashboardLoading && !dashboardData?.todayAttendance?.total" class="chart-empty">
                        មិនទាន់មានកំណត់ត្រាវត្តមានថ្ងៃនេះទេ
                    </p>
                </div>
            </div>
        </section>

        <section class="dashboard-card recent-attendance-card">
            <div class="card-header">
                <div>
                    <h2>វត្តមានថ្មីៗ</h2>
                    <p>កំណត់ត្រាវត្តមានថ្ងៃនេះ</p>
                </div>
                <a href="/attendance">មើលទាំងអស់ →</a>
            </div>
            <div class="table-wrapper recent-attendance-table">
                <table>
                    <thead>
                        <tr>
                            <th>សិស្ស</th>
                            <th>ថ្នាក់</th>
                            <th>កាលបរិច្ឆេទ</th>
                            <th>ស្ថានភាព</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="dashboardLoading">
                            <td colspan="4" class="dashboard-table-state">កំពុងទាញយកវត្តមាន...</td>
                        </tr>
                        <tr v-else-if="dashboardData?.recentAttendance?.length === 0">
                            <td colspan="4" class="dashboard-table-state">មិនទាន់មានកំណត់ត្រាវត្តមានថ្ងៃនេះទេ</td>
                        </tr>
                        <tr v-for="record in dashboardData?.recentAttendance || []" :key="record.id">
                            <td>
                                <div class="recent-student-cell">
                                    <div class="attendance-avatar">
                                        <img
                                            v-if="record.avatar_url"
                                            :src="record.avatar_url"
                                            :alt="`រូប Profile របស់ ${record.first_name} ${record.last_name}`"
                                        />
                                        <i v-else class="bi bi-person-fill" aria-hidden="true"></i>
                                    </div>
                                    <div>
                                        <strong>{{ record.first_name }} {{ record.last_name }}</strong>
                                        <small>{{ record.student_code }}</small>
                                    </div>
                                </div>
                            </td>
                            <td>{{ record.class_name || "—" }}</td>
                            <td>{{ formatDate(record.date) }}</td>
                            <td>
                                <span :class="['attendance-status', `attendance-${record.status}`]">
                                    {{ statusLabel(record.status) }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>

</template>


<style scoped>

.dashboard {

    width: 100%;

    min-height: calc(100vh - 70px);

    padding: 30px;

    background: #f5f9f7;

}


/* ========================================
   WELCOME
======================================== */

.welcome-card {

    min-height: 220px;

    padding: 30px 40px;

    border-radius: 20px;

    background:
        linear-gradient(
            110deg,
            #e9f7f0,
            #e9f2ff
        );

    border: 1px solid #dcece3;

    display: flex;

    align-items: center;

    justify-content: space-between;

    overflow: hidden;

}


.hello {

    color: #557267;

    font-size: 14px;

}


.welcome-content h1 {

    margin-top: 7px;

    color: #1a2c24;

    font-size: 31px;

    font-weight: 500;

}


.welcome-content h1 strong {

    color: #168c54;

    font-weight: 800;

}


.welcome-content p {

    margin-top: 8px;

    color: #73857c;

    font-size: 12px;

}

.dashboard-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-top: 16px;
    padding: 12px 16px;
    border: 1px solid #f1c9c9;
    border-radius: 10px;
    background: #fff7f7;
    color: #a93535;
    font-size: 13px;
}

.dashboard-error button {
    flex: 0 0 auto;
    padding: 7px 10px;
    border: 1px solid #e7baba;
    border-radius: 7px;
    background: #fff;
    color: #a93535;
    cursor: pointer;
    font: inherit;
}


.admin-status {

    display: inline-flex;

    align-items: center;

    gap: 7px;

    margin-top: 16px;

    padding: 8px 14px;

    border-radius: 20px;

    background: #d8f1e3;

    color: #16834b;

    font-size: 10px;

    font-weight: 600;

}


.welcome-image {

    position: relative;

    width: 240px;

    height: 180px;

    display: flex;

    align-items: center;

    justify-content: center;

}


.welcome-image > i {

    position: relative;

    z-index: 3;

    color: #2781d7;

    font-size: 90px;

}


.book {

    position: absolute;

    width: 80px;

    height: 22px;

    border-radius: 4px;

    transform: skewY(-8deg);

}


.book-blue {

    right: 15px;

    bottom: 40px;

    background: #287bd0;

}


.book-yellow {

    right: 50px;

    bottom: 62px;

    background: #e9ad27;

}


.book-green {

    right: 82px;

    bottom: 84px;

    background: #18874e;

}


/* ========================================
   STATS
======================================== */

.stats-grid {

    display: grid;

    grid-template-columns: repeat(4, minmax(0, 1fr));

    gap: 18px;

    margin-top: 24px;

}


.stat-card {

    min-height: 120px;

    padding: 18px;

    border-radius: 17px;

    background: white;

    border: 1px solid #e4eee8;

    display: flex;

    align-items: center;

    gap: 14px;

    box-shadow:
        0 5px 18px
        rgba(30, 70, 50, 0.04);

}


.stat-icon {

    width: 56px;

    height: 56px;

    flex-shrink: 0;

    border-radius: 15px;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 23px;

}


.stat-icon.blue {

    background: #e7f1ff;

    color: #287bd0;

}


.stat-icon.green {

    background: #e3f6eb;

    color: #169253;

}


.stat-icon.purple {

    background: #f1e7ff;

    color: #8050c7;

}


.stat-icon.orange {

    background: #fff2da;

    color: #e69718;

}


.stat-icon.red {

    background: #ffe9ed;

    color: #e84c61;

}


.stat-card span {

    display: block;

    color: #78867f;

    font-size: 10px;

}


.stat-card strong {

    display: block;

    margin-top: 2px;

    color: #17251f;

    font-size: 26px;

    line-height: 1.2;

}


.stat-card small {

    display: block;

    margin-top: 4px;

    color: #168c54;

    font-size: 8px;

}


/* ========================================
   DASHBOARD GRID
======================================== */

.dashboard-grid {

    display: grid;

    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 20px;

    margin-top: 24px;

}

.today-attendance-card {
    margin-top: 24px;
}

.today-attendance-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: 16px 20px;
}

.today-attendance-stat {
    display: grid;
    gap: 8px;
    padding: 6px 18px;
    border-right: 1px solid #edf2ef;
}

.today-attendance-stat:first-child {
    padding-left: 4px;
}

.today-attendance-stat:last-child {
    border-right: 0;
}

.today-attendance-stat span {
    color: #78867f;
    font-size: 12px;
}

.today-attendance-stat strong {
    color: #17251f;
    font-size: 28px;
    line-height: 1.1;
}

.present-stat strong,
.rate-stat strong {
    color: #168c54;
}

.absent-stat strong {
    color: #dc4758;
}

.late-stat strong {
    color: #d38b17;
}

.attendance-overview-grid {
    margin-top: 20px;
}

.overview-card {
    min-height: 250px;
}

.chart-list {
    display: grid;
    gap: 18px;
    padding: 20px 22px;
}

.class-attendance-row,
.status-chart-row {
    display: grid;
    gap: 9px;
}

.class-attendance-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: #52625a;
    font-size: 12px;
}

.class-attendance-label strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.class-attendance-label span {
    flex: 0 0 auto;
    color: #27372f;
    font-weight: 700;
}

.chart-track {
    width: 100%;
    height: 10px;
    overflow: hidden;
    border-radius: 99px;
    background: #edf2ef;
}

.chart-bar {
    height: 100%;
    min-width: 0;
    border-radius: inherit;
    transition: width 0.35s ease;
}

.class-chart-bar,
.present-chart-bar {
    background: linear-gradient(90deg, #32a765, #16834b);
}

.absent-chart-bar {
    background: #e35a65;
}

.late-chart-bar {
    background: #e7a331;
}

.chart-empty {
    margin: 2px 0 0;
    color: #89968f;
    font-size: 12px;
    text-align: center;
}

.recent-attendance-card {
    margin-top: 20px;
}

.recent-attendance-table table {
    min-width: 600px;
}

.recent-student-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 165px;
}

.recent-student-cell > div:last-child {
    display: grid;
    gap: 3px;
}

.recent-student-cell strong {
    color: #27372f;
    font-size: 12px;
}

.recent-student-cell small {
    color: #89968f;
    font-size: 10px;
}

.recent-attendance-table .attendance-status {
    display: inline-flex;
}


.dashboard-card {

    background: white;

    border: 1px solid #e4eee8;

    border-radius: 18px;

    overflow: hidden;

    box-shadow:
        0 5px 18px
        rgba(30, 70, 50, 0.04);

}


.card-header {

    min-height: 80px;

    padding: 18px 22px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    border-bottom: 1px solid #edf2ef;

}


.card-header h2 {

    margin: 0;

    color: #1b2c24;

    font-size: 17px;

}


.card-header p {

    margin-top: 3px;

    color: #8b9892;

    font-size: 9px;

}


.card-header a {

    color: #168c54;

    font-size: 9px;

    font-weight: 700;

}


/* ========================================
   TABLE
======================================== */

.table-wrapper {

    overflow-x: auto;

}


table {

    width: 100%;

    min-width: 650px;

    border-collapse: collapse;

}


th {

    height: 43px;

    padding: 0 18px;

    background: #f4f9f6;

    color: #617269;

    text-align: left;

    font-size: 9px;

}


td {

    height: 55px;

    padding: 0 18px;

    border-top: 1px solid #edf2ef;

    color: #66766e;

    font-size: 9px;

}


.grade {

    display: inline-flex;

    min-width: 32px;

    height: 27px;

    align-items: center;

    justify-content: center;

    border-radius: 8px;

    font-weight: 800;

}


.grade.a {

    background: #ddf4e5;

    color: #219052;

}


.grade.ap {

    background: #dff5e6;

    color: #168c54;

}


.grade.bp {

    background: #e7f0ff;

    color: #3978cc;

}

.grade.grade-c {
    background: #fff2da;
    color: #ba7b0e;
}

.grade.grade-d,
.grade.grade-f {
    background: #ffe9ed;
    color: #c23d50;
}

.dashboard-table-state {
    height: 90px;
    text-align: center;
    color: #89968f;
}


/* ========================================
   NOTICE
======================================== */

.notice-list {

    padding: 5px 20px;

}

.recent-attendance-list {
    max-height: 365px;
    overflow-y: auto;
}


.notice-item {

    display: flex;

    gap: 12px;

    padding: 16px 0;

    border-bottom: 1px solid #edf2ef;

}


.notice-item:last-child {

    border-bottom: none;

}


.notice-icon {

    width: 38px;

    height: 38px;

    flex-shrink: 0;

    border-radius: 10px;

    background: #e8f3ff;

    color: #287bd0;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 15px;

}

.attendance-avatar {
    display: grid;
    flex: 0 0 auto;
    width: 38px;
    height: 38px;
    overflow: hidden;
    place-items: center;
    border-radius: 50%;
    background: #e5e7eb;
    color: #707579;
    font-size: 25px;
}

.attendance-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.attendance-summary {
    min-width: 0;
    flex: 1;
}

.attendance-summary p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.attendance-status {
    align-self: flex-start;
    padding: 5px 7px;
    border-radius: 20px;
    font-size: 8px;
    font-weight: 700;
    white-space: nowrap;
}

.attendance-present {
    background: #ddf4e5;
    color: #168c54;
}

.attendance-late {
    background: #fff2da;
    color: #ba7b0e;
}

.attendance-absent {
    background: #ffe9ed;
    color: #c23d50;
}


.notice-item strong {

    display: block;

    color: #27372f;

    font-size: 10px;

}


.notice-item p {

    margin-top: 4px;

    color: #89968f;

    font-size: 8px;

    line-height: 1.6;

}


.notice-item small {

    display: block;

    margin-top: 5px;

    color: #287bd0;

    font-size: 8px;

    font-weight: 700;

}


/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 1200px) {

    .stats-grid {

        grid-template-columns:
            repeat(3, 1fr);

    }

}


@media (max-width: 900px) {

    .dashboard {

        padding: 20px;

    }

    .stats-grid {

        grid-template-columns:
            repeat(2, 1fr);

    }

    .dashboard-grid {

        grid-template-columns: 1fr;

    }

    .welcome-image {

        display: none;

    }

}


@media (max-width: 600px) {

    .dashboard {

        padding: 14px;

    }

    .stats-grid {

        grid-template-columns: 1fr;

    }

    .today-attendance-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px 0;
        padding: 14px;
    }

    .today-attendance-stat {
        padding: 4px 12px;
    }

    .today-attendance-stat:nth-child(2) {
        border-right: 0;
    }

    .today-attendance-stat:nth-child(3) {
        padding-left: 12px;
    }

    .today-attendance-stat strong {
        font-size: 24px;
    }

    .welcome-card {

        padding: 25px;

    }

    .welcome-content h1 {

        font-size: 23px;

    }

    .dashboard-error {
        align-items: flex-start;
        flex-direction: column;
    }

}

</style>