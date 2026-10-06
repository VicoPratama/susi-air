<template>
  <div class="schedule-page">
    <!-- Top Bar -->
    <header class="schedule-header">
      <div class="header-content">
        <h1 class="page-title">Roster Schedule</h1>
        <p class="page-subtitle">Monthly Duty & Flight Assignment</p>
      </div>

      <!-- Month Navigation Controls -->
      <div class="month-navigator">
        <button
          class="nav-arrow"
          @click="prevMonth"
          :disabled="loading"
          title="Previous Month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div class="current-month-display num-bold">
          {{ monthYearLabel }}
        </div>

        <button
          class="nav-arrow"
          @click="nextMonth"
          :disabled="loading"
          title="Next Month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="schedule-content">
      <!-- Calendar Container Card -->
      <div class="calendar-card card">
        <!-- Weekday Headers -->
        <div class="weekdays-grid">
          <span v-for="w in weekdays" :key="w" class="weekday-name">{{ w }}</span>
        </div>

        <!-- Loading Overlay -->
        <div v-if="loading" class="calendar-loading">
          <div class="spinner"></div>
          <span>Loading monthly schedule...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="calendar-error">
          <p>{{ error }}</p>
          <button class="btn-secondary" @click="fetchSchedule">Retry</button>
        </div>

        <!-- Calendar Days Grid -->
        <div v-else class="days-grid">
          <!-- Leading empty padding days from previous month -->
          <div
            v-for="pad in leadingPaddingDays"
            :key="'pad-' + pad"
            class="day-cell day-empty"
          ></div>

          <!-- Active Month Days -->
          <div
            v-for="day in calendarDays"
            :key="day.dateStr"
            class="day-cell"
            :class="{
              'is-today': day.isToday,
              'has-duty': !!day.entry
            }"
            :style="getDayCellStyle(day.entry)"
            @click="handleDayClick(day)"
          >
            <!-- Top row inside cell: Day number and Status Indicator -->
            <div class="day-cell-top">
              <span class="day-number num-bold">{{ day.dayNumber }}</span>

              <!-- Duty Status Indicator -->
              <template v-if="day.entry">
                <!-- If count_logbooks === count_schedules: Tick icon -->
                <div
                  v-if="day.entry.count_logbooks === day.entry.count_schedules"
                  class="status-indicator status-tick"
                  title="All duties completed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <!-- Otherwise: Number badge of remaining duties -->
                <div
                  v-else
                  class="status-indicator status-pending"
                  title="Remaining duties to log"
                >
                  {{ Math.max(1, day.entry.count_schedules - day.entry.count_logbooks) }}
                </div>
              </template>
            </div>

            <!-- Bottom of cell: Base Name / Duty Code -->
            <div class="day-cell-bottom">
              <span v-if="day.entry" class="base-code num-bold">
                {{ day.entry.base_name || day.entry.duty_type }}
              </span>
              <span v-else class="day-off-dot">OFF</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Duty Legend Section -->
      <div class="legend-card card">
        <h3 class="legend-title">Duty Type Legend</h3>
        <div class="legend-grid">
          <div
            v-for="item in legendItems"
            :key="item.code"
            class="legend-entry"
          >
            <span
              class="legend-color-box"
              :style="{ backgroundColor: item.color }"
            ></span>
            <span class="legend-code num-bold">{{ item.code }}</span>
            <span class="legend-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Detail Modal / Placeholder Page -->
    <div v-if="selectedDay" class="modal-backdrop" @click="selectedDay = null">
      <div class="modal-card card" @click.stop>
        <div class="modal-header">
          <div class="modal-title-group">
            <h3>{{ formatFullDate(selectedDay.dateStr) }}</h3>
            <span v-if="selectedDay.isToday" class="badge badge-safe">TODAY</span>
          </div>
          <button class="close-btn" @click="selectedDay = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="selectedDay.entry" class="duty-info-panel" :style="{ borderLeftColor: selectedDay.entry.base_color }">
            <div class="info-row">
              <span class="label">Duty Assignment:</span>
              <span class="val num-bold" :style="{ color: selectedDay.entry.base_color }">
                {{ selectedDay.entry.duty_type }} ({{ getLegendLabel(selectedDay.entry.duty_type) }})
              </span>
            </div>
            <div class="info-row">
              <span class="label">Airport / Station Base:</span>
              <span class="val num-bold">{{ selectedDay.entry.base_name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Planned Schedules:</span>
              <span class="val">{{ selectedDay.entry.count_schedules }} flights/duties</span>
            </div>
            <div class="info-row">
              <span class="label">Completed Logbooks:</span>
              <span class="val">{{ selectedDay.entry.count_logbooks }} logged</span>
            </div>
            <div class="info-row">
              <span class="label">Duty Status:</span>
              <span class="val">
                <span v-if="selectedDay.entry.count_logbooks === selectedDay.entry.count_schedules" class="badge badge-safe">
                  ✓ Completed & Logged
                </span>
                <span v-else class="badge badge-soon">
                  {{ selectedDay.entry.count_schedules - selectedDay.entry.count_logbooks }} Pending Duty
                </span>
              </span>
            </div>
          </div>

          <div v-else class="off-duty-panel">
            <p>No duty assigned on this date (Scheduled OFF).</p>
          </div>

          <div class="placeholder-notice">
            <div class="notice-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <div class="notice-text">
              <strong>Detail page coming soon</strong>
              <p>Flight legs, aircraft tail numbers, and crew pairing details will be available in the upcoming release.</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-primary" @click="selectedDay = null" style="width: 100%;">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScheduleEntry, ScheduleLegendItem, ScheduleResponse } from '~/types'
import { useApi } from '~/composables/useApi'

const { fetchWithAuth } = useApi()

// Default to May 2026 as per brief requirement (Today is 15 May 2026)
const currentYear = ref(2026)
const currentMonth = ref(5)
const loading = ref(false)
const error = ref<string | null>(null)

const schedules = ref<ScheduleEntry[]>([])
const legendItems = ref<ScheduleLegendItem[]>([
  { code: 'DTY', label: 'On Duty', color: '#10B981' },
  { code: 'RLV', label: 'Requested Leave', color: '#475569' },
  { code: 'SCK', label: 'Sick', color: '#EF4444' },
  { code: 'TRD', label: 'Travel Day', color: '#FBA577' },
  { code: 'TRX', label: 'Training', color: '#F59E0B' },
  { code: 'ADM', label: 'Administration', color: '#9CA3AF' },
  { code: 'FER', label: 'Ferry', color: '#7C2D12' },
  { code: 'MED', label: 'Medical', color: '#7C3AED' },
  { code: 'REC', label: 'Recurrent', color: '#0EA5E9' },
  { code: 'ULV', label: 'Unpaid Leave', color: '#64748B' }
])

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const todayStr = '2026-05-15'

interface CalendarDay {
  dateStr: string;
  dayNumber: number;
  isToday: boolean;
  entry?: ScheduleEntry;
}

const selectedDay = ref<CalendarDay | null>(null)

const monthYearLabel = computed(() => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return `${monthNames[currentMonth.value - 1]} ${currentYear.value}`
})

const leadingPaddingDays = computed(() => {
  // Get day of week for 1st of current month (0 = Sun, 1 = Mon...)
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
  return firstDay
})

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

const calendarDays = computed<CalendarDay[]>(() => {
  const list: CalendarDay[] = []
  const count = daysInMonth.value
  const y = currentYear.value
  const m = String(currentMonth.value).padStart(2, '0')

  for (let d = 1; d <= count; d++) {
    const dStr = String(d).padStart(2, '0')
    const fullDate = `${y}-${m}-${dStr}`
    const entry = schedules.value.find(s => s.duty_date === fullDate)

    list.push({
      dateStr: fullDate,
      dayNumber: d,
      isToday: fullDate === todayStr,
      entry
    })
  }

  return list
})

function getDayCellStyle(entry?: ScheduleEntry) {
  if (!entry) return {}
  const color = entry.base_color || '#10B981'
  return {
    '--duty-color': color,
    backgroundColor: `${color}18`, // subtle tint
    borderColor: `${color}60`
  }
}

function getLegendLabel(code: string): string {
  const item = legendItems.value.find(l => l.code === code)
  return item ? item.label : code
}

function handleDayClick(day: CalendarDay) {
  selectedDay.value = day
}

function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
  fetchSchedule()
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
  fetchSchedule()
}

