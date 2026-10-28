<script setup>
import { RouterLink } from "vue-router";
import ThemeToggle from "@/components/ui/ThemeToggle.vue";

const features = [
  {
    icon: "bi-people",
    title: "គ្រប់គ្រងសិស្ស",
    description: "រក្សាទុកព័ត៌មានសិស្ស និងរៀបចំតាមថ្នាក់រៀនបានយ៉ាងងាយស្រួល។",
  },
  {
    icon: "bi-clipboard2-check",
    title: "តាមដានវត្តមាន",
    description: "កត់ត្រាវត្តមានប្រចាំថ្ងៃ និងពិនិត្យស្ថានភាពសិស្សបានភ្លាមៗ។",
  },
  {
    icon: "bi-journal-check",
    title: "គ្រប់គ្រងពិន្ទុ",
    description: "បញ្ចូល និងពិនិត្យលទ្ធផលសិក្សាតាមមុខវិជ្ជា និងថ្នាក់រៀន។",
  },
];
</script>

<template>
  <main id="top" class="landing-page">
    <header class="site-header">
      <nav class="navbar landing-nav" aria-label="Main navigation">
        <RouterLink class="brand" to="/landing" aria-label="ទំព័រដើម">
          <span class="brand-mark"><i class="bi bi-mortarboard-fill"></i></span>
          <span class="brand-name">Edu<span>Manage</span></span>
        </RouterLink>

        <div class="nav-links">
          <a href="#features">មុខងារ</a>
          <a href="#about">អំពីប្រព័ន្ធ</a>
        </div>

        <div class="nav-actions">
          <ThemeToggle />
          <RouterLink class="nav-login" to="/login">
            ចូលប្រព័ន្ធ <i class="bi bi-arrow-up-right"></i>
          </RouterLink>
        </div>
      </nav>
    </header>

    <section class="hero-section">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-copy">
          <div class="eyebrow"><span></span> ប្រព័ន្ធគ្រប់គ្រងសាលារៀន</div>
          <h1>ការគ្រប់គ្រងសាលារៀន<br />កាន់តែ<span>ងាយស្រួល</span></h1>
          <p class="hero-description">
            ភ្ជាប់ការគ្រប់គ្រងសិស្ស ថ្នាក់រៀន វត្តមាន និងពិន្ទុរបស់អ្នក
            នៅកន្លែងតែមួយ ដើម្បីឱ្យការងារប្រចាំថ្ងៃកាន់តែរលូន។
          </p>
          <div class="hero-actions">
            <RouterLink class="button-primary" to="/login">
              ចាប់ផ្តើមប្រើប្រាស់ <i class="bi bi-arrow-right"></i>
            </RouterLink>
            <a class="button-secondary" href="#features">
              ស្វែងយល់បន្ថែម <i class="bi bi-chevron-down"></i>
            </a>
          </div>
          <div class="trust-note">
            <span class="trust-icon"><i class="bi bi-shield-check"></i></span>
            <span>ទិន្នន័យសាលារៀនរបស់អ្នក ត្រូវបានរៀបចំយ៉ាងមានសុវត្ថិភាព</span>
          </div>
        </div>

        <div class="preview-wrap" aria-label="គំរូផ្ទាំងគ្រប់គ្រង">
          <div class="preview-orbit orbit-one"></div>
          <div class="preview-orbit orbit-two"></div>
          <div class="dashboard-preview">
            <div class="preview-sidebar">
              <div class="preview-logo"><i class="bi bi-mortarboard-fill"></i></div>
              <span class="sidebar-line active"><i class="bi bi-grid-fill"></i></span>
              <span class="sidebar-line"><i class="bi bi-people"></i></span>
              <span class="sidebar-line"><i class="bi bi-calendar-check"></i></span>
              <span class="sidebar-line"><i class="bi bi-journal-text"></i></span>
            </div>
            <div class="preview-main">
              <div class="preview-topbar">
                <div>
                  <span class="preview-kicker">ថ្ងៃនេះ</span>
                  <strong>សួស្តី! សូមស្វាគមន៍ 👋</strong>
                </div>
                <div class="preview-avatar">អ</div>
              </div>
              <div class="preview-welcome">
                <span>ផ្ទាំងគ្រប់គ្រង</span>
                <span class="preview-date"><i class="bi bi-calendar3"></i> ឆ្នាំសិក្សា ២០២៥–២០២៦</span>
              </div>
              <div class="preview-stats">
                <div class="stat-card">
                  <span class="stat-icon students"><i class="bi bi-people-fill"></i></span>
                  <span class="stat-label">សិស្សសរុប</span>
                  <strong>1,248</strong>
                  <small>នាក់</small>
                </div>
                <div class="stat-card">
                  <span class="stat-icon classes"><i class="bi bi-door-open-fill"></i></span>
                  <span class="stat-label">ថ្នាក់រៀន</span>
                  <strong>32</strong>
                  <small>ថ្នាក់</small>
                </div>
                <div class="stat-card">
                  <span class="stat-icon attendance"><i class="bi bi-check2-circle"></i></span>
                  <span class="stat-label">វត្តមានថ្ងៃនេះ</span>
                  <strong>96<span class="percent">%</span></strong>
                  <small>មានវត្តមាន</small>
                </div>
              </div>
              <div class="preview-bottom">
                <div class="chart-card">
                  <div class="chart-heading">
                    <div><span class="stat-label">ស្ថិតិសិស្ស</span><strong>ចំនួនសិស្សតាមខែ</strong></div>
                    <i class="bi bi-three-dots"></i>
                  </div>
                  <div class="chart">
                    <div class="chart-y-labels"><span>1.5k</span><span>1.0k</span><span>0.5k</span></div>
                    <div class="chart-plot">
                      <div class="chart-grid"><span></span><span></span><span></span></div>
                      <svg viewBox="0 0 300 94" role="img" aria-label="ក្រាហ្វស្ថិតិសិស្ស">
                        <defs>
                          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="#1b9a6c" stop-opacity=".2" />
                            <stop offset="100%" stop-color="#1b9a6c" stop-opacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0 76 C24 67 34 69 56 58 S92 54 112 46 S145 51 169 34 S207 43 224 27 S267 32 300 9 V94 H0Z" fill="url(#chartFill)" />
                        <path d="M0 76 C24 67 34 69 56 58 S92 54 112 46 S145 51 169 34 S207 43 224 27 S267 32 300 9" fill="none" stroke="#16976a" stroke-width="3" stroke-linecap="round" />
                        <circle cx="224" cy="27" r="4" fill="#fff" stroke="#16976a" stroke-width="2.5" />
                      </svg>
                      <div class="chart-months"><span>មករា</span><span>មីនា</span><span>ឧសភា</span><span>កក្កដា</span><span>កញ្ញា</span></div>
                    </div>
                  </div>
                </div>
                <div class="attendance-card">
                  <span class="stat-label">វត្តមានថ្ងៃនេះ</span>
                  <strong>ស្ថានភាព</strong>
                  <div class="attendance-ring"><span>96<small>%</small></span></div>
                  <div class="attendance-legend"><span><i></i> មានវត្តមាន</span><b>1,198 នាក់</b></div>
                  <div class="attendance-legend absent"><span><i></i> អវត្តមាន</span><b>50 នាក់</b></div>
                </div>
              </div>
            </div>
          </div>
          <div class="floating-note">
            <span><i class="bi bi-check-lg"></i></span>
            <div><strong>ទិន្នន័យបានធ្វើបច្ចុប្បន្នភាព</strong><small>ងាយស្រួល ត្រឹមត្រូវ និងរហ័ស</small></div>
          </div>
        </div>
      </div>
      <div class="hero-bottom">
        <span>គ្រប់គ្រងបានកាន់តែប្រសើរ</span>
        <i class="bi bi-arrow-down"></i>
      </div>
    </section>

    <section id="features" class="features-section">
      <div class="section-heading">
        <span class="section-eyebrow">មុខងារសំខាន់ៗ</span>
        <h2>អ្វីៗដែលសាលារបស់អ្នកត្រូវការ</h2>
        <p>ឧបករណ៍សាមញ្ញៗ សម្រាប់កិច្ចការសំខាន់ៗប្រចាំថ្ងៃរបស់សាលា។</p>
      </div>
      <div class="feature-grid">
        <article v-for="(feature, index) in features" :key="feature.title" class="feature-card">
          <span class="feature-icon" :class="`feature-icon-${index + 1}`">
            <i :class="`bi ${feature.icon}`"></i>
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <a href="#about">ស្វែងយល់បន្ថែម <i class="bi bi-arrow-right"></i></a>
        </article>
      </div>
    </section>

    <section id="about" class="closing-section">
      <div class="closing-content">
        <span class="section-eyebrow">ចាប់ផ្តើមថ្ងៃនេះ</span>
        <h2>ធ្វើឱ្យការគ្រប់គ្រងសាលារៀន<br />កាន់តែមានប្រសិទ្ធភាព</h2>
        <p>ចូលប្រើប្រព័ន្ធ ដើម្បីគ្រប់គ្រងព័ត៌មានសាលារបស់អ្នក។</p>
        <RouterLink class="button-primary closing-button" to="/login">
          ចូលប្រព័ន្ធ <i class="bi bi-arrow-right"></i>
        </RouterLink>
      </div>
      <div class="closing-decoration decoration-one"></div>
      <div class="closing-decoration decoration-two"></div>
    </section>

    <footer class="site-footer">
      <RouterLink class="brand footer-brand" to="/landing">
        <span class="brand-mark"><i class="bi bi-mortarboard-fill"></i></span>
        <span class="brand-name">Edu<span>Manage</span></span>
      </RouterLink>
      <span>© ២០២៦ EduManage. រក្សាសិទ្ធិគ្រប់យ៉ាង។</span>
      <a href="#top" class="back-to-top" aria-label="ត្រឡប់ទៅខាងលើ"><i class="bi bi-arrow-up"></i></a>
    </footer>
  </main>
</template>

<style scoped>
.landing-page {
  --green: #13865e;
  --green-dark: #0a6848;
  --ink: #172c25;
  --muted: #73837c;
  --line: #e8efeb;
  color: var(--ink);
  background: #fff;
  overflow: hidden;
}

.site-header {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, .92);
}

