<template>
  <div class="chart-container card">
    <div class="chart-header">
      <div class="title-group">
        <h3 class="chart-title">Flight Hours Trend</h3>
        <p class="chart-subtitle">Rolling regulatory sum (Today centered: 15 May 2026)</p>
      </div>

      <!-- Range Toggles -->
      <div class="range-toggles" role="tablist">
        <button
          v-for="r in ranges"
          :key="r.key"
          class="toggle-btn"
          :class="{ active: currentRange === r.key }"
          role="tab"
          :aria-selected="currentRange === r.key"
          @click="selectRange(r.key)"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <!-- Chart Visual State -->
    <div class="chart-body" ref="chartWrapper">
      <div v-if="loading" class="chart-loading">
        <div class="spinner"></div>
        <span>Calculating rolling limits...</span>
      </div>

      <div v-else-if="error" class="chart-error">
        <span>{{ error }}</span>
        <button class="btn-secondary" @click="fetchData(currentRange)">Retry</button>
      </div>

      <div v-else class="svg-wrap">
        <!-- SVG Interactive Chart -->
        <svg
          :viewBox="`0 0 ${width} ${height}`"
          class="chart-svg"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleMouseLeave"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#22C5E8" stop-opacity="0.35" />
              <stop offset="60%" stop-color="#22C5E8" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#22C5E8" stop-opacity="0.0" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Background Horizontal Grid Lines -->
          <g class="grid-lines">
            <line
              v-for="tick in yTicks"
              :key="'grid-' + tick"
              :x1="padding.left"
              :y1="getY(tick)"
              :x2="width - padding.right"
              :y2="getY(tick)"
              stroke="#E2E8F0"
              stroke-width="1"
              stroke-dasharray="3 3"
            />
          </g>

          <!-- Y-Axis Labels -->
          <g class="y-labels">
            <text
              v-for="tick in yTicks"
              :key="'label-' + tick"
              :x="padding.left - 8"
              :y="getY(tick) + 4"
              text-anchor="end"
              class="axis-text"
            >
              {{ tick }}h
            </text>
          </g>

          <!-- Red Limit Line -->
          <g class="limit-line-group" v-if="limitLineY >= padding.top && limitLineY <= height - padding.bottom">
            <line
              :x1="padding.left"
              :y1="limitLineY"
              :x2="width - padding.right"
              :y2="limitLineY"
              stroke="#E63757"
              stroke-width="1.8"
              stroke-dasharray="5 4"
            />
            <rect
              :x="width - padding.right - 88"
              :y="limitLineY - 18"
              width="88"
              height="16"
              rx="3"
              fill="#E63757"
            />
            <text
              :x="width - padding.right - 44"
              :y="limitLineY - 6"
              text-anchor="middle"
              fill="#FFFFFF"
              font-size="9"
              font-weight="700"
              letter-spacing="0.5px"
            >
              LIMIT: {{ currentLimit }}h
            </text>
          </g>

          <!-- Center Today Vertical Highlight Guide -->
          <g class="today-marker-group" v-if="todayPoint">
            <line
              :x1="todayPoint.x"
              :y1="padding.top"
              :x2="todayPoint.x"
              :y2="height - padding.bottom"
              stroke="#22C5E8"
              stroke-width="1.2"
              stroke-dasharray="2 2"
              opacity="0.7"
            />
          </g>

          <!-- Area Gradient Fill -->
          <path :d="areaPathD" fill="url(#areaGradient)" />

          <!-- Main Smooth Line -->
          <path
            :d="linePathD"
            fill="none"
            stroke="#0284C7"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Data Points (Circles) -->
          <g class="data-points">
            <g
              v-for="(pt, idx) in plottedPoints"
              :key="'pt-' + idx"
            >
              <circle
                :cx="pt.x"
                :cy="pt.y"
                :r="pt.isToday ? 5.5 : 3.5"
                :fill="pt.isToday ? '#E63757' : (pt.isOverLimit ? '#E63757' : '#0284C7')"
                :stroke="pt.isToday ? '#FFFFFF' : '#FFFFFF'"
                stroke-width="2"
                class="data-circle"
              />
              <circle
                v-if="pt.isToday"
                :cx="pt.x"
                :cy="pt.y"
                r="9"
                fill="none"
                stroke="#E63757"
                stroke-width="1.5"
                opacity="0.5"
              />
            </g>
          </g>

          <!-- Active Hover Indicator -->
          <g v-if="hoveredPoint" class="hover-group">
            <line
              :x1="hoveredPoint.x"
              :y1="padding.top"
              :x2="hoveredPoint.x"
              :y2="height - padding.bottom"
              stroke="#0E2138"
              stroke-width="1"
              stroke-dasharray="2 2"
            />
            <circle
              :cx="hoveredPoint.x"
              :cy="hoveredPoint.y"
              r="6.5"
              fill="#0E2138"
              stroke="#FFFFFF"
              stroke-width="2.5"
            />
          </g>

          <!-- X-Axis Labels -->
          <g class="x-labels">
            <text
              v-for="(pt, idx) in xLabelPoints"
              :key="'xlabel-' + idx"
              :x="pt.x"
              :y="height - 8"
              text-anchor="middle"
              class="axis-text"
              :class="{ 'today-label': pt.isToday }"
            >
              {{ pt.label }}
            </text>
          </g>
        </svg>

        <!-- Interactive Tooltip Overlay -->
        <div
          v-if="hoveredPoint"
          class="chart-tooltip"
          :style="{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100}%`
          }"
        >
          <div class="tooltip-header">
            <span>{{ hoveredPoint.data.date }}</span>
            <span v-if="hoveredPoint.data.isToday" class="today-tag">TODAY</span>
          </div>
          <div class="tooltip-body">
            <div class="metric-row">
              <span class="label">Rolling Sum ({{ currentRange }}):</span>
              <span class="val num-bold" :class="{ 'over-limit': hoveredPoint.data.rollingSum > currentLimit }">
                {{ hoveredPoint.data.rollingSum.toFixed(1) }}h
              </span>
            </div>
            <div class="metric-row">
              <span class="label">Daily Flight:</span>
              <span class="val num-bold">{{ hoveredPoint.data.flightHours.toFixed(1) }}h</span>
            </div>
            <div class="metric-row status-row">
              <span class="label">Limit Target:</span>
              <span class="val">{{ currentLimit }}h (Max: {{ currentMax }}h)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Legend Footer -->
    <div class="chart-footer">
      <div class="legend-item">
        <span class="legend-dot current-line"></span>
        <span>Rolling {{ currentRangeLabel }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot limit-line"></span>
        <span>Limit ({{ currentLimit }}h)</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot today-dot"></span>
        <span>Today (Centered)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlightHoursSummaryResponse, FlightHoursDataPoint } from '~/types'
