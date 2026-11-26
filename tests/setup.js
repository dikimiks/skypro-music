import * as Vue from 'vue'

Object.assign(globalThis, {
  ref: Vue.ref,
  computed: Vue.computed,
  onMounted: Vue.onMounted,
  watch: Vue.watch,
  watchEffect: Vue.watchEffect,
  nextTick: Vue.nextTick,
})
