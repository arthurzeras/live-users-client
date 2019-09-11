import Vue from 'vue'

export const state = Vue.observable({
  total: 0
})

export const mutations = {
  setTotal (total) {
    state.total = total
  }
}