async function fetchSchedule() {
  loading.value = true
  error.value = null

  const mStr = String(currentMonth.value).padStart(2, '0')
  try {
    const res = await fetchWithAuth<ScheduleResponse>(`/schedules?year=${currentYear.value}&month=${mStr}`)
    if (res) {
      schedules.value = res.schedules || []
      if (res.legend && res.legend.length) {
        legendItems.value = res.legend
      }
    }
  } catch (err: any) {
    console.error('Fetch schedule error:', err)
    error.value = err?.data?.message || 'Failed to load schedule entries.'
  } finally {
    loading.value = false
  }
}

function formatFullDate(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`
}

onMounted(() => {
  fetchSchedule()
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.schedule-page {
  display: flex;
  flex-direction: column;
}

.schedule-header {
  background: linear-gradient(180deg, #07121F 0%, #0E2138 100%);
  color: #FFFFFF;
  padding: 16px 20px 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  .header-content {
    margin-bottom: 14px;

    .page-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .page-subtitle {
      font-size: 11px;
      color: #94A3B8;
    }
  }

  .month-navigator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: $radius-pill;
    padding: 4px 8px;

    .nav-arrow {
      background: transparent;
      border: none;
      color: #FFFFFF;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color $transition-fast;

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
      }

      &:disabled {
        opacity: 0.4;
      }
    }

    .current-month-display {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #FFFFFF;
    }
  }
}

.schedule-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.calendar-card {
  padding: 12px;
  background: #FFFFFF;
  border-radius: $radius-lg;
}

.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  text-align: center;

  .weekday-name {
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    padding: 4px 0;
  }
}

.calendar-loading, .calendar-error {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: $color-text-secondary;
  font-size: 13px;

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(14, 33, 56, 0.1);
    border-top-color: $color-brand-red;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-cell {
  aspect-ratio: 1 / 1.15;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: $radius-sm;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform $transition-fast, box-shadow $transition-fast, border-color $transition-fast;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.04);
    z-index: 5;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  }

  &.day-empty {
    background: transparent;
    border-color: transparent;
    pointer-events: none;
  }

  &.is-today {
    box-shadow: 0 0 0 2px $color-brand-red;
    border-color: $color-brand-red !important;

    .day-number {
      color: $color-brand-red;
    }
  }

  .day-cell-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .day-number {
      font-size: 11px;
      font-weight: 700;
      color: $color-primary-navy;
      line-height: 1;
    }

    .status-indicator {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 700;
      flex-shrink: 0;

      &.status-tick {
        background: $color-success;
        color: #FFFFFF;
      }

      &.status-pending {
        background: #F59E0B;
        color: #FFFFFF;
      }
    }
  }

  .day-cell-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 14px;

    .base-code {
      font-size: 9px;
      font-weight: 800;
      color: var(--duty-color, #10B981);
      letter-spacing: 0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .day-off-dot {
      font-size: 8px;
      color: #94A3B8;
      font-weight: 600;
    }
  }
}

.legend-card {
  padding: 14px;
  background: #FFFFFF;

  .legend-title {
    font-size: 13px;
    font-weight: 700;
    color: $color-primary-navy;
    margin-bottom: 10px;
  }

  .legend-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 12px;

    .legend-entry {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;

      .legend-color-box {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .legend-code {
        color: $color-primary-navy;
        font-size: 10px;
        min-width: 26px;
      }

      .legend-label {
        color: #475569;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

// Modal dialog
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 33, 56, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  .modal-card {
    width: 100%;
    max-width: 480px;
    background: #FFFFFF;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: 20px;
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 0.25s ease-out;

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #E2E8F0;

      .modal-title-group {
        display: flex;
        align-items: center;
        gap: 8px;

        h3 {
          font-size: 17px;
          font-weight: 700;
          color: $color-primary-navy;
        }
      }

      .close-btn {
        background: #F1F5F9;
        border: none;
        color: #64748B;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          background: #E2E8F0;
        }
      }
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .duty-info-panel {
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-left: 4px solid #10B981;
        padding: 12px 14px;
        border-radius: $radius-md;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;

          .label {
            color: #64748B;
          }

          .val {
            color: $color-primary-navy;
            text-align: right;
          }
        }
      }

      .off-duty-panel {
        background: #F8FAFC;
        border: 1px dashed #CBD5E1;
        padding: 16px;
        border-radius: $radius-md;
        text-align: center;
        font-size: 13px;
        color: #64748B;
      }

      .placeholder-notice {
        display: flex;
        gap: 12px;
        background: #FFFBEB;
        border: 1px solid #FDE68A;
        padding: 12px;
        border-radius: $radius-md;

        .notice-icon {
          color: #D97706;
          flex-shrink: 0;
        }

        .notice-text {
          font-size: 12px;
          color: #92400E;

          strong {
            display: block;
            margin-bottom: 2px;
            font-size: 13px;
          }

          p {
            line-height: 1.4;
          }
        }
      }
    }

    .modal-footer {
      margin-top: 20px;
    }
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
