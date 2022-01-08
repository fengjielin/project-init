import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: '',
  redirect: '/app'
},
{
  path: '/app',
  name: 'App',
  component: () => import('../App.vue')
},
]

const router = new VueRouter({
  mode: 'hash', // history
  // base: process.env.BASE_URL,
  routes
})

export default router