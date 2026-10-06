<template>
  <div class="app-container">
    <!-- Top simulated system bar for mobile realism -->
    <div class="status-bar" v-if="authStore.isAuthenticated">
      <div class="status-time">09:41</div>
      <div class="status-icons">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.37 19.64 10.63 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/>
        </svg>
        <span class="battery">100%</span>
      </div>
    </div>

    <!-- Main router view -->
    <main class="main-content" :class="{ 'no-nav': !authStore.isAuthenticated }">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <BottomNav v-if="authStore.isAuthenticated && showBottomNav" />

    <!-- Global Logout Confirmation Modal -->
    <LogoutModal />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const showBottomNav = computed(() => {
  return route.path !== '/login'
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px 2px;
  background: #07121F;
  color: #94A3B8;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  user-select: none;

  .status-icons {
    display: flex;
    align-items: center;
    gap: 6px;

    .battery {
      font-size: 10px;
    }
  }
}

.no-nav {
  padding-bottom: 0 !important;
}
</style>
