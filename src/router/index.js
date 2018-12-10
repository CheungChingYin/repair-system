import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Admin from '../components/Admin'
import Orders from '../components/Orders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'Admin',
          name: 'Admin',
          component: Admin
        },
        {
          path: 'Orders',
          name: 'Orders',
          component: Orders
        }
      ]
    }
  ]
})