import { useApi } from '~/composables/useApi'

const props = defineProps<{
  initialRange?: '1w' | '1m' | '3m' | '6m' | '1y'
}>()

const emit = defineEmits<{
  (e: 'update:range', range: string): void
  (e: 'data-loaded', data: FlightHoursSummaryResponse): void
}>()

const { fetchWithAuth } = useApi()

const ranges = [
  { key: '1w', label: '1W', windowLabel: '7 Days' },
  { key: '1m', label: '1M', windowLabel: '30 Days' },
  { key: '3m', label: '3M', windowLabel: '90 Days' },
  { key: '6m', label: '6M', windowLabel: '180 Days' },
  { key: '1y', label: '1Y', windowLabel: '365 Days' }
] as const

type RangeKey = typeof ranges[number]['key']

const currentRange = ref<RangeKey>(props.initialRange || '1w')
const loading = ref(true)
const error = ref<string | null>(null)
const summaryData = ref<FlightHoursSummaryResponse | null>(null)

// Dimensions for SVG
const width = 420
const height = 220
const padding = { top: 28, right: 16, bottom: 28, left: 38 }

// Bounds per toggle according to brief table C
const boundsConfig: Record<RangeKey, { limit: number; max: number; window: string }> = {
  '1w': { limit: 40, max: 45, window: 'Last 7 days' },
  '1m': { limit: 100, max: 125, window: 'Last 30 days' },
  '3m': { limit: 300, max: 325, window: 'Last 90 days' },
  '6m': { limit: 600, max: 625, window: 'Last 180 days' },
  '1y': { limit: 1050, max: 1200, window: 'Last 365 days' }
}

