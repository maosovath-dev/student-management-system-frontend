<script setup>
import { computed, onMounted, ref, watch } from "vue";
import attendanceApi from "@/api/attendances";
import classApi from "@/api/classes";
import scoreApi from "@/api/scores";
import { studentApi } from "@/api/student";
import BaseButton from "@/components/ui/BaseButton.vue";
import BasePagination from "@/components/ui/BasePagination.vue";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

const reportTypes = [
  { id: "attendance", label: "វត្តមាន", icon: "bi-calendar-check" },
  { id: "students", label: "សិស្ស", icon: "bi-people" },
  { id: "scores", label: "ពិន្ទុ", icon: "bi-bar-chart" },
];

const periods = [
  { value: "today", label: "ថ្ងៃនេះ" },
  { value: "month", label: "ខែនេះ" },
  { value: "last30", label: "៣០ ថ្ងៃចុងក្រោយ" },
  { value: "year", label: "ឆ្នាំនេះ" },
  { value: "all", label: "គ្រប់ពេល" },
];

const activeReport = ref("attendance");
const selectedClass = ref("");
const selectedPeriod = ref("month");
const selectedSemester = ref("");
const attendance = ref([]);
const students = ref([]);
const scores = ref([]);
const classes = ref([]);
const loading = ref(true);
const exporting = ref(false);
const loadError = ref("");
const reportPage = ref(1);
const reportPageSize = 10;

const unwrapList = (response, label) => {
  const result = response?.data?.data ?? response?.data;
  if (!Array.isArray(result)) {
    throw new Error(`ទិន្នន័យ ${label} មិនត្រឹមត្រូវទេ។`);
  }
  return result;
};

const loadReports = async () => {
  loading.value = true;
  loadError.value = "";

  try {
    const [attendanceResponse, studentsResponse, scoresResponse, classesResponse] =
      await Promise.all([
        attendanceApi.getAll(),
        studentApi.getAll(),
        scoreApi.getAll(),
        classApi.getAll(),
      ]);

    attendance.value = unwrapList(attendanceResponse, "វត្តមាន");
    students.value = unwrapList(studentsResponse, "សិស្ស");
    scores.value = unwrapList(scoresResponse, "ពិន្ទុ");
    classes.value = unwrapList(classesResponse, "ថ្នាក់");
  } catch (error) {
    loadError.value =
      error.response?.data?.message ||
      error.message ||
      "មិនអាចទាញយកទិន្នន័យរបាយការណ៍បានទេ។";
  } finally {
    loading.value = false;
  }
};

const normalizeDate = (value) => {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, "0"),
      String(value.getDate()).padStart(2, "0"),
    ].join("-");
  }
  return String(value).slice(0, 10);
};

const filteredByClass = (rows, getClassId) =>
  rows.filter((row) => !selectedClass.value || String(getClassId(row) ?? "") === selectedClass.value);

const attendanceRows = computed(() => {
  const today = normalizeDate(new Date());
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const yearStart = `${now.getFullYear()}-01-01`;
  const last30Start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
  const last30StartText = normalizeDate(last30Start);

  return filteredByClass(attendance.value, (row) => row.class_id).filter((row) => {
    const date = normalizeDate(row.date);
    if (!date) return false;
    if (selectedPeriod.value === "today") return date === today;
    if (selectedPeriod.value === "month") return date >= monthStart && date <= today;
    if (selectedPeriod.value === "year") return date >= yearStart && date <= today;
    if (selectedPeriod.value === "last30") return date >= last30StartText && date <= today;
    return true;
  });
});

const studentRows = computed(() =>
  filteredByClass(students.value, (row) => row.class_id)
);

const availableSemesters = computed(() =>
  [...new Set(scores.value.map((row) => row.semester).filter(Boolean))].sort()
);

const classById = computed(() =>
  new Map(classes.value.map((item) => [String(item.id), item.name]))
);
const studentById = computed(() =>
  new Map(students.value.map((item) => [String(item.id), item]))
);

const scoreRows = computed(() =>
  scores.value.filter((row) => {
    const student = studentById.value.get(String(row.student_id));
    const matchesClass =
      !selectedClass.value || String(student?.class_id ?? "") === selectedClass.value;
    const matchesSemester =
      !selectedSemester.value || row.semester === selectedSemester.value;
    return matchesClass && matchesSemester;
  })
);

