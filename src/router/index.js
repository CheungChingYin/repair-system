import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Admin from '../components/Admin'
import Orders from '../components/Orders'
import CompleteOrder from '../components/CompleteOrder'
import Building from '../components/Building'
import Clazz from '../components/Clazz'
import QRCode from '../components/QRCode'
import SubmitRepair from '../components/SubmitRepair'
import SelfInfo from '../components/SelfInfo'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
        },
        {
          path: 'CompleteOrder',
          name: 'CompleteOrder',
          component: CompleteOrder
        },
        {
          path: 'Building',
          name: 'Building',
          component: Building
        },
        {
          path: 'Clazz',
          name: 'Clazz',
          component: Clazz
        },
        {
          path: 'QRCode',
          name: 'QRCode',
          component: QRCode
        },
        {
          path: 'SelfInfo',
          name: 'SelfInfo',
          component: SelfInfo
        }
      ]
    },
    {
      path: '/SubmitRepair',
      name: 'SubmitRepair',
      component: SubmitRepair
    }
  ]
})
