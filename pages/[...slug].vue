<template>
  <section class="not-found">
    <div class="not-found__icon" aria-hidden="true">
      <span>:(</span>
    </div>
    <h1 class="not-found__title">Ошибка загрузки</h1>
    <p class="not-found__text">Проверьте подключение к сети<br />и повторите попытку</p>
    <button type="button" class="not-found__button" @click="retry">Повторить</button>
  </section>
</template>

<script setup>
definePageMeta({ layout: 'auth' })

useHead({ title: 'Ошибка загрузки | Skypro.Music' })

function retry() {
  window.location.reload()
}
</script>

<style scoped>
.not-found {
  width: 366px;
  min-height: 364px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 44px;
  border-radius: 12px;
  background: #ffffff;
  color: #000000;
  text-align: center;
}

.not-found__icon {
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  border-radius: 50%;
  background: #69c7ec;
  color: #1d1d1d;
  font-size: 42px;
  font-weight: 400;
  line-height: 1;
}

.not-found__title {
  margin: 0 0 14px;
  font-size: 32px;
  line-height: 36px;
  font-weight: 400;
}

.not-found__text {
  margin: 0 0 30px;
  font-size: 18px;
  line-height: 24px;
}

.not-found__button {
  width: 200px;
  height: 52px;
  border: 0;
  border-radius: 6px;
  background: #580ea2;
  color: #ffffff;
  font: inherit;
  font-size: 18px;
  cursor: pointer;
}

.not-found__button:hover,
.not-found__button:focus-visible {
  background: #6f18c1;
}

@media (max-width: 440px) {
  .not-found {
    width: 100%;
  }
}
</style>