const currentLimit = computed(() => {
  return summaryData.value?.limitLine ?? boundsConfig[currentRange.value].limit
})

const currentMax = computed(() => {
  const cfgMax = summaryData.value?.chartYMax ?? boundsConfig[currentRange.value].max
  // If actual rolling sum exceeds max, adjust max so it never breaks layout
  const points = summaryData.value?.points || []
  const maxInPoints = Math.max(...points.map(p => p.rollingSum), cfgMax)
  return Math.max(cfgMax, Math.ceil(maxInPoints * 1.05))
})

const currentRangeLabel = computed(() => {
  const r = ranges.find(item => item.key === currentRange.value)
  return r?.windowLabel || currentRange.value
})

const yTicks = computed(() => {
  const max = currentMax.value
  const step = max / 4
  return [0, Math.round(step), Math.round(step * 2), Math.round(step * 3), max]
})

function getY(val: number): number {
  const chartHeight = height - padding.top - padding.bottom
  const clampedVal = Math.max(0, val)
  const ratio = clampedVal / (currentMax.value || 1)
  return height - padding.bottom - (ratio * chartHeight)
}

const limitLineY = computed(() => {
  return getY(currentLimit.value)
})

interface PlottedPoint {
  x: number;
  y: number;
  data: FlightHoursDataPoint;
  isToday: boolean;
  isOverLimit: boolean;
}

const plottedPoints = computed<PlottedPoint[]>(() => {
  const points = summaryData.value?.points || []
  if (!points.length) return []

  const chartWidth = width - padding.left - padding.right
  const count = points.length

  return points.map((p, idx) => {
    const x = padding.left + (idx / Math.max(1, count - 1)) * chartWidth
    const y = getY(p.rollingSum)
    return {
      x,
      y,
      data: p,
      isToday: !!p.isToday,
      isOverLimit: p.rollingSum > currentLimit.value
    }
  })
})

const todayPoint = computed(() => {
  return plottedPoints.value.find(p => p.isToday)
})

const xLabelPoints = computed(() => {
  const pts = plottedPoints.value
  if (!pts.length) return []
  
  // Show labels on: Start (index 0), Today (index ~ 7), End (index 14)
  const result = []
  const startPt = pts[0]
  const todayPt = pts.find(p => p.isToday) || pts[Math.floor(pts.length / 2)]
  const endPt = pts[pts.length - 1]

  if (startPt) {
    result.push({
      x: startPt.x + 8,
      label: formatShortDate(startPt.data.date),
      isToday: false
    })
  }
  if (todayPt) {
    result.push({
      x: todayPt.x,
      label: `${formatShortDate(todayPt.data.date)} (Today)`,
      isToday: true
    })
  }
  if (endPt) {
    result.push({
      x: endPt.x - 8,
      label: formatShortDate(endPt.data.date),
      isToday: false
    })
  }
  return result
})

function formatShortDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const mIndex = parseInt(parts[1], 10) - 1
  return `${parts[2]} ${monthNames[mIndex] || parts[1]}`
}