.landing-nav {
  width: min(1240px, calc(100% - 64px));
  height: 82px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
}

.brand-mark {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #e8f5ee;
  color: var(--green);
  font-size: 21px;
}

.brand-name {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -.6px;
}

.brand-name > span {
  color: var(--green);
  font-weight: 500;
}

.nav-links {
  display: flex;
  gap: 38px;
  margin-left: 60px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-links a,
.nav-login {
  color: #5e7068;
  font-size: 14px;
  font-weight: 600;
  transition: color .2s ease;
}

.nav-links a:hover,
.nav-login:hover {
  color: var(--green);
}

.nav-login {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 11px 18px;
  border: 1px solid #dce8e1;
  border-radius: 9px;
  color: var(--green-dark);
}

.hero-section {
  position: relative;
  min-height: 640px;
  padding: 68px 0 0;
  background:
    radial-gradient(ellipse at 80% 43%, rgba(217, 241, 226, .7), transparent 40%),
    linear-gradient(180deg, #f8fcf9 0%, #f4faf6 100%);
}

.hero-glow {
  position: absolute;
  width: 540px;
  height: 540px;
  right: -120px;
  top: 8px;
  border: 1px solid rgba(25, 142, 95, .08);
  border-radius: 50%;
  pointer-events: none;
}

.hero-glow::before,
.hero-glow::after {
  position: absolute;
  content: "";
  inset: 35px;
  border: 1px solid rgba(25, 142, 95, .07);
  border-radius: 50%;
}

.hero-glow::after {
  inset: 74px;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: min(1240px, calc(100% - 64px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: .87fr 1.13fr;
  align-items: center;
  gap: 42px;
  min-height: 480px;
}

.hero-copy {
  padding: 0 0 30px 8px;
}

.eyebrow,
.section-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--green);
  font-size: 13px;
  font-weight: 700;
}

.eyebrow {
  padding: 8px 13px;
  border: 1px solid #dcefe3;
  border-radius: 50px;
  background: rgba(255, 255, 255, .75);
}

.eyebrow span {
  width: 7px;
  height: 7px;
  background: #20a46f;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #e5f5ec;
}

.hero-copy h1 {
  margin: 23px 0 15px;
  color: #16352a;
  font-size: clamp(36px, 4vw, 52px);
  font-weight: 800;
  line-height: 1.45;
  letter-spacing: -.8px;
}

.hero-copy h1 span {
  color: var(--green);
}

.hero-description {
  max-width: 490px;
  margin: 0;
  color: #718078;
  font-size: 15px;
  line-height: 1.95;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 22px;
  margin-top: 28px;
}

.button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  min-height: 48px;
  padding: 0 21px;
  border: 0;
  border-radius: 9px;
  background: var(--green);
  box-shadow: 0 7px 18px rgba(19, 134, 94, .18);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}

.button-primary:hover {
  transform: translateY(-2px);
  background: var(--green-dark);
  box-shadow: 0 10px 22px rgba(19, 134, 94, .25);
  color: #fff;
}

.button-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #60736a;
  font-size: 13px;
  font-weight: 700;
}

