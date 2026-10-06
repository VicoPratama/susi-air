<template>
  <div class="placeholder-page">
    <header class="page-top-header">
      <h1 class="page-title">Pilot Logbook</h1>
      <p class="page-subtitle">Flight logging & electronic journey logs</p>
    </header>

    <div class="content-body">
      <div class="placeholder-card card">
        <div class="icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-.05"/>
            <path d="M6 6h10"/>
            <path d="M6 10h10"/>
            <path d="M6 14h6"/>
          </svg>
        </div>
        <h2>Electronic Logbook (eLog)</h2>
        <p>Log entries, block time, flight duty periods, and aircraft tail logs will sync automatically with Susi Air Dispatch.</p>
        <div class="status-tag">Coming in next release</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.placeholder-page {
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
  padding: 20px;
}

.placeholder-card {
  text-align: center;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-wrap {
    color: $color-brand-red;
    background: rgba(230, 55, 87, 0.1);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  h2 {
    font-size: 17px;
    font-weight: 700;
    color: $color-primary-navy;
    margin-bottom: 8px;
  }

  p {
    font-size: 13px;
    color: $color-text-secondary;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .status-tag {
    font-size: 11px;
    font-weight: 700;
    color: #64748B;
    background: #F1F5F9;
    padding: 4px 12px;
    border-radius: $radius-pill;
  }
}
</style>
