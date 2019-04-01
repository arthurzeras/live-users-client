import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import VueFirebase from './firebase'
import './assets/scss/app.scss'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(VueFirebase)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