.button-secondary:hover {
  color: var(--green);
}

.trust-note {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 31px;
  color: #87958e;
  font-size: 11px;
}

.trust-icon {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 50%;
  background: #e4f4ea;
  color: var(--green);
  font-size: 13px;
}

.preview-wrap {
  position: relative;
  padding: 15px 0 31px;
  perspective: 1200px;
}

.preview-orbit {
  position: absolute;
  border-radius: 50%;
  background: #c9ead7;
  opacity: .7;
}

.orbit-one {
  width: 13px;
  height: 13px;
  top: 8px;
  right: 14%;
}

.orbit-two {
  width: 7px;
  height: 7px;
  bottom: 34px;
  left: 2%;
  background: #82c9a0;
}

.dashboard-preview {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 384px;
  overflow: hidden;
  border: 1px solid rgba(34, 80, 59, .1);
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 23px 65px rgba(39, 81, 59, .15), 0 3px 9px rgba(39, 81, 59, .05);
  transform: rotateY(-4deg) rotateX(1deg);
}

.preview-sidebar {
  flex: 0 0 55px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 17px;
  padding: 15px 0;
  border-right: 1px solid #eef2ef;
  background: #fcfefc;
}

.preview-logo {
  display: grid;
  width: 28px;
  height: 28px;
  margin-bottom: 6px;
  place-items: center;
  border-radius: 8px;
  background: #e5f4eb;
  color: var(--green);
}

