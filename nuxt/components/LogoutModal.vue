<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="authStore.showLogoutModal" class="logout-modal-overlay" @click="authStore.cancelLogout">
        <div class="logout-modal-dialog card" @click.stop>
          <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
          </div>

          <h3 class="modal-title">Sign Out Crew Portal</h3>
          <p class="modal-desc">
            Are you sure you want to end your current pilot ops session? You will need to enter your crew credentials to sign back in.
          </p>

          <div class="modal-actions">
            <button class="btn-cancel" @click="authStore.cancelLogout">
              Cancel
            </button>
            <button class="btn-signout btn-primary" @click="authStore.confirmLogout">
              Yes, Sign Out
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.logout-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 18, 31, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.logout-modal-dialog {
  width: 100%;
  max-width: 380px;
  background: #FFFFFF;
  border-radius: $radius-xl;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(14, 33, 56, 0.4);
  border: 1px solid rgba(14, 33, 56, 0.08);
  transform-origin: center;
  animation: popIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  .icon-circle {
    width: 60px;
    height: 60px;
    background: #FFF1F2;
    color: $color-brand-red;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    border: 1px solid rgba(230, 55, 87, 0.2);
    box-shadow: 0 8px 16px rgba(230, 55, 87, 0.15);
  }

  .modal-title {
    font-size: 18px;
    font-weight: 800;
    color: $color-primary-navy;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .modal-desc {
    font-size: 13px;
    color: $color-text-secondary;
    line-height: 1.5;
    margin-bottom: 24px;
  }

  .modal-actions {
    display: flex;
    gap: 12px;

    button {
      flex: 1;
      height: 44px;
      border-radius: $radius-pill;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all $transition-fast;
    }

    .btn-cancel {
      background: #F1F5F9;
      color: #475569;
      border: 1px solid #E2E8F0;

      &:hover {
        background: #E2E8F0;
        color: $color-primary-navy;
      }
    }

    .btn-signout {
      background: $color-brand-red;
      color: #FFFFFF;
      border: none;
      box-shadow: 0 4px 12px rgba(230, 55, 87, 0.3);

      &:hover {
        background: $color-brand-red-hover;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(230, 55, 87, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// Transitions
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
