<template>
  <div class="playlist__item">
    <div class="playlist__track track">
      <div class="track__title">
        <div class="track__title-image">
          <svg class="track__title-svg">
            <use href="/img/icon/sprite.svg#icon-note"></use>
          </svg>
        </div>
        <div class="track__title-text">
          <a class="track__title-link" href="#">
            {{ track.title }}
            <span class="track__title-span">{{ track.suffix }}</span>
          </a>
        </div>
      </div>
      <div class="track__author">
        <a class="track__author-link" href="#">{{ track.author }}</a>
      </div>
      <div class="track__album">
        <a class="track__album-link" href="#">{{ track.album }}</a>
      </div>
      <div class="track__time">
        <svg class="track__time-svg">
          <use href="/img/icon/sprite.svg#icon-like"></use>
        </svg>
        <span class="track__time-text">{{ track.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  track: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.playlist__item {
  width: 100%;
  display: block;
  margin-bottom: 12px;
}

.playlist__track {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.track__title {
  display: flex;
  align-items: center;
  width: 447px;
  flex-shrink: 0;
}

.track__title-image {
  width: 51px;
  height: 51px;
  padding: 16px;
  background: #313131;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 17px;
  flex-shrink: 0;
}

.track__title-svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
}

.track__title-link {
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-decoration: none;
}

.track__title-span {
  color: #4e4e4e;
}

.track__author {
  width: 321px;
  display: flex;
  justify-content: flex-start;
  flex-shrink: 0;
}

.track__author-link {
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-decoration: none;
  text-align: left;
}

.track__album {
  width: 245px;
  flex-shrink: 0;
}

.track__album-link {
  font-size: 16px;
  line-height: 24px;
  color: #696969;
  text-decoration: none;
}

.track__time {
  width: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
}

.track__time-svg {
  width: 14px;
  height: 12px;
  margin-right: 17px;
  fill: transparent;
  stroke: #696969;
}

.track__time-text {
  font-size: 16px;
  line-height: 24px;
  color: #696969;
  text-align: right;
}
</style>
