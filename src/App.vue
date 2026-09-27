<template>
  <div class="wrapper">
    <div class="container">
      <main class="main">
        <Navbar />

        <section class="main__centerblock centerblock">
          <div class="centerblock__search search">
            <svg class="search__svg">
              <use href="/img/icon/sprite.svg#icon-search"></use>
            </svg>
            <input class="search__text" type="search" placeholder="Поиск" name="search" />
          </div>

          <h2 class="centerblock__h2">Треки</h2>

          <FilterControls />
          <Playlist :tracks="tracks" />
        </section>

        <aside class="main__sidebar sidebar">
          <div class="sidebar__personal">
            <div class="sidebar__personal-name">Пользователь</div>
            <div class="sidebar__icon"></div>
          </div>
          <div class="sidebar__block">
            <ul class="sidebar__list">
              <li class="sidebar__item">
                <a href="#" class="sidebar__link">
                  <img class="sidebar__img" src="/img/playlist01.png" alt="Плейлист" />
                </a>
              </li>
              <li class="sidebar__item">
                <a href="#" class="sidebar__link">
                  <img class="sidebar__img" src="/img/playlist02.png" alt="Плейлист" />
                </a>
              </li>
              <li class="sidebar__item">
                <a href="#" class="sidebar__link">
                  <img class="sidebar__img" src="/img/playlist03.png" alt="Плейлист" />
                </a>
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
import Navbar from './components/Navbar.vue'
import FilterControls from './components/FilterControls.vue'
import Playlist from './components/Playlist.vue'
import PlayerBar from './components/PlayerBar.vue'
import { tracks } from './data/tracks.js'
</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-color: #383838;
  color: #ffffff;
  font-family: "Montserrat", sans-serif;
}

.container {
  max-width: 1920px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background-color: #181818;
}

.main {
  min-height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.main__centerblock {
  width: auto;
  flex-grow: 3;
  padding: 20px 40px 20px 111px;
}

.main__sidebar {
  max-width: 418px;
  padding: 20px 90px 20px 78px;
}

.centerblock__search {
  width: 100%;
  border-bottom: 1px solid #4e4e4e;
  margin-bottom: 51px;
  display: flex;
  align-items: center;
}

.centerblock__h2 {
  font-weight: 400;
  font-size: 64px;
  line-height: 72px;
  letter-spacing: -0.8px;
  margin: 0 0 45px;
}

.search__svg {
  width: 17px;
  height: 17px;
  margin-right: 5px;
  stroke: #ffffff;
  fill: transparent;
  flex-shrink: 0;
}

.search__text {
  flex-grow: 1;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 13px 10px 14px;
  font: inherit;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.search__text::placeholder {
  color: #ffffff;
  opacity: 1;
}

.sidebar__personal {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0 15px;
}

.sidebar__personal-name {
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-right: 16px;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background-color: #313131;
  border-radius: 50%;
  cursor: pointer;
}

.sidebar__block {
  height: 100%;
  padding: 240px 0 0;
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

.sidebar__link {
  display: block;
  width: 100%;
  height: 100%;
}

.sidebar__img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
