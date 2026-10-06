<template>
  <div class="home-page">
    <!-- Header with Pilot Profile & Total Hours -->
    <AppHeader />

    <!-- Operational Dashboard Content -->
    <div class="dashboard-content">
      <!-- Section: Hours to Limit Cards -->
      <LimitCards :limitData="chartSummary?.limitCards" />

      <!-- Section: Flight Hours Rolling Trend Chart -->
      <FlightHoursChart
        @data-loaded="handleChartDataLoaded"
      />

      <!-- Section: Pilot Documents & Expiry Monitoring -->
      <DocumentsList />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlightHoursSummaryResponse } from '~/types'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const chartSummary = ref<FlightHoursSummaryResponse | null>(null)

function handleChartDataLoaded(data: FlightHoursSummaryResponse) {
  chartSummary.value = data
}

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.profile) {
    await authStore.fetchProfile()
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
}

.dashboard-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
}
</style>
