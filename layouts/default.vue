<template>
  <div class="wrapper">
    <div class="container">
      <main class="main">
        <Navbar />
        <slot />
        <aside class="main__sidebar sidebar">
          <div class="sidebar__profile">
            <button
              type="button"
              class="sidebar__personal"
              :aria-expanded="isProfileOpen"
              aria-label="Меню профиля"
              @click="isProfileOpen = !isProfileOpen"
            >
              <svg class="sidebar__logout-icon" aria-hidden="true">
                <use href="/img/icon/sprite.svg#logout"></use>
              </svg>
            </button>
            <div v-if="isProfileOpen" class="sidebar__profile-menu">
              <div class="sidebar__profile-identity">
                <span class="sidebar__icon" aria-hidden="true">
                  <img
                    v-if="profileAvatar"
                    class="sidebar__avatar"
                    :src="profileAvatar"
                    alt=""
                  />
                  <span v-else class="sidebar__avatar-placeholder">
                    {{ profileInitial }}
                  </span>
                </span>
                <span class="sidebar__personal-name">
                  {{ user.user?.username || user.user?.email || 'Пользователь' }}
                </span>
              </div>
              <button v-if="user.isAuthenticated" type="button" @click="logout">Выйти</button>
              <NuxtLink v-else to="/login" @click="isProfileOpen = false">Войти</NuxtLink>
            </div>
          </div>
          <div class="sidebar__block">
            <ul class="sidebar__list">
              <li v-for="playlist in playlists" :key="playlist.id" class="sidebar__item">
                <NuxtLink :to="playlist.to" class="sidebar__link">
                  <NuxtImg
                    class="sidebar__img"
                    :src="playlist.image"
                    :alt="playlist.label"
                  />
                </NuxtLink>
              </li>
            </ul>
          </div>
        </aside>
      </main>
      <PlayerBar />
      <footer class="footer"></footer>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/store/user'
import { useFavoritesStore } from '~/store/favorites'

const user = useUserStore()
const favorites = useFavoritesStore()
const isProfileOpen = ref(false)
const profileAvatar = computed(() =>
  user.user?.avatar || user.user?.avatar_url || user.user?.image || '',
)
const profileInitial = computed(() => {
  const name = String(user.user?.username || user.user?.email || 'П')
  return name.trim().charAt(0).toUpperCase()
})
const playlists = [
  { id: 1, label: 'Плейлист дня', image: '/img/playlist01.png', to: '/category/Рок музыка' },
  { id: 2, label: '100 танцевальных хитов', image: '/img/playlist02.png', to: '/category/Электронная музыка' },
  { id: 3, label: 'Инди-заряд', image: '/img/playlist03.png', to: '/category/Классическая музыка' },
]

onMounted(async () => {
  user.restore()
  await favorites.load()
})

watch(() => user.accessToken, () => {
  favorites.load()
})

async function logout() {
  user.clear()
  favorites.clear()
  isProfileOpen.value = false
  await navigateTo('/login')
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100vh;
  overflow-x: clip;
  background-color: var(--bg-shell);
  color: var(--text-primary);
  font-family: "StratosSkyeng", sans-serif;
}

.container {
  max-width: 1920px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  padding-bottom: 78px;
  background-color: var(--bg-main);
}

.main {
  min-height: calc(100vh - 78px);
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.sidebar {
  width: 418px;
  max-width: 418px;
  flex: 0 0 418px;
  padding: 20px 90px 20px 78px;
}

.sidebar__personal {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  cursor: pointer;
}

.sidebar__profile {
  position: relative;
}

.sidebar__profile-menu {
  position: absolute;
  top: 48px;
  right: 0;
  z-index: 12;
  min-width: 140px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-menu);
}

.sidebar__profile-identity {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  color: var(--text-primary);
}

.sidebar__logout-icon {
  width: 40px;
  height: 40px;
}

.sidebar__profile-menu button,
.sidebar__profile-menu a {
  width: 100%;
  display: block;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
}

.sidebar__avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar__avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-muted);
  color: var(--text-primary);
  font-size: 16px;
}

.sidebar__personal-name {
  font-size: 16px;
  line-height: 24px;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background: var(--bg-muted);
  border-radius: 50%;
  overflow: hidden;
}

.sidebar__block {
  min-height: 600px;
  padding-top: 317px;
}

.sidebar__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar__item {
  width: 250px;
  height: 150px;
}

.sidebar__item:not(:last-child) {
  margin-bottom: 30px;
}

.sidebar__link,
.sidebar__img {
  display: block;
  width: 100%;
  height: 100%;
}

@media (max-width: 1440px) {
  .sidebar {
    width: 290px;
    max-width: 290px;
    flex-basis: 290px;
    padding: 20px 32px;
  }

  .sidebar__block {
    padding-top: 280px;
  }

  .sidebar__item {
    width: 226px;
  }
}

@media (max-width: 1100px) {
  .sidebar {
    display: none;
  }
}
</style>
