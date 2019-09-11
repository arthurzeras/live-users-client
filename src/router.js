import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'Home',
        icon: 'fa fa-home'
      },
      component: () => import(
        /* webpackChunkName: "Home" */
        './pages/Home'
      )
    }
  ]
})