.sidebar-line {
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  border-radius: 8px;
  color: #91a097;
  font-size: 13px;
}

.sidebar-line.active {
  background: #e9f5ed;
  color: var(--green);
}

.preview-main {
  flex: 1;
  min-width: 0;
  padding: 19px 21px 17px;
}

.preview-topbar,
.preview-welcome,
.chart-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-topbar strong,
.chart-heading strong,
.attendance-card > strong {
  display: block;
  color: #263b31;
  font-size: 11px;
  font-weight: 700;
}

.preview-kicker,
.stat-label {
  display: block;
  color: #99a69f;
  font-size: 8px;
}

.preview-avatar {
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border-radius: 50%;
  background: #e7f3eb;
  color: var(--green);
  font-size: 11px;
  font-weight: 700;
}

.preview-welcome {
  margin: 21px 0 11px;
  color: #344940;
  font-size: 10px;
  font-weight: 700;
}

.preview-date {
  color: #829189;
  font-size: 8px;
  font-weight: 500;
}

.preview-date i {
  margin-right: 3px;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
}

.stat-card {
  position: relative;
  min-height: 86px;
  padding: 11px 9px 8px;
  border: 1px solid #edf2ee;
  border-radius: 8px;
}

.stat-icon {
  position: absolute;
  top: 9px;
  right: 8px;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 6px;
  font-size: 11px;
}

.stat-icon.students {
  background: #e7f3ff;
  color: #4087c7;
}

.stat-icon.classes {
  background: #fff1e2;
  color: #df974c;
}

.stat-icon.attendance {
  background: #e5f5eb;
  color: #37a36d;
}

.stat-card .stat-label {
  margin-bottom: 7px;
}

.stat-card > strong {
  color: #263b31;
  font-size: 17px;
  font-weight: 800;
}

.stat-card > small {
  margin-left: 3px;
  color: #93a099;
  font-size: 8px;
}

.percent {
  font-size: 11px;
}

.preview-bottom {
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: 9px;
  margin-top: 10px;
}

.chart-card,
.attendance-card {
  min-width: 0;
  padding: 11px 10px 8px;
  border: 1px solid #edf2ee;
  border-radius: 8px;
}

.chart-heading {
  align-items: flex-start;
}

