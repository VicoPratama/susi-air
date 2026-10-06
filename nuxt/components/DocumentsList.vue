<template>
  <div class="documents-section">
    <div class="section-header">
      <div class="header-title-wrap">
        <h2 class="section-title">My Documents</h2>
        <span class="count-badge">{{ documents.length }}</span>
      </div>
      <button class="refresh-btn" @click="fetchDocs" :disabled="loading" title="Refresh Documents">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="{ spinning: loading }"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
          <path d="M16 21h5v-5"/>
        </svg>
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !documents.length" class="doc-loading">
      <div class="doc-item skeleton" v-for="i in 4" :key="i" style="height: 64px; margin-bottom: 8px;"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error && !documents.length" class="doc-error card">
      <p>{{ error }}</p>
      <button class="btn-secondary" @click="fetchDocs">Retry</button>
    </div>

    <!-- Documents List -->
    <div v-else class="documents-list">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="doc-item card"
      >
        <div class="doc-icon-wrap" :class="`icon-${doc.status}`">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            <path d="M10 9H8"/>
            <path d="M16 13H8"/>
            <path d="M16 17H8"/>
          </svg>
        </div>

        <div class="doc-details">
          <div class="doc-label">{{ doc.label }}</div>
          <div class="doc-meta">
            <span class="expiry-date">Expires: {{ formatDate(doc.expiryDate) }}</span>
            <span class="days-remaining" :class="`days-${doc.status}`">
              {{ getRemainingText(doc.daysRemaining) }}
            </span>
          </div>
        </div>

        <div class="doc-badge-wrap">
          <span class="badge" :class="`badge-${doc.status}`">
            <span class="badge-dot"></span>
            {{ getBadgeLabel(doc.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PilotDocument, DocumentsResponse } from '~/types'
import { useApi } from '~/composables/useApi'

const { fetchWithAuth } = useApi()

const documents = ref<PilotDocument[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchDocs() {
  loading.value = true
  error.value = null
  try {
    const res = await fetchWithAuth<DocumentsResponse>('/documents')
    if (res && res.documents) {
      documents.value = res.documents
    }
  } catch (err: any) {
    console.error('Fetch documents error:', err)
    error.value = err?.data?.message || 'Unable to load pilot documents.'
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const m = parseInt(parts[1], 10) - 1
  return `${parts[2]} ${months[m] || parts[1]} ${parts[0]}`
}

function getRemainingText(days: number): string {
  if (days < 0) {
    return `Expired ${Math.abs(days)}d ago`
  } else if (days === 0) {
    return 'Expires today'
  } else {
    return `${days} days left`
  }
}

function getBadgeLabel(status: 'safe' | 'soon' | 'expired'): string {
  switch (status) {
    case 'safe':
      return 'Valid'
    case 'soon':
      return 'Expiring'
    case 'expired':
      return 'Expired'
    default:
      return status
  }
}

onMounted(() => {
  fetchDocs()
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.documents-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .header-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: $color-primary-navy;
    }

    .count-badge {
      background: #E2E8F0;
      color: $color-primary-navy;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 7px;
      border-radius: $radius-pill;
    }
  }

  .refresh-btn {
    background: transparent;
    border: none;
    color: #64748B;
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $transition-fast;

    &:hover {
      background: #E2E8F0;
      color: $color-primary-navy;
    }

    .spinning {
      animation: spin 0.8s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.doc-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #FFFFFF;
  border-radius: $radius-lg;
  border: 1px solid $color-card-border;
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateY(-1px);
    box-shadow: $shadow-md;
  }

  .doc-icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.icon-safe {
      background: $color-success-light;
      color: $color-success;
    }

    &.icon-soon {
      background: $color-warning-light;
      color: $color-warning;
    }

    &.icon-expired {
      background: $color-danger-light;
      color: $color-danger;
    }
  }

  .doc-details {
    flex: 1;
    min-width: 0;

    .doc-label {
      font-size: 13px;
      font-weight: 600;
      color: $color-primary-navy;
      line-height: 1.25;
      margin-bottom: 2px;
    }

    .doc-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: $color-text-secondary;
      flex-wrap: wrap;

      .days-remaining {
        font-weight: 600;

        &.days-safe {
          color: #0d8a64;
        }

        &.days-soon {
          color: #b45309;
        }

        &.days-expired {
          color: $color-danger;
        }
      }
    }
  }

  .doc-badge-wrap {
    flex-shrink: 0;

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  }
}
</style>
