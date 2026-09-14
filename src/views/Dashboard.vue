<script setup>
import { computed } from "vue";


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

                    <strong>250</strong>

                    <small>
                        សិស្សក្នុងប្រព័ន្ធ
                    </small>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon green">
                    <i class="bi bi-building"></i>
                </div>

                <div>
                    <span>ថ្នាក់សិក្សា</span>

                    <strong>12</strong>

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

                    <strong>24</strong>

                    <small>
                        មុខវិជ្ជាសរុប
                    </small>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon orange">
                    <i class="bi bi-bar-chart-fill"></i>
                </div>

                <div>
                    <span>ពិន្ទុ</span>

                    <strong>856</strong>

                    <small>
                        លទ្ធផលសរុប
                    </small>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon red">
                    <i class="bi bi-calendar-check-fill"></i>
                </div>

                <div>
                    <span>វត្តមាន</span>

                    <strong>87%</strong>

                    <small>
                        ក្នុងខែនេះ
                    </small>
                </div>

            </div>

        </section>


        <!-- =================================
             Bottom Grid
        ================================== -->

        <section class="dashboard-grid">


            <!-- Recent Results -->

            <div class="dashboard-card results-card">

                <div class="card-header">

                    <div>

                        <h2>
                            លទ្ធផលថ្មីៗ
                        </h2>

                        <p>
                            ព័ត៌មានលទ្ធផលសិក្សាចុងក្រោយ
                        </p>

                    </div>

                    <a href="/scores">
                        មើលទាំងអស់ →
                    </a>

                </div>


                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>មុខវិជ្ជា</th>

                                <th>ប្រភេទប្រឡង</th>

                                <th>ពិន្ទុ</th>

                                <th>កាលបរិច្ឆេទ</th>

                            </tr>

                        </thead>


                        <tbody>

                            <tr>

                                <td>
                                    រចនាសម្ព័ន្ធទិន្នន័យ
                                </td>

                                <td>
                                    ប្រឡងពាក់កណ្ដាលឆមាស
                                </td>

                                <td>
                                    <span class="grade a">
                                        A
                                    </span>
                                </td>

                                <td>
                                    12 មិថុនា 2026
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យ
                                </td>

                                <td>
                                    ប្រឡងពាក់កណ្ដាលឆមាស
                                </td>

                                <td>
                                    <span class="grade ap">
                                        A+
                                    </span>
                                </td>

                                <td>
                                    10 មិថុនា 2026
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    ប្រព័ន្ធប្រតិបត្តិការ
                                </td>

                                <td>
                                    ប្រឡងពាក់កណ្ដាលឆមាស
                                </td>

                                <td>
                                    <span class="grade bp">
                                        B+
                                    </span>
                                </td>

                                <td>
                                    08 មិថុនា 2026
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>


            <!-- Notice -->

            <div class="dashboard-card notice-card">

                <div class="card-header">

                    <div>

                        <h2>
                            📢 ព័ត៌មានជូនដំណឹង
                        </h2>

                        <p>
                            ព័ត៌មានថ្មីៗ
                        </p>

                    </div>

                    <a href="#">
                        មើលទាំងអស់
                    </a>

                </div>


                <div class="notice-list">


                    <div class="notice-item">

                        <div class="notice-icon">
                            <i class="bi bi-megaphone-fill"></i>
                        </div>

                        <div>

                            <strong>
                                កាលវិភាគប្រឡងឆមាស
                            </strong>

                            <p>
                                កាលវិភាគប្រឡងនឹងប្រព្រឹត្ត
                                នៅថ្ងៃទី 25 មិថុនា 2026។
                            </p>

                            <small>
                                15 មិថុនា 2026
                            </small>

                        </div>

                    </div>


                    <div class="notice-item">

                        <div class="notice-icon">
                            <i class="bi bi-megaphone-fill"></i>
                        </div>

                        <div>

                            <strong>
                                ប្រកាសលទ្ធផលប្រឡង
                            </strong>

                            <p>
                                លទ្ធផលប្រឡងឆមាស
                                បានប្រកាសរួចរាល់។
                            </p>

                            <small>
                                12 មិថុនា 2026
                            </small>

                        </div>

                    </div>


                    <div class="notice-item">

                        <div class="notice-icon">
                            <i class="bi bi-megaphone-fill"></i>
                        </div>

                        <div>

                            <strong>
                                កាលបរិច្ឆេទដាក់ Project
                            </strong>

                            <p>
                                សូមដាក់ Project
                                មុនថ្ងៃទី 20 មិថុនា។
                            </p>

                            <small>
                                10 មិថុនា 2026
                            </small>

                        </div>

                    </div>

                </div>

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

    grid-template-columns:
        repeat(5, 1fr);

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

    grid-template-columns:
        minmax(0, 1.5fr)
        minmax(350px, 0.8fr);

    gap: 20px;

    margin-top: 24px;

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


/* ========================================
   NOTICE
======================================== */

.notice-list {

    padding: 5px 20px;

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

    .welcome-card {

        padding: 25px;

    }

    .welcome-content h1 {

        font-size: 23px;

    }

}

</style>