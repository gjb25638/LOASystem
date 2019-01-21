// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import localeConf from './locale.js'
import VueCookie from 'vue-cookie'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueCookie)
Vue.mixin({
  data: function () {
    return {
      localeConf
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  myOption: 'hello!',
  components: { App },
  template: '<App/>'
})
