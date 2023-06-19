import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/home/LoginView.vue'
import RegisterView from '@/views/home/RegisterView.vue'
import LostView from '@/views/home/LostView.vue'
import DashboardView from '@/views/modules/DashboardView.vue'
import InformationView from '@/views/modules/users/InformationView.vue'
//import setAuthHeader from '@/utils/setAuthHeader'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/lost',
    name: 'lost',
    component: LostView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
//    meta: {
//      requiresAuth: true
//    }
  },
  {
    path: '/user/information',
    name: 'Information',
    component: InformationView,
//    meta: {
//      requiresAuth: true
//    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
//router.beforeEach((to, from, next) => {
//  if (to.matched.some(record => record.meta.requiresAuth)) {
//    if (localStorage.getItem('jwt') === null) {
//      next({
//        path: '/'
//      })
//    } else {
//      setAuthHeader(localStorage.getItem('jwt'))
//      next()
//    }
//  } else {
//    next()
//  }
//})
//
export default router
