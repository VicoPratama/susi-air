<template>
  <div class="limit-cards-section">
    <div class="section-header">
      <div class="header-title-wrap">
        <h2 class="section-title">Hours to Limit</h2>
        <span class="regulatory-tag">DGCA & Airline Limits</span>
      </div>
    </div>

    <div class="cards-grid">
      <div
        v-for="item in cards"
        :key="item.key"
        class="limit-card"
        :class="getStatusClass(item.current, item.limit)"
      >
        <div class="card-top">
          <span class="card-name">{{ item.name }}</span>
          <span class="window-badge">{{ item.window }}</span>
        </div>

        <div class="card-value-wrap">
          <div class="current-val num-bold">
            {{ formatHours(item.current) }}<span class="unit">h</span>
          </div>
          <div class="limit-val">
            / {{ item.limit }}h max
          </div>
        </div>

        <div class="progress-bar-bg">
          <div
            class="progress-bar-fill"
            :style="{ width: `${Math.min(100, (item.current / item.limit) * 100)}%` }"
          ></div>
        </div>

        <div class="card-bottom">
          <span class="remaining-text">
            <template v-if="item.limit - item.current > 0">
              <span class="num-bold">{{ formatHours(item.limit - item.current) }}h</span> remaining
            </template>
            <template v-else>
              <span class="num-bold text-danger">{{ formatHours(Math.abs(item.limit - item.current)) }}h</span> over limit!
            </template>
          </span>
          <span class="percent-text num-bold">
            {{ Math.round((item.current / item.limit) * 100) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  limitData?: {
    daily?: { current: number; limit: number; window: string };
    weekly?: { current: number; limit: number; window: string };
    monthly?: { current: number; limit: number; window: string };
    annual?: { current: number; limit: number; window: string };
  }
}>()

const cards = computed(() => {
  const d = props.limitData
  return [
    {
      key: 'daily',
      name: 'Daily Limit',
      window: 'Today only',
      current: d?.daily?.current ?? 4.2,
      limit: d?.daily?.limit ?? 8
    },
    {
      key: 'weekly',
      name: 'Weekly Limit',
      window: 'Rolling 7d',
      current: d?.weekly?.current ?? 24.5,
      limit: d?.weekly?.limit ?? 40
    },
    {
      key: 'monthly',
      name: 'Monthly Limit',
      window: 'Rolling 30d',
      current: d?.monthly?.current ?? 68.0,
      limit: d?.monthly?.limit ?? 100
    },
    {
      key: 'annual',
      name: 'Annual Limit',
      window: 'Rolling 365d',
      current: d?.annual?.current ?? 780.5,
      limit: d?.annual?.limit ?? 1050
    }
  ]
})

function formatHours(val: number): string {
  return (val || 0).toFixed(1)
}

function getStatusClass(current: number, limit: number): string {
  const ratio = current / limit
  if (ratio >= 1.0) return 'status-danger'
  if (ratio >= 0.85) return 'status-warning'
  return 'status-safe'
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.limit-cards-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .header-title-wrap {
    display: flex;
    align-items: baseline;
    gap: 8px;

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: $color-primary-navy;
    }

    .regulatory-tag {
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
      background: #E2E8F0;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.limit-card {
  background: #FFFFFF;
  border-radius: $radius-lg;
  border: 1px solid $color-card-border;
  padding: 14px;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: $color-success;
  }

  &.status-warning {
    &::before {
      background: $color-warning;
    }
    .progress-bar-fill {
      background: $color-warning;
    }
  }

  &.status-danger {
    &::before {
      background: $color-brand-red;
    }
    .progress-bar-fill {
      background: $color-brand-red;
    }
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;

    .card-name {
      font-size: 12px;
      font-weight: 700;
      color: $color-primary-navy;
    }

    .window-badge {
      font-size: 9px;
      font-weight: 600;
      color: #64748B;
      background: #F1F5F9;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  .card-value-wrap {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 8px;

    .current-val {
      font-size: 20px;
      color: $color-primary-navy;
      line-height: 1.1;

      .unit {
        font-size: 13px;
        font-weight: 500;
        margin-left: 2px;
      }
    }

    .limit-val {
      font-size: 11px;
      color: $color-text-secondary;
      font-weight: 500;
    }
  }

  .progress-bar-bg {
    width: 100%;
    height: 6px;
    background: #F1F5F9;
    border-radius: $radius-pill;
    overflow: hidden;
    margin-bottom: 8px;

    .progress-bar-fill {
      height: 100%;
      background: $color-success;
      border-radius: $radius-pill;
      transition: width 0.4s ease;
    }
  }

  .card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px;
    color: $color-text-secondary;

    .remaining-text {
      .text-danger {
        color: $color-brand-red;
      }
    }

    .percent-text {
      color: $color-primary-navy;
    }
  }
}
</style>
