<template>
  <section class="auth-card">
    <NuxtLink to="/" class="auth-card__logo" aria-label="На главную">
      <img src="/img/logo_modal.png" alt="Skypro" />
    </NuxtLink>
    <form class="auth-card__form" @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Электронная почта" autocomplete="email" />
      <div class="auth-card__password-field">
        <input
          v-model="password"
          class="auth-card__password-input"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Пароль"
          autocomplete="new-password"
        />
        <button
          type="button"
          class="auth-card__password-toggle"
          :aria-pressed="showPassword"
          :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
      <div class="auth-card__password-field">
        <input
          v-model="repeatPassword"
          class="auth-card__password-input"
          :type="showRepeatPassword ? 'text' : 'password'"
          placeholder="Повторите пароль"
          autocomplete="new-password"
        />
        <button
          type="button"
          class="auth-card__password-toggle"
          :aria-pressed="showRepeatPassword"
          :aria-label="showRepeatPassword ? 'Скрыть пароль' : 'Показать пароль'"
          @click="showRepeatPassword = !showRepeatPassword"
        >
          {{ showRepeatPassword ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
      <p v-if="errorMessage" class="auth-card__error" role="alert" aria-live="assertive">
        {{ errorMessage }}
      </p>
      <button type="submit" :disabled="pending">Зарегистрироваться</button>
      <NuxtLink to="/login" class="auth-card__secondary auth-card__secondary--compact">
        Уже есть аккаунт? Войти
      </NuxtLink>
    </form>
  </section>
</template>

<script setup>
definePageMeta({ layout: 'auth' })

import { useUserStore } from '~/store/user'
import { API_BASE } from '~/utils/music'
import { getApiErrorMessage } from '~/utils/auth'

const user = useUserStore()
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const showPassword = ref(false)
const showRepeatPassword = ref(false)
const pending = ref(false)
const errorMessage = ref('')

useHead({ title: 'Регистрация | Skypro.Music' })

async function register() {
  if (!email.value.trim() || !password.value || !repeatPassword.value) {
    errorMessage.value = 'Заполните все поля.'
    return
  }

  if (password.value !== repeatPassword.value) {
    errorMessage.value = 'Пароли не совпадают.'
    return
  }

  pending.value = true
  errorMessage.value = ''

  try {
    const signupResponse = await $fetch(`${API_BASE}/user/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        username: email.value,
        email: email.value,
        password: password.value,
      },
    })

    const tokenResponse = await $fetch(`${API_BASE}/user/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: email.value, password: password.value },
    })

    const accessToken = tokenResponse?.access ?? tokenResponse?.access_token ?? ''
    const refreshToken = tokenResponse?.refresh ?? tokenResponse?.refresh_token ?? ''

    if (!accessToken) {
      throw new Error('Сервер не выдал access-токен.')
    }

    user.setSession({
      user: signupResponse?.data ?? signupResponse,
      accessToken,
      refreshToken,
    })
    await navigateTo('/')
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'Не удалось зарегистрироваться.')
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.auth-card {
  width: 366px;
  min-height: 439px;
  box-sizing: border-box;
  padding: 43px 44px 47px;
  background: #ffffff;
  color: #000000;
  border-radius: 12px;
}

.auth-card__logo {
  display: block;
  margin: 0 auto 42px;
  width: 140px;
}

.auth-card__logo img { width: 100%; }
.auth-card__form { display: flex; flex-direction: column; gap: 30px; }

.auth-card__form input {
  height: 32px;
  border: 0;
  border-bottom: 1px solid #d0cece;
  border-radius: 0;
  background: #ffffff;
  color: #000000;
  font: inherit;
  font-size: 18px;
  line-height: 24px;
  outline: none;
}

.auth-card__form input::placeholder { color: #d0cece; opacity: 1; }

.auth-card__password-field {
  position: relative;
  height: 32px;
  border-bottom: 1px solid #d0cece;
}

.auth-card__form input.auth-card__password-input {
  width: 100%;
  padding-right: 72px;
  border-bottom: 0;
}

.auth-card__password-toggle {
  position: absolute;
  top: 50%;
  right: 0;
  height: auto;
  margin: 0;
  padding: 2px 0;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #580ea2;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}

.auth-card__form button[type="submit"] {
  height: 52px;
  margin-top: 22px;
  border: 0;
  border-radius: 6px;
  background: #580ea2;
  color: #ffffff;
  font: inherit;
  font-size: 18px;
  cursor: pointer;
}

.auth-card__secondary--compact {
  margin-top: -18px;
  color: #580ea2;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  text-decoration: none;
}

.auth-card__error {
  margin: -14px 0 0;
  padding: 10px 12px;
  border: 1px solid #e6a5a5;
  border-radius: 6px;
  background: #fff0f0;
  color: #8c0000;
  font-size: 14px;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.auth-card__form button[type="submit"]:hover,
.auth-card__form button[type="submit"]:focus-visible { background: #6f18c1; }
.auth-card__form button[type="submit"]:disabled { cursor: wait; opacity: 0.55; }
.auth-card__secondary--compact:hover { color: #6f18c1; }

@media (max-width: 440px) {
  .auth-card { width: 100%; max-width: 366px; padding-inline: 32px; }
}
</style>