const attendanceSummary = computed(() => {
  const present = attendanceRows.value.filter((row) => row.status === "present").length;
  const absent = attendanceRows.value.filter((row) => row.status === "absent").length;
  const late = attendanceRows.value.filter((row) => row.status === "late").length;
  const total = present + absent + late;
  return {
    present,
    absent,
    late,
    total,
    rate: total ? ((present / total) * 100).toFixed(1) : "0.0",
  };
});

const studentSummary = computed(() => {
  const assigned = studentRows.value.filter((row) => row.class_id).length;
  const male = studentRows.value.filter((row) => String(row.gender || "").toLowerCase() === "male").length;
  const female = studentRows.value.filter((row) => String(row.gender || "").toLowerCase() === "female").length;
  return {
    total: studentRows.value.length,
    assigned,
    unassigned: studentRows.value.length - assigned,
    male,
    female,
  };
});

const scoreSummary = computed(() => {
  const values = scoreRows.value.map((row) => Number(row.score)).filter(Number.isFinite);
  const total = values.length;
  const sum = values.reduce((result, value) => result + value, 0);
  const passed = values.filter((value) => value >= 50).length;
  return {
    total,
    average: total ? (sum / total).toFixed(1) : "0.0",
    highest: total ? Math.max(...values).toFixed(1) : "0.0",
    passRate: total ? ((passed / total) * 100).toFixed(1) : "0.0",
  };
});

const reportTitle = computed(() =>
  reportTypes.find((item) => item.id === activeReport.value)?.label || ""
);

const selectedClassName = computed(() =>
  selectedClass.value ? classById.value.get(selectedClass.value) || "ថ្នាក់ដែលបានជ្រើស" : "គ្រប់ថ្នាក់"
);

const periodLabel = computed(() =>
  periods.find((item) => item.value === selectedPeriod.value)?.label || "គ្រប់ពេល"
);

const attendanceStatusLabel = (status) =>
  ({ present: "មានវត្តមាន", absent: "អវត្តមាន", late: "មកយឺត" }[status] || "មិនស្គាល់");

const fullName = (student) =>
  `${student?.first_name || ""} ${student?.last_name || ""}`.trim() || student?.name || "មិនស្គាល់ឈ្មោះ";

const reportRows = computed(() => {
  if (activeReport.value === "attendance") {
    return attendanceRows.value.map((row) => ({
      student: fullName(row),
      studentCode: row.student_code || "",
      className: row.class_name || classById.value.get(String(row.class_id)) || "—",
      date: normalizeDate(row.date),
      status: attendanceStatusLabel(row.status),
    }));
  }

  if (activeReport.value === "students") {
    return studentRows.value.map((row) => ({
      student: fullName(row),
      studentCode: row.student_code || "",
      gender: row.gender || "មិនបានបញ្ជាក់",
      className: row.class_name || classById.value.get(String(row.class_id)) || "មិនទាន់ចាត់ថ្នាក់",
    }));
  }

  return scoreRows.value.map((row) => {
    const student = studentById.value.get(String(row.student_id));
    return {
      student: fullName(row),
      studentCode: row.student_code || student?.student_code || "",
      className: student?.class_name || classById.value.get(String(student?.class_id)) || "—",
      subject: row.subject_name || `មុខវិជ្ជា #${row.subject_id}`,
      semester: row.semester || "—",
      score: Number(row.score),
    };
  });
});

const visibleReportRows = computed(() => {
  const start = (reportPage.value - 1) * reportPageSize;
  return reportRows.value.slice(start, start + reportPageSize);
});

watch([activeReport, selectedClass, selectedPeriod, selectedSemester], () => {
  reportPage.value = 1;
});

watch(
  () => reportRows.value.length,
  (total) => {
    const lastPage = Math.max(1, Math.ceil(total / reportPageSize));
    if (reportPage.value > lastPage) reportPage.value = lastPage;
  }
);

