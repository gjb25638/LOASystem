// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import localeConf from '@/localization/index'
import VueCookie from 'vue-cookie'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import utility from '@/utility'
Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueCookie)
Vue.mixin({
  beforeCreate() {
    utility.checkingLoginStatus(this.$cookie, this.$router)
  },
  data: function (e) {
    let localeConfTemp = {}
    const componentTag = e && e.$vnode ? e.$vnode.tag : undefined
    if (componentTag) {
      const [, name] = /-(\w+)$/.exec(componentTag)
      if (name && localeConf[name]) {
        localeConfTemp = {
          name,
          self: localeConf[name],
          shared: localeConf.shared
        }
      } else {
        localeConfTemp = {
          componentTag
        }
      }
    }
    return {
      localeConf: localeConfTemp
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
