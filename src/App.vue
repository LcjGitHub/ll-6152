<template>
  <a-config-provider>
    <a-layout class="layout">
      <a-layout-header class="header">
        <div class="header-inner">
          <router-link to="/" class="logo">赛鸽档案</router-link>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  text-decoration: none;
}

.logo:hover {
  color: rgb(var(--primary-6));
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}
</style>

<style>
body {
  margin: 0;
  background: var(--color-bg-1);
}
</style>