// Smooth Catmull-Rom or Bezier curve generator
const linePathD = computed(() => {
  const pts = plottedPoints.value
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`

  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? i : i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
})

const areaPathD = computed(() => {
  const pts = plottedPoints.value
  if (pts.length === 0) return ''
  const lineD = linePathD.value
  const baseline = height - padding.bottom
  const first = pts[0]
  const last = pts[pts.length - 1]
  return `${lineD} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`
})

// Hover / Touch interaction
const hoveredPoint = ref<PlottedPoint | null>(null)
const chartWrapper = ref<HTMLElement | null>(null)

function handleMouseMove(e: MouseEvent) {
  const svg = e.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  const mouseX = ((e.clientX - rect.left) / rect.width) * width
  findClosestPoint(mouseX)
}

function handleTouchStart(e: TouchEvent) {
  handleTouchMove(e)
}

function handleTouchMove(e: TouchEvent) {
  if (!e.touches[0]) return
  const touch = e.touches[0]
  const target = e.currentTarget as SVGSVGElement
  const rect = target.getBoundingClientRect()
  const touchX = ((touch.clientX - rect.left) / rect.width) * width
  findClosestPoint(touchX)
}

function findClosestPoint(targetX: number) {
  const pts = plottedPoints.value
  if (!pts.length) return

  let closest = pts[0]
  let minDist = Math.abs(pts[0].x - targetX)

  for (let i = 1; i < pts.length; i++) {
    const dist = Math.abs(pts[i].x - targetX)
    if (dist < minDist) {
      minDist = dist
      closest = pts[i]
    }
  }

  hoveredPoint.value = closest
}

function handleMouseLeave() {
  hoveredPoint.value = null
}

async function selectRange(range: RangeKey) {
  currentRange.value = range
  emit('update:range', range)
  await fetchData(range)
}

async function fetchData(range: RangeKey) {
  loading.value = true
  error.value = null

  try {
    const res = await fetchWithAuth<FlightHoursSummaryResponse>(`/flight-hours/summary?range=${range}`)
    summaryData.value = res
    emit('data-loaded', res)
  } catch (err: any) {
    console.error('Fetch flight hours error:', err)
    error.value = err?.data?.message || 'Failed to load rolling sum chart.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData(currentRange.value)
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.chart-container {
  padding: 16px;
  background: #FFFFFF;
  border-radius: $radius-lg;
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;

  .title-group {
    .chart-title {
      font-size: 16px;
      font-weight: 700;
      color: $color-primary-navy;
      line-height: 1.2;
    }

    .chart-subtitle {
      font-size: 11px;
      color: $color-text-secondary;
      margin-top: 2px;
    }
  }
}

.range-toggles {
  display: flex;
  background: #F1F5F9;
  padding: 3px;
  border-radius: $radius-pill;
  gap: 2px;

  .toggle-btn {
    flex: 1;
    border: none;
    background: transparent;
    padding: 6px 0;
    font-size: 12px;
    font-weight: 600;
    color: #64748B;
    border-radius: $radius-pill;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      color: $color-primary-navy;
    }

    &.active {
      background: $color-primary-navy;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(14, 33, 56, 0.2);
    }
  }
}

.chart-body {
  position: relative;
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-loading, .chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 0;
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

.svg-wrap {
  position: relative;
  width: 100%;
}

.chart-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
  cursor: crosshair;
}

.axis-text {
  font-size: 10px;
  fill: #94A3B8;
  font-weight: 500;

  &.today-label {
    fill: $color-brand-red;
    font-weight: 700;
  }
}

.data-circle {
  transition: r 0.15s ease;
}

.chart-tooltip {
  position: absolute;
  transform: translate(-50%, -120%);
  background: rgba(14, 33, 56, 0.95);
  backdrop-filter: blur(6px);
  color: #FFFFFF;
  padding: 8px 12px;
  border-radius: $radius-md;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 20;
  min-width: 160px;
  font-size: 11px;
  border: 1px solid rgba(255, 255, 255, 0.15);

  .tooltip-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    padding-bottom: 4px;
    color: #E2E8F0;

    .today-tag {
      background: $color-brand-red;
      color: #FFFFFF;
      font-size: 9px;
      padding: 1px 4px;
      border-radius: 3px;
      font-weight: 700;
    }
  }

  .tooltip-body {
    display: flex;
    flex-direction: column;
    gap: 3px;

    .metric-row {
      display: flex;
      justify-content: space-between;
      gap: 8px;

      .label {
        color: #94A3B8;
      }

      .val {
        color: #FFFFFF;

        &.over-limit {
          color: #F87171;
        }
      }

      &.status-row {
        margin-top: 2px;
        padding-top: 3px;
        border-top: 1px dashed rgba(255, 255, 255, 0.1);
        font-size: 10px;
        color: #CBD5E1;
      }
    }
  }
}

.chart-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #F1F5F9;
  font-size: 11px;
  color: #64748B;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;

      &.current-line {
        background: #0284C7;
      }

      &.limit-line {
        background: #E63757;
        border-radius: 2px;
        height: 3px;
        width: 12px;
      }

      &.today-dot {
        background: #E63757;
        box-shadow: 0 0 0 2px rgba(230, 55, 87, 0.3);
      }
    }
  }
}
</style>
