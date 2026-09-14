<script setup>
import { computed } from "vue";

const emit = defineEmits([
    "toggle-sidebar"
]);


/* ========================================
   User
======================================== */

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


const userRole = computed(() => {

    if (user.value.role === "admin") {
        return "អ្នកគ្រប់គ្រង";
    }

    if (user.value.role === "teacher") {
        return "គ្រូបង្រៀន";
    }

    if (user.value.role === "student") {
        return "សិស្ស";
    }

    return "អ្នកប្រើប្រាស់";

});
</script>


<template>

    <header class="navbar">

        <!-- =================================
             LEFT
        ================================== -->

        <div class="navbar-left">

            <button
                class="menu-btn"
                @click="
                    emit('toggle-sidebar')
                "
                title="បិទ/បើក Sidebar"
            >

                <i class="bi bi-list"></i>

            </button>


            <div class="page-heading">

                <h3>
                    ផ្ទាំងគ្រប់គ្រង
                </h3>

                <span>
                    ប្រព័ន្ធគ្រប់គ្រងសិស្ស
                </span>

            </div>

        </div>


        <!-- =================================
             RIGHT
        ================================== -->

        <div class="navbar-right">

            <!-- Search -->

            <div class="search-box">

                <i class="bi bi-search"></i>

                <input
                    type="text"
                    placeholder="ស្វែងរក..."
                />

            </div>


            <!-- Notification -->

            <button
                class="notification-btn"
                title="ការជូនដំណឹង"
            >

                <i class="bi bi-bell"></i>

                <span class="notification-count">
                    3
                </span>

            </button>


            <!-- User -->

            <div class="profile">

                <div class="avatar">

                    {{
                        userName
                            .charAt(0)
                            .toUpperCase()
                    }}

                </div>


                <div class="profile-info">

                    <strong>
                        {{ userName }}
                    </strong>

                    <span>
                        {{ userRole }}
                    </span>

                </div>


                <i
                    class="
                        bi
                        bi-chevron-down
                        profile-arrow
                    "
                ></i>

            </div>

        </div>

    </header>

</template>


<style scoped>

/* ========================================
   NAVBAR
======================================== */

.navbar {

    position: sticky;

    top: 0;

    width: 100%;

    height: 70px;

    background: #ffffff;

    border-bottom: 1px solid #e6ede9;

    display: flex;

    align-items: center;

    justify-content: space-between;

    padding: 0 25px;

    z-index: 900;

}


/* ========================================
   LEFT
======================================== */

.navbar-left {

    display: flex;

    align-items: center;

    gap: 14px;

}


.menu-btn {

    width: 42px;
    height: 42px;

    border: none;

    border-radius: 10px;

    background: #f3f7f5;

    color: #52625a;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 21px;

    cursor: pointer;

    transition: 0.2s;

}


.menu-btn:hover {

    background: #e3f3ea;

    color: #16834b;

}


.page-heading h3 {

    margin: 0;

    color: #1b2d25;

    font-size: 16px;

    font-weight: 700;

}


.page-heading span {

    display: block;

    margin-top: 2px;

    color: #8a9690;

    font-size: 9px;

}


/* ========================================
   RIGHT
======================================== */

.navbar-right {

    display: flex;

    align-items: center;

    gap: 18px;

}


/* ========================================
   SEARCH
======================================== */

.search-box {

    width: 275px;

    height: 42px;

    display: flex;

    align-items: center;

    gap: 9px;

    padding: 0 13px;

    border: 1px solid #dfe8e3;

    border-radius: 10px;

    background: #fafcfb;

}


.search-box i {

    color: #7d8b84;

    font-size: 17px;

}


.search-box input {

    flex: 1;

    width: 100%;

    border: none;

    outline: none;

    background: transparent;

    color: #27372f;

    font-size: 11px;

}


.search-box input::placeholder {

    color: #9ca7a2;

}


/* ========================================
   NOTIFICATION
======================================== */

.notification-btn {

    position: relative;

    width: 40px;
    height: 40px;

    border: none;

    background: transparent;

    color: #53635b;

    font-size: 20px;

    cursor: pointer;

}


.notification-count {

    position: absolute;

    top: 0;
    right: 0;

    width: 16px;
    height: 16px;

    border-radius: 50%;

    display: flex;

    align-items: center;

    justify-content: center;

    background: #287dd3;

    color: white;

    border: 2px solid white;

    font-size: 7px;

    font-weight: 700;

}


/* ========================================
   PROFILE
======================================== */

.profile {

    display: flex;

    align-items: center;

    gap: 9px;

    cursor: pointer;

}


.avatar {

    width: 42px;
    height: 42px;

    border-radius: 50%;

    background: #e3f4ea;

    color: #16834b;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 14px;

    font-weight: 800;

}


.profile-info strong {

    display: block;

    color: #25352d;

    font-size: 11px;

}


.profile-info span {

    display: block;

    margin-top: 2px;

    color: #8d9893;

    font-size: 8px;

}


.profile-arrow {

    color: #78857e;

    font-size: 10px;

}


/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 900px) {

    .navbar {

        padding: 0 15px;

    }

    .search-box {

        display: none;

    }

    .profile-info {

        display: none;

    }

}


@media (max-width: 500px) {

    .page-heading {

        display: none;

    }

    .navbar-right {

        gap: 7px;

    }

}

</style>