const reportColumns = computed(() => {
  if (activeReport.value === "attendance") {
    return [
      { key: "student", label: "សិស្ស" },
      { key: "studentCode", label: "លេខសម្គាល់" },
      { key: "className", label: "ថ្នាក់" },
      { key: "date", label: "កាលបរិច្ឆេទ" },
      { key: "status", label: "ស្ថានភាព" },
    ];
  }
  if (activeReport.value === "students") {
    return [
      { key: "student", label: "សិស្ស" },
      { key: "studentCode", label: "លេខសម្គាល់" },
      { key: "gender", label: "ភេទ" },
      { key: "className", label: "ថ្នាក់" },
    ];
  }
  return [
    { key: "student", label: "សិស្ស" },
    { key: "studentCode", label: "លេខសម្គាល់" },
    { key: "className", label: "ថ្នាក់" },
    { key: "subject", label: "មុខវិជ្ជា" },
    { key: "semester", label: "ឆមាស" },
    { key: "score", label: "ពិន្ទុ" },
  ];
});

const summaryItems = computed(() => {
  if (activeReport.value === "attendance") {
    return [
      { label: "មានវត្តមាន", value: attendanceSummary.value.present, tone: "success" },
      { label: "អវត្តមាន", value: attendanceSummary.value.absent, tone: "danger" },
      { label: "មកយឺត", value: attendanceSummary.value.late, tone: "warning" },
      { label: "អត្រាមានវត្តមាន", value: `${attendanceSummary.value.rate}%`, tone: "neutral" },
    ];
  }
  if (activeReport.value === "students") {
    return [
      { label: "សិស្សសរុប", value: studentSummary.value.total, tone: "neutral" },
      { label: "បានចាត់ថ្នាក់", value: studentSummary.value.assigned, tone: "success" },
      { label: "មិនទាន់ចាត់ថ្នាក់", value: studentSummary.value.unassigned, tone: "warning" },
      { label: "ប្រុស / ស្រី", value: `${studentSummary.value.male} / ${studentSummary.value.female}`, tone: "neutral" },
    ];
  }
  return [
    { label: "កំណត់ត្រាពិន្ទុ", value: scoreSummary.value.total, tone: "neutral" },
    { label: "ពិន្ទុមធ្យម", value: scoreSummary.value.average, tone: "success" },
    { label: "ពិន្ទុខ្ពស់បំផុត", value: scoreSummary.value.highest, tone: "neutral" },
    { label: "អត្រាជាប់", value: `${scoreSummary.value.passRate}%`, tone: "success" },
  ];
});

