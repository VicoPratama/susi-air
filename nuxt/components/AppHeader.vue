<template>
  <header class="app-header">
    <div class="header-top">
      <div class="brand">
        <img src="/susiair-logo.png" alt="Susi Air Logo" class="brand-logo" />
        <div class="brand-text">
          <span class="brand-name">SUSI AIR</span>
          <span class="app-badge">PILOT OPS</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="logout-btn" title="Sign Out" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="pilot-profile-card">
      <div class="avatar-wrap">
        <img
          :src="avatarSrc"
          :alt="pilotName"
          class="pilot-avatar"
          @error="handleAvatarError"
        />
        <div class="status-dot" title="Active Duty"></div>
      </div>

      <div class="pilot-info">
        <div class="greeting">{{ greetingText }}</div>
        <h1 class="pilot-name">{{ pilotName }}</h1>
        <div class="pilot-meta">
          <span class="rank-badge">Captain</span>
          <span class="divider">•</span>
          <span class="base-badge">Base: MKW / Jakarta</span>
        </div>
      </div>

      <div class="flight-hours-pill">
        <div class="pill-label">TOTAL HOURS</div>
        <div class="pill-value num-bold">{{ formattedTotalHours }}<span class="unit">h</span></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const pilotName = computed(() => {
  return authStore.profile?.name || authStore.user?.name || 'Capt. John Doe'
})

const totalHours = computed(() => {
  return authStore.profile?.totalFlightHours ?? 1444.5
})

const formattedTotalHours = computed(() => {
  return totalHours.value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })
})

const defaultAvatar = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
const avatarSrc = ref(authStore.profile?.avatarUrl || defaultAvatar)

const handleAvatarError = () => {
  avatarSrc.value = defaultAvatar
}

const greetingText = computed(() => {
  return 'Operational Dashboard'
})

const handleLogout = () => {
  authStore.promptLogout()
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.app-header {
  background: linear-gradient(180deg, #07121F 0%, #0E2138 100%);
  color: #FFFFFF;
  padding: 16px 20px 24px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 10px 25px rgba(14, 33, 56, 0.25);
  position: relative;
  z-index: 10;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;

  .brand-logo {
    height: 32px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .brand-text {
    display: flex;
    flex-direction: column;

    .brand-name {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #FFFFFF;
      line-height: 1.1;
    }

    .app-badge {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1px;
      color: $color-brand-red;
    }
  }
}

.header-actions {
  .logout-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #94A3B8;
    width: 36px;
    height: 36px;
    border-radius: $radius-pill;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background: rgba(230, 55, 87, 0.2);
      color: #FFFFFF;
      border-color: rgba(230, 55, 87, 0.4);
    }
  }
}

.pilot-profile-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 16px;
  border-radius: $radius-lg;

  .avatar-wrap {
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;

    .pilot-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid $color-brand-red;
    }

    .status-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      background-color: $color-success;
      border-radius: 50%;
      border: 2px solid #0E2138;
    }
  }

  .pilot-info {
    flex: 1;
    min-width: 0;

    .greeting {
      font-size: 11px;
      color: #94A3B8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .pilot-name {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
      margin: 2px 0 4px;
    }

    .pilot-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #CBD5E1;

      .rank-badge {
        background: rgba(34, 197, 232, 0.15);
        color: #38BDF8;
        padding: 1px 6px;
        border-radius: 4px;
        font-weight: 600;
      }

      .divider {
        color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .flight-hours-pill {
    background: rgba(14, 33, 56, 0.85);
    border: 1px solid rgba(34, 197, 232, 0.3);
    padding: 8px 12px;
    border-radius: $radius-md;
    text-align: right;
    flex-shrink: 0;

    .pill-label {
      font-size: 9px;
      color: #94A3B8;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .pill-value {
      font-size: 16px;
      color: #22C5E8;
      line-height: 1.1;

      .unit {
        font-size: 11px;
        font-weight: 500;
        margin-left: 2px;
        color: #94A3B8;
      }
    }
  }
}
</style>
