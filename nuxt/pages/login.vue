<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo-container">
        <img src="/susiair-logo.png" alt="Susi Air Logo" class="brand-logo" />
      </div>
      <h1 class="portal-title">PILOT CREW PORTAL</h1>
      <p class="portal-subtitle">PT ASI Pudjiastuti Aviation</p>
    </div>

    <div class="login-card card">
      <div class="card-header-text">
        <h2>Sign In to Ops</h2>
        <p>Enter your crew credentials to access flight limits and schedules.</p>
      </div>

      <!-- Error Alert -->
      <div v-if="authStore.error" class="error-alert" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ authStore.error }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username">Username / ID</label>
          <div class="input-wrap">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="e.g. johndoe"
              required
              autocomplete="username"
              :disabled="authStore.isLoading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrap">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter password"
              required
              autocomplete="current-password"
              :disabled="authStore.isLoading"
            />
            <button
              type="button"
              class="eye-btn"
              @click="showPassword = !showPassword"
              title="Toggle password visibility"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-.722-3.25"/>
                <path d="M2 8a10.645 10.645 0 0 0 20 0"/>
                <path d="m20 15-1.726-2.05"/>
                <path d="m4 15 1.726-2.05"/>
                <path d="m9 18 .722-3.25"/>
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="btn-primary login-btn"
          :disabled="authStore.isLoading"
        >
          <span v-if="authStore.isLoading" class="btn-spinner"></span>
          <span v-else>Sign In</span>
          <svg v-if="!authStore.isLoading" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </form>

      <!-- Quick Fill Credentials helper for reviewer testing -->
      <div class="demo-credentials-box">
        <div class="demo-title">
          <span>Test Account:</span>
          <button class="fill-btn" @click="fillDemoAccount">Use Test Account</button>
        </div>
        <div class="demo-details">
          <code>User: johndoe</code>
          <code>Pass: susiairtest</code>
        </div>
      </div>
    </div>

    <footer class="login-footer">
      <p>&copy; 2026 PT ASI Pudjiastuti Aviation. Susi Air Pilot Operations.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const form = reactive({
  username: 'johndoe',
  password: 'susiairtest'
})

const showPassword = ref(false)

function fillDemoAccount() {
  form.username = 'johndoe'
  form.password = 'susiairtest'
}

async function handleSubmit() {
  const success = await authStore.login(form.username, form.password)
  if (success) {
    navigateTo('/')
  }
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.login-page {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 20%, #132D4C 0%, #07121F 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 36px 20px 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;

  .logo-container {
    display: inline-block;
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    border-radius: $radius-xl;
    border: 1px solid rgba(255, 255, 255, 0.15);
    margin-bottom: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

    .brand-logo {
      height: 48px;
      width: auto;
      display: block;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
    }
  }

  .portal-title {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #FFFFFF;
    margin-bottom: 4px;
  }

  .portal-subtitle {
    font-size: 12px;
    color: #94A3B8;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

.login-card {
  background: #FFFFFF;
  border-radius: $radius-xl;
  padding: 24px 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  .card-header-text {
    margin-bottom: 20px;

    h2 {
      font-size: 18px;
      font-weight: 700;
      color: $color-primary-navy;
      margin-bottom: 4px;
    }

    p {
      font-size: 13px;
      color: $color-text-secondary;
      line-height: 1.4;
    }
  }
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: $color-danger-light;
  color: $color-danger;
  border: 1px solid rgba(230, 55, 87, 0.3);
  padding: 10px 14px;
  border-radius: $radius-md;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;

  svg {
    flex-shrink: 0;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 12px;
      font-weight: 600;
      color: $color-primary-navy;
    }

    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;

      .input-icon {
        position: absolute;
        left: 14px;
        color: #94A3B8;
        pointer-events: none;
      }

      input {
        width: 100%;
        height: 48px;
        padding: 0 42px 0 42px;
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: $radius-md;
        font-family: inherit;
        font-size: 14px;
        color: $color-primary-navy;
        transition: all $transition-fast;

        &:focus {
          outline: none;
          background: #FFFFFF;
          border-color: $color-primary-navy;
          box-shadow: 0 0 0 3px rgba(14, 33, 56, 0.1);
        }

        &::placeholder {
          color: #94A3B8;
        }
      }

      .eye-btn {
        position: absolute;
        right: 12px;
        background: transparent;
        border: none;
        color: #94A3B8;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;

        &:hover {
          color: $color-primary-navy;
        }
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 48px;
    margin-top: 8px;
    font-size: 15px;

    .btn-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.demo-credentials-box {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #E2E8F0;

  .demo-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    color: #64748B;
    margin-bottom: 8px;

    .fill-btn {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      color: $color-primary-navy;
      padding: 2px 8px;
      cursor: pointer;

      &:hover {
        background: #E2E8F0;
      }
    }
  }

  .demo-details {
    display: flex;
    gap: 8px;

    code {
      flex: 1;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      color: #334155;
      text-align: center;
    }
  }
}

.login-footer {
  text-align: center;
  padding: 16px 0;
  font-size: 11px;
  color: #64748B;
}
</style>
