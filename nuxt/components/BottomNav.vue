<template>
  <nav class="bottom-nav" aria-label="Bottom Navigation">
    <NuxtLink to="/" class="nav-item" :class="{ active: route.path === '/' }">
      <div class="icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <span>Home</span>
    </NuxtLink>

    <NuxtLink to="/schedule" class="nav-item" :class="{ active: route.path === '/schedule' }">
      <div class="icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      </div>
      <span>Schedule</span>
    </NuxtLink>

    <NuxtLink to="/logbook" class="nav-item" :class="{ active: route.path === '/logbook' }">
      <div class="icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-.05"/>
          <path d="M6 6h10"/>
          <path d="M6 10h10"/>
          <path d="M6 14h6"/>
        </svg>
      </div>
      <span>Logbook</span>
    </NuxtLink>

    <NuxtLink to="/more" class="nav-item" :class="{ active: route.path === '/more' }">
      <div class="icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="5" cy="12" r="1"/>
        </svg>
      </div>
      <span>More</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 68px;
  background: #0E2138;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
  z-index: 50;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.25);

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #94A3B8;
    text-decoration: none;
    font-size: 11px;
    font-weight: 500;
    padding: 8px 0;
    transition: all $transition-fast;
    position: relative;

    .icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform $transition-fast;
    }

    &:hover {
      color: #E2E8F0;
    }

    &.active {
      color: #FFFFFF;
      font-weight: 700;

      .icon-wrap {
        color: $color-brand-red;
        transform: translateY(-2px);
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 4px;
        width: 16px;
        height: 3px;
        background-color: $color-brand-red;
        border-radius: $radius-pill;
      }
    }
  }
}
</style>
