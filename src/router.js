import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(
        /* webpackChunkName: "Home" */
        './pages/Home'
      )
    },
    {
      name: 'mais-acessadas',
      path: '/mais-acessadas',
      component: () => import(
        /* webpackChunkName: "MostAccessed" */
        './pages/MostAccessed'
      )
    }
  ]
})
