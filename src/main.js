// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuex from 'vuex'
import VueCookies from 'vue-cookies'

// import Login from './components/Login'
// import Home from './components/Home'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.use(vuex)
Vue.use(VueCookies)

var store = new vuex.Store({// store对象
  state: {
    adminInfo: {},
    ServerDomain: 'http://localhost:8081',
    orderCount: '',
    domain: 'localhost:8081',
    repairFormPath: 'localhost:8081/SubmitRepair',
    uploadImagePath: '/api/orders/uploadImage'
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