.chart-heading .stat-label {
  margin-bottom: 4px;
}

.chart-heading i {
  color: #91a098;
  font-size: 12px;
}

.chart {
  display: flex;
  gap: 6px;
  height: 79px;
  margin-top: 7px;
}

.chart-y-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 12px;
  color: #a3aea8;
  font-size: 6px;
}

.chart-plot {
  position: relative;
  flex: 1;
  min-width: 0;
}

.chart-grid {
  position: absolute;
  inset: 2px 0 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-grid span {
  border-top: 1px dashed #e8efea;
}

.chart-plot svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 63px;
  overflow: visible;
}

.chart-months {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  color: #a3aea8;
  font-size: 6px;
}

.attendance-card > strong {
  margin-top: 3px;
}

.attendance-ring {
  display: grid;
  width: 62px;
  height: 62px;
  margin: 5px auto 6px;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(#21a271 0 78%, #e9f4ed 78% 100%);
}

.attendance-ring::before {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  content: "";
}

.attendance-ring span {
  position: relative;
  z-index: 1;
  color: #30493b;
  font-size: 15px;
  font-weight: 800;
}

.attendance-ring small {
  font-size: 8px;
}

.attendance-legend {
  display: flex;
  justify-content: space-between;
  color: #87958d;
  font-size: 6px;
}

.attendance-legend + .attendance-legend {
  margin-top: 4px;
}

.attendance-legend i {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 3px;
  border-radius: 50%;
  background: #20a271;
}

.attendance-legend.absent i {
  background: #eab56f;
}

.attendance-legend b {
  color: #596b61;
  font-weight: 600;
}

.floating-note {
  position: absolute;
  z-index: 2;
  right: -14px;
  bottom: 3px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 15px 11px 11px;
  border: 1px solid #e7efe9;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(33, 72, 51, .12);
}

.floating-note > span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 8px;
  background: #e4f4e9;
  color: var(--green);
}

.floating-note strong,
.floating-note small {
  display: block;
}

.floating-note strong {
  color: #375044;
  font-size: 9px;
}

.floating-note small {
  margin-top: 3px;
  color: #92a097;
  font-size: 8px;
}

.hero-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 11px;
  padding: 25px 0 18px;
  color: #9ba9a1;
  font-size: 10px;
}

.hero-bottom i {
  color: var(--green);
}

.features-section {
  padding: 88px 32px 96px;
}

.section-heading {
  margin: 0 auto 38px;
  text-align: center;
}

.section-heading h2,
.closing-content h2 {
  margin: 12px 0 8px;
  color: #19372b;
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -.45px;
}

.section-heading p,
.closing-content p {
  margin: 0;
  color: #819088;
  font-size: 14px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 19px;
  width: min(1030px, 100%);
  margin: 0 auto;
}

.feature-card {
  padding: 25px 24px 23px;
  border: 1px solid #e8efeb;
  border-radius: 13px;
  background: #fff;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #d0e8d9;
  box-shadow: 0 15px 32px rgba(41, 91, 63, .08);
}

.feature-icon {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 12px;
  background: #e8f5ed;
  color: var(--green);
  font-size: 20px;
}

.feature-icon-2 {
  background: #eef3ff;
  color: #5379cb;
}

.feature-icon-3 {
  background: #fff3e8;
  color: #d68b43;
}

.feature-card h3 {
  margin: 18px 0 8px;
  color: #20392d;
  font-size: 17px;
  font-weight: 700;
}

.feature-card p {
  min-height: 54px;
  margin: 0;
  color: #7c8b83;
  font-size: 13px;
  line-height: 1.8;
}

.feature-card > a {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 17px;
  color: var(--green);
  font-size: 12px;
  font-weight: 700;
}

.closing-section {
  position: relative;
  overflow: hidden;
  padding: 66px 24px 70px;
  background: #f3faf5;
  text-align: center;
}

.closing-content {
  position: relative;
  z-index: 1;
}

.closing-content h2 {
  margin-top: 12px;
  line-height: 1.55;
}

.closing-content p {
  margin-bottom: 21px;
}

.closing-button {
  min-width: 150px;
}

.closing-decoration {
  position: absolute;
  width: 220px;
  height: 220px;
  border: 1px solid rgba(27, 137, 91, .09);
  border-radius: 50%;
}

