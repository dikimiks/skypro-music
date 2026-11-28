<template>
  <main class="auth-layout">
    <slot />
  </main>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #181818;
  color: #ffffff;
  font-family: "Montserrat", sans-serif;
}

@media (max-width: 440px) {
  .auth-layout {
    padding: 16px;
  }
}
</style>
