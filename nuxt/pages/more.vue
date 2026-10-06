<template>
  <div class="more-page">
    <header class="page-top-header">
      <h1 class="page-title">Settings & Ops Info</h1>
      <p class="page-subtitle">Crew portal configurations & support</p>
    </header>

    <div class="content-body">
      <!-- Pilot Account Quick Card -->
      <div class="account-card card">
        <div class="user-row">
          <div class="user-avatar">JD</div>
          <div class="user-info">
            <div class="name num-bold">{{ authStore.profile?.name || 'Capt. John Doe' }}</div>
            <div class="role">Pilot in Command (Cessna Grand Caravan / Pilatus PC-6)</div>
          </div>
        </div>
      </div>

      <!-- Quick Links Group -->
      <div class="links-group card">
        <div class="group-title">Aviation & Ops Tools</div>
        
        <div class="link-item">
          <div class="link-label">
            <span class="icon">✈️</span>
            <span>Flight Duty Period (FDP) Calculator</span>
          </div>
          <span class="tag">CASR 121</span>
        </div>

        <div class="link-item">
          <div class="link-label">
            <span class="icon">🌦️</span>
            <span>METAR / TAF Weather Radar</span>
          </div>
          <span class="tag">Live Feed</span>
        </div>

        <div class="link-item">
          <div class="link-label">
            <span class="icon">📄</span>
            <span>Company NOTAMs & Bulletins</span>
          </div>
          <span class="tag">Updated</span>
        </div>
      </div>

      <!-- System Info -->
      <div class="links-group card">
        <div class="group-title">Application Info</div>
        <div class="info-row">
          <span>App Version</span>
          <span class="val">v1.0.4-pilot-release</span>
        </div>
        <div class="info-row">
          <span>Operational Date Anchor</span>
          <span class="val num-bold">15 May 2026</span>
        </div>
        <div class="info-row">
          <span>Backend API</span>
          <span class="val">NestJS REST Service</span>
        </div>
      </div>

      <!-- Logout Action -->
      <button class="logout-full-btn" @click="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
        <span>Sign Out Crew Account</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

function handleLogout() {
  if (confirm('Confirm sign out?')) {
    authStore.logout()
  }
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.more-page {
  display: flex;
  flex-direction: column;
}

.page-top-header {
  background: linear-gradient(180deg, #07121F 0%, #0E2138 100%);
  color: #FFFFFF;
  padding: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  .page-title {
    font-size: 18px;
    font-weight: 800;
  }

  .page-subtitle {
    font-size: 12px;
    color: #94A3B8;
  }
}

.content-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.account-card {
  padding: 16px;

  .user-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-avatar {
      width: 44px;
      height: 44px;
      background: $color-primary-navy;
      color: #FFFFFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 15px;
      border: 2px solid $color-brand-red;
    }

    .user-info {
      .name {
        font-size: 15px;
        color: $color-primary-navy;
      }

      .role {
        font-size: 11px;
        color: $color-text-secondary;
      }
    }
  }
}

.links-group {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .group-title {
    font-size: 12px;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #F1F5F9;
    padding-bottom: 6px;
  }

  .link-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;

    .link-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: $color-primary-navy;
      font-weight: 500;

      .icon {
        font-size: 16px;
      }
    }

    .tag {
      font-size: 10px;
      font-weight: 700;
      background: #F1F5F9;
      color: #64748B;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: $color-text-secondary;

    .val {
      color: $color-primary-navy;
      font-weight: 500;
    }
  }
}

.logout-full-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #FFF1F2;
  color: $color-danger;
  border: 1px solid rgba(230, 55, 87, 0.2);
  padding: 12px;
  border-radius: $radius-lg;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: all $transition-fast;

  &:hover {
    background: $color-danger;
    color: #FFFFFF;
  }
}
</style>