.decoration-one {
  top: -130px;
  left: 9%;
}

.decoration-two {
  right: 8%;
  bottom: -165px;
  width: 290px;
  height: 290px;
}

.site-footer {
  display: flex;
  width: min(1240px, calc(100% - 64px));
  min-height: 82px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.footer-brand .brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  font-size: 17px;
}

.footer-brand .brand-name {
  font-size: 16px;
}

.site-footer > span {
  color: #91a097;
  font-size: 11px;
}

.back-to-top {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid #e5ede8;
  border-radius: 9px;
  color: #718379;
}

.back-to-top:hover {
  border-color: #c6e2d1;
  color: var(--green);
}

@media (min-width: 1400px) {
  .hero-content {
    gap: 65px;
  }

  .dashboard-preview {
    min-height: 405px;
  }
}

@media (max-width: 1000px) {
  .hero-content {
    grid-template-columns: 1fr 1.05fr;
    gap: 20px;
  }

  .hero-copy {
    padding-left: 0;
  }

  .hero-copy h1 {
    font-size: 39px;
  }

  .preview-main {
    padding: 16px 14px;
  }

  .floating-note {
    right: 0;
  }
}

@media (max-width: 760px) {
  .landing-nav,
  .hero-content,
  .site-footer {
    width: min(100% - 38px, 540px);
  }

  .landing-nav {
    height: 70px;
  }

  .nav-links {
    display: none;
  }

  .nav-actions {
    gap: 8px;
  }

  .nav-login {
    padding: 9px 12px;
    font-size: 12px;
  }

  .brand-name {
    font-size: 17px;
  }

  .brand-mark {
    width: 36px;
    height: 36px;
  }

  .hero-section {
    padding-top: 48px;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 29px;
  }

  .hero-copy {
    padding-bottom: 0;
  }

  .hero-copy h1 {
    margin-top: 18px;
    font-size: clamp(34px, 8vw, 45px);
  }

  .hero-description {
    font-size: 14px;
  }

  .hero-actions {
    margin-top: 22px;
  }

  .trust-note {
    margin-top: 23px;
  }

  .dashboard-preview {
    min-height: 0;
    transform: none;
  }

  .preview-wrap {
    padding: 0 0 28px;
  }

  .preview-main {
    padding: 14px 12px;
  }

  .preview-sidebar {
    flex-basis: 42px;
    gap: 12px;
  }

  .sidebar-line {
    width: 27px;
    height: 27px;
  }

  .preview-stats,
  .preview-bottom {
    gap: 6px;
  }

  .stat-card {
    min-height: 76px;
    padding: 9px 6px;
  }

  .stat-icon {
    width: 18px;
    height: 18px;
    top: 6px;
    right: 5px;
  }

  .stat-card > strong {
    font-size: 15px;
  }

  .floating-note {
    right: 3px;
    bottom: -1px;
  }

  .hero-bottom {
    padding-top: 17px;
  }

  .features-section {
    padding: 67px 19px 72px;
  }

  .section-heading {
    margin-bottom: 27px;
  }

  .section-heading h2,
  .closing-content h2 {
    font-size: 26px;
  }

  .section-heading p,
  .closing-content p {
    font-size: 13px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
    gap: 12px;
  }

  .feature-card {
    padding: 20px;
  }

  .feature-card p {
    min-height: 0;
  }

  .feature-card h3 {
    margin-top: 13px;
  }

  .feature-card > a {
    margin-top: 12px;
  }

  .closing-section {
    padding: 57px 19px 61px;
  }

  .site-footer {
    min-height: 75px;
    gap: 10px;
  }

  .site-footer > span {
    font-size: 9px;
    text-align: center;
  }
}

@media (max-width: 420px) {
  .hero-actions {
    gap: 14px;
  }

  .button-primary {
    min-height: 44px;
    padding: 0 15px;
    font-size: 12px;
  }

  .button-secondary {
    font-size: 11px;
  }

  .preview-kicker,
  .preview-date,
  .stat-label {
    font-size: 7px;
  }

  .preview-topbar strong,
  .chart-heading strong {
    font-size: 9px;
  }

  .stat-card > small {
    font-size: 7px;
  }

  .site-footer {
    width: calc(100% - 28px);
  }

  .footer-brand {
    gap: 6px;
  }

  .footer-brand .brand-name {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
</style>