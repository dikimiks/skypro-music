<template>
  <div class="centerblock__filter filter">
    <div class="filter__title">Искать по:</div>
    <div class="filter__button button-author _btn-text">исполнителю</div>
    <div class="filter__button button-year _btn-text">году выпуска</div>
    <div class="filter__button button-genre _btn-text">жанру</div>
  </div>
</template>

<style scoped>
.centerblock__filter {
  display: flex;
  align-items: center;
  margin-bottom: 51px;
}

.filter__title {
  font-size: 16px;
  line-height: 24px;
  margin-right: 15px;
}

.filter__button {
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
  cursor: pointer;
}

.filter__button:not(:last-child) {
  margin-right: 10px;
}

._btn-text:hover {
  border-color: #d9b6ff;
  color: #d9b6ff;
}

._btn-text:active {
  border-color: #ad61ff;
  color: #ad61ff;
}
</style>
