import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/Create.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/manage/:sidechain',
    name: 'ManageSidechain',
    component: () => import('../views/ManageSidechain.vue')
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import('../views/Manage.vue')
  },
  {
    path: '/address/:address',
    name: 'Address',
    component: () => import('../views/Address.vue')
  },
  {
    path: '/sidechain/:sidechain/:address',
    name: 'SidechainAddress',
    component: () => import('../views/AddressTransactions.vue')
  },
  {
    path: '/sidechain/:sidechain',
    name: 'Sidechain',
    component: () => import('../views/Sidechain.vue')
  },
  {
    path: '/transaction/:sidechain/:sxid',
    name: 'Transaction',
    component: () => import('../views/Transaction.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
