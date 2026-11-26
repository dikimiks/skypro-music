<template>
  <nav class="main__nav nav">
    <NuxtLink to="/" class="nav__logo logo" aria-label="Skypro — Треки">
      <img class="logo__image" src="/img/logo.png" alt="Skypro" />
    </NuxtLink>
    <button
      type="button"
      class="nav__burger burger"
      :aria-expanded="isMenuOpen"
      :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
      aria-controls="main-menu"
      @click="isMenuOpen = !isMenuOpen"
    >
      <span class="burger__line"></span>
      <span class="burger__line"></span>
      <span class="burger__line"></span>
    </button>
    <div v-if="isMenuOpen" id="main-menu" class="nav__menu menu">
      <ul class="menu__list">
        <li class="menu__item">
          <NuxtLink to="/" class="menu__link" @click="isMenuOpen = false">Главное</NuxtLink>
        </li>
        <li class="menu__item">
          <NuxtLink to="/favorites" class="menu__link" @click="isMenuOpen = false">Мои треки</NuxtLink>
        </li>
        <li class="menu__item">
          <button
            type="button"
            class="menu__link menu__theme"
            :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
            :aria-pressed="theme === 'light'"
            @click="toggleTheme"
          >
            <svg class="menu__theme-icon" aria-hidden="true">
              <use :href="`/img/icon/sprite.svg#icon-${theme === 'dark' ? 'sun' : 'moon'}`"></use>
            </svg>
          </button>
        </li>
        <li class="menu__item">
          <button v-if="user.isAuthenticated" type="button" class="menu__link menu__logout" @click="logout">Выйти</button>
          <NuxtLink v-else to="/login" class="menu__link" @click="isMenuOpen = false">Войти</NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '~/store/user'
import { useFavoritesStore } from '~/store/favorites'

const user = useUserStore()
const favorites = useFavoritesStore()
const isMenuOpen = ref(false)
const theme = ref('dark')

onMounted(() => {
  user.restore()
  const savedTheme = window.localStorage.getItem('skypro-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme
  }
  document.documentElement.dataset.theme = theme.value
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  window.localStorage.setItem('skypro-theme', theme.value)
}

function logout() {
  user.clear()
  favorites.clear()
  isMenuOpen.value = false
  navigateTo('/login')
}
</script>

<style scoped>
.main__nav {
  width: 244px;
  flex: 0 0 244px;
  background-color: var(--bg-main);
  padding: 36px 0 20px 36px;
}

.menu__theme {
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.menu__theme-icon {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav__logo {
  display: block;
  width: 113.33px;
  height: 17px;
  padding: 0;
  background-color: transparent;
  margin-bottom: 45px;
}

.logo__image {
  width: 113.33px;
  height: 17px;
  display: block;
}

.nav__burger {
  width: 20px;
  height: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.burger__line {
  display: inline-block;
  width: 100%;
  height: 1px;
  background-color: var(--text-primary);
}

.nav__menu {
  display: block;
}

.menu__list {
  padding: 36px 0 10px;
  margin: 0;
  list-style: none;
}

.menu__item {
  padding: 5px 0;
  margin-bottom: 16px;
}

.menu__link {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
}

.menu__logout {
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.menu__link:hover {
  color: var(--accent-light);
}

@media (max-width: 900px) {
  .main__nav {
    width: 72px;
    flex-basis: 72px;
    padding: 24px 16px;
  }

  .nav__logo,
  .logo__image {
    width: 40px;
  }

  .logo__image {
    object-fit: cover;
    object-position: left;
  }

  .nav__menu {
    position: fixed;
    top: 64px;
    left: 16px;
    z-index: 20;
    min-width: 200px;
    padding: 16px;
    background: var(--bg-player);
  }
}
</style>