const exportExcel = async () => {
  if (!reportRows.value.length || exporting.value) return;

  exporting.value = true;
  try {
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Student Management System";
    workbook.created = new Date();
    workbook.subject = `${reportTitle.value} · ${selectedClassName.value}`;

    const worksheet = workbook.addWorksheet(
      { attendance: "វត្តមាន", students: "សិស្ស", scores: "ពិន្ទុ" }[activeReport.value],
      {
        views: [{ state: "frozen", ySplit: 5, topLeftCell: "A6" }],
        pageSetup: {
          paperSize: 9,
          orientation: "landscape",
          fitToPage: true,
          fitToWidth: 1,
          fitToHeight: 0,
          margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
        },
      }
    );
    const columns = reportColumns.value;
    const lastColumn = columns.length;
    const reportSubtitle = [
      `ថ្នាក់៖ ${selectedClassName.value}`,
      activeReport.value === "attendance"
        ? `រយៈពេល៖ ${periodLabel.value}`
        : activeReport.value === "scores"
          ? `ឆមាស៖ ${selectedSemester.value || "គ្រប់ឆមាស"}`
          : null,
      `សរុប៖ ${reportRows.value.length} កំណត់ត្រា`,
      `នាំចេញ៖ ${new Date().toLocaleString()}`,
    ].filter(Boolean).join("   |   ");

    worksheet.mergeCells(1, 1, 1, lastColumn);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = `${reportTitle.value} — របាយការណ៍`;
    titleCell.font = { name: "Kantumruy Pro", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF16834B" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(1).height = 32;

    worksheet.mergeCells(2, 1, 2, lastColumn);
    const subtitleCell = worksheet.getCell(2, 1);
    subtitleCell.value = reportSubtitle;
    subtitleCell.font = { name: "Kantumruy Pro", size: 10, color: { argb: "FF52665A" } };
    subtitleCell.alignment = { vertical: "middle", wrapText: true };
    worksheet.getRow(2).height = 30;
    worksheet.mergeCells(3, 1, 3, lastColumn);
    worksheet.getCell(3, 1).value = "";
    worksheet.getRow(3).height = 8;

    worksheet.columns = columns.map((column) => {
      const longestValue = reportRows.value.reduce((longest, row) => {
        const value = String(row[column.key] ?? "");
        return Math.max(longest, value.length);
      }, column.label.length);

      return {
        key: column.key,
        width: Math.min(40, Math.max(14, longestValue + 4)),
      };
    });

    const headerRowNumber = 5;
    const headerRow = worksheet.getRow(headerRowNumber);
    headerRow.values = columns.map((column) => column.label);
    headerRow.height = 24;
    headerRow.eachCell((cell) => {
      cell.font = { name: "Kantumruy Pro", bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF24583A" } };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FF24583A" } },
        left: { style: "thin", color: { argb: "FFD3E2D8" } },
        bottom: { style: "medium", color: { argb: "FF16834B" } },
        right: { style: "thin", color: { argb: "FFD3E2D8" } },
      };
    });

    reportRows.value.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(headerRowNumber + rowIndex + 1);
      excelRow.values = columns.map((column) => row[column.key] ?? "");
      excelRow.height = 22;
      excelRow.eachCell((cell, columnIndex) => {
        cell.font = { name: "Kantumruy Pro", size: 10, color: { argb: "FF26372E" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowIndex % 2 === 0 ? "FFFFFFFF" : "FFF1F7F3" },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: columns[columnIndex - 1]?.key === "score" ? "center" : "left",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE1EAE4" } },
          left: { style: "thin", color: { argb: "FFE1EAE4" } },
          bottom: { style: "thin", color: { argb: "FFE1EAE4" } },
          right: { style: "thin", color: { argb: "FFE1EAE4" } },
        };
        if (columns[columnIndex - 1]?.key === "score" && typeof cell.value === "number") {
          cell.numFmt = "0.0";
        }
      });
    });

    worksheet.autoFilter = {
      from: { row: headerRowNumber, column: 1 },
      to: { row: headerRowNumber + reportRows.value.length, column: lastColumn },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeReport.value}-report-${normalizeDate(new Date())}.xlsx`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    showToast(
      `មិនអាចនាំចេញ Excel បានទេ៖ ${error.message || "មានបញ្ហាមិនស្គាល់មូលហេតុ។"}`,
      "error"
    );
  } finally {
    exporting.value = false;
  }
};

onMounted(loadReports);
</script>

<template>
  <main class="reports-page">
    <header class="reports-header">
      <div>
        <span class="reports-eyebrow"><i class="bi bi-file-earmark-bar-graph"></i> របាយការណ៍សាលា</span>
        <h1>របាយការណ៍</h1>
        <p>មើល និងនាំចេញរបាយការណ៍សមិទ្ធផលសិក្សារបស់សាលា។</p>
      </div>
      <BaseButton
        variant="primary"
        icon="bi bi-download"
        type="button"
        :disabled="loading || exporting || Boolean(loadError) || !reportRows.length"
        :loading="exporting"
        @click="exportExcel"
      >
        {{ exporting ? "កំពុងរៀបចំ Excel..." : "នាំចេញ Excel" }}
      </BaseButton>
    </header>

    <section class="reports-panel">
      <nav class="report-tabs" aria-label="ប្រភេទរបាយការណ៍">
        <button
          v-for="item in reportTypes"
          :key="item.id"
          type="button"
          class="report-tab"
          :class="{ active: activeReport === item.id }"
          :aria-pressed="activeReport === item.id"
          @click="activeReport = item.id"
        >
          <i :class="['bi', item.icon]" aria-hidden="true"></i>
          {{ item.label }}
          <span class="tab-count">
            {{ item.id === "attendance" ? attendance.length : item.id === "students" ? students.length : scores.length }}
          </span>
        </button>
      </nav>

      <div class="report-filters">
        <label>
          <span>ថ្នាក់</span>
          <select v-model="selectedClass">
            <option value="">គ្រប់ថ្នាក់</option>
            <option v-for="item in classes" :key="item.id" :value="String(item.id)">
              {{ item.name }}
            </option>
          </select>
        </label>

        <label v-if="activeReport === 'attendance'">
          <span>រយៈពេល</span>
          <select v-model="selectedPeriod">
            <option v-for="period in periods" :key="period.value" :value="period.value">
              {{ period.label }}
            </option>
          </select>
        </label>

        <label v-else-if="activeReport === 'scores'">
          <span>ឆមាស</span>
          <select v-model="selectedSemester">
            <option value="">គ្រប់ឆមាស</option>
            <option v-for="semester in availableSemesters" :key="semester" :value="semester">
              {{ semester }}
            </option>
          </select>
        </label>
      </div>

      <div v-if="loadError" class="report-error" role="alert">
        <span><i class="bi bi-exclamation-circle"></i> {{ loadError }}</span>
        <BaseButton variant="outline" type="button" @click="loadReports">សាកល្បងម្ដងទៀត</BaseButton>
      </div>
      <div v-else-if="loading" class="report-loading" role="status">
        <span class="report-spinner"></span>
        កំពុងទាញយកទិន្នន័យរបាយការណ៍...
      </div>
      <template v-else>
        <section class="report-summary">
          <div class="summary-heading">
            <div>
              <span class="summary-kicker">សង្ខេបទិន្នន័យ</span>
              <h2>{{ activeReport === "attendance" ? "សង្ខេបវត្តមាន" : activeReport === "students" ? "សង្ខេបសិស្ស" : "សង្ខេបពិន្ទុ" }}</h2>
            </div>
            <span class="data-count"><i class="bi bi-database-check"></i> ទិន្នន័យផ្ទាល់ · {{ reportRows.length }} ជួរ</span>
          </div>
          <div class="summary-metrics">
            <article v-for="item in summaryItems" :key="item.label" class="metric-card" :class="item.tone">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>
        </section>

        <section class="report-preview">
          <div class="preview-heading">
            <div class="preview-icon">
              <i :class="['bi', reportTypes.find((item) => item.id === activeReport)?.icon]" aria-hidden="true"></i>
            </div>
            <div>
              <h2>មើលរបាយការណ៍ជាមុន</h2>
              <p>{{ reportTitle }} · {{ selectedClassName }}<template v-if="activeReport === 'attendance'"> · {{ periodLabel }}</template><template v-if="activeReport === 'scores' && selectedSemester"> · {{ selectedSemester }}</template></p>
            </div>
          </div>

          <div class="report-table-wrap">
            <table class="report-table">
              <thead>
                <tr>
                  <th v-for="column in reportColumns" :key="column.key">{{ column.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in visibleReportRows" :key="`${row.studentCode}-${row.date || row.subject || index}`">
                  <td v-for="column in reportColumns" :key="column.key">
                    <span
                      v-if="column.key === 'status'"
                      class="report-status"
                      :class="row.status === 'មានវត្តមាន' ? 'present' : row.status === 'អវត្តមាន' ? 'absent' : 'late'"
                    >{{ row.status }}</span>
                    <span v-else-if="column.key === 'score'" class="report-score">{{ Number(row.score).toFixed(1) }}</span>
                    <template v-else>{{ row[column.key] || "—" }}</template>
                  </td>
                </tr>
                <tr v-if="!reportRows.length">
                  <td class="empty-report" :colspan="reportColumns.length">
                    មិនមានទិន្នន័យសម្រាប់លក្ខខណ្ឌដែលបានជ្រើសទេ។
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer class="preview-footer">
            <span>សរុប {{ reportRows.length }} កំណត់ត្រា</span>
            <span>{{ reportTitle }} · {{ selectedClassName }}</span>
          </footer>
          <BasePagination
            v-model:current-page="reportPage"
            :total-items="reportRows.length"
            :page-size="reportPageSize"
          />
        </section>
      </template>
    </section>
  </main>
</template>

<style scoped>
.reports-page {
  min-height: calc(100vh - 70px);
  padding: clamp(18px, 3vw, 34px);
  color: #23372d;
}

.reports-header,
.report-tabs,
.report-tab,
.summary-heading,
.preview-heading,
.preview-footer {
  display: flex;
}

.reports-header {
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.reports-header > div:first-child {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.reports-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 7px;
  color: #16834b;
  font-size: 12px;
  font-weight: 700;
}

.reports-header h1 {
  margin: 0;
  color: #1b2d25;
  font-size: 26px;
  font-weight: 700;
}

.reports-header p {
  margin: 5px 0 0;
  color: #73857c;
  font-size: 13px;
}

.reports-panel {
  overflow: hidden;
  border: 1px solid #e1ebe5;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 28px rgb(23 70 49 / 5%);
}

.report-tabs {
  align-items: center;
  gap: 8px;
  margin: 0 24px;
  padding: 18px 0;
  border-bottom: 1px solid #edf2ef;
}

.report-tab {
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #617269;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition: background .18s ease, color .18s ease, border-color .18s ease;
}

.report-tab:hover {
  background: #f2f7f4;
  color: #176b3e;
}

.report-tab.active {
  border-color: #b7dfc3;
  background: #eaf7ee;
  color: #146b3c;
}

.tab-count {
  display: inline-grid;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  place-items: center;
  border-radius: 999px;
  background: rgb(255 255 255 / 75%);
  color: inherit;
  font-size: 10px;
}

.report-filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 18px 24px;
}

.report-filters label {
  display: grid;
  gap: 7px;
  color: #65756c;
  font-size: 12px;
  font-weight: 600;
}

.report-filters select {
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid #dfe8e3;
  border-radius: 10px;
  background: #fbfdfb;
  color: #2f4238;
  font: inherit;
  font-size: 13px;
}

.report-summary,
.report-preview {
  margin: 0 24px 22px;
  padding: 18px;
  border: 1px solid #e8efeb;
  border-radius: 14px;
  background: #fcfdfc;
}

.summary-heading {
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 15px;
}

.summary-kicker {
  color: #85938b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.summary-heading h2,
.preview-heading h2 {
  margin: 3px 0 0;
  color: #22372c;
  font-size: 16px;
  font-weight: 700;
}

.data-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef6f0;
  color: #52705e;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.summary-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  display: grid;
  gap: 8px;
  min-height: 90px;
  align-content: center;
  padding: 14px;
  border: 1px solid #e9efeb;
  border-radius: 11px;
  background: #fff;
}

.metric-card > span {
  color: #74847b;
  font-size: 12px;
}

.metric-card strong {
  color: #23372d;
  font-size: 24px;
  line-height: 1;
}

.metric-card.success strong {
  color: #16834b;
}

.metric-card.danger strong {
  color: #cc4650;
}

.metric-card.warning strong {
  color: #bb7718;
}

.preview-heading {
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.preview-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 12px;
  background: #eaf7ee;
  color: #16834b;
  font-size: 18px;
}

.preview-heading p {
  margin: 4px 0 0;
  color: #839188;
  font-size: 11px;
}

.report-table-wrap {
  overflow-x: auto;
  border: 1px solid #e8efeb;
  border-radius: 10px;
}

.report-table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  text-align: left;
}

.report-table th,
.report-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #edf2ef;
  color: #52645a;
  font-size: 12px;
}

.report-table th {
  background: #f4f8f5;
  color: #53675b;
  font-weight: 700;
  white-space: nowrap;
}

.report-table tbody tr:last-child td {
  border-bottom: 0;
}

.report-table tbody tr:hover {
  background: #f7faf8;
}

.report-status {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.report-status.present {
  background: #e5f5e9;
  color: #187343;
}

.report-status.absent {
  background: #fff0f0;
  color: #b83c45;
}

.report-status.late {
  background: #fff5df;
  color: #986516;
}

.report-score {
  color: #16834b;
  font-weight: 700;
}

.empty-report {
  padding: 28px !important;
  color: #88958e !important;
  text-align: center;
}

.preview-footer {
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  color: #85938b;
  font-size: 10px;
}

.report-error,
.report-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 8px 24px 24px;
  padding: 28px 16px;
  border-radius: 12px;
  background: #f6f9f7;
  color: #65756c;
  font-size: 13px;
}

.report-error {
  justify-content: space-between;
  border: 1px solid #f1d0d0;
  background: #fff7f7;
  color: #a53d43;
}

.report-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #b8d8c2;
  border-top-color: #16834b;
  border-radius: 50%;
  animation: report-spin .75s linear infinite;
}

@keyframes report-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 760px) {
  .reports-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .report-tabs {
    overflow-x: auto;
    margin: 0 16px;
  }

  .report-tab {
    flex: 0 0 auto;
  }

  .report-filters {
    padding: 16px;
  }

  .report-summary,
  .report-preview {
    margin-right: 16px;
    margin-left: 16px;
  }
}

@media (max-width: 480px) {
  .report-filters {
    grid-template-columns: 1fr;
  }

  .summary-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .preview-footer {
    flex-direction: column;
  }
}
</style>
