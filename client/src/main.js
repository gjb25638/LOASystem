// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import locale from '@/localization/index'
import VueCookie from 'vue-cookie'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueCookie)
Vue.mixin({
  created() {
    this.checkLoginStatus()
  },
  computed: {
    loginuser() {
      return JSON.parse(this.$cookie.get("loasystem.loginuser"));
    }
  },
  data: function (e) {
    let selfLocale = {}
    const componentTag = e && e.$vnode ? e.$vnode.tag : undefined
    if (componentTag) {
      const [, name] = /-(\w+)$/.exec(componentTag)
      if (name) {
        selfLocale = {
          name,
          self: locale[name],
          shared: locale.shared
        }
      }
    }
    return {
      loalocale: selfLocale
    }
  },
  methods: {
    checkLoginStatus() {
      if (this.$router.history.current.name !== "Login") {
        const loginuser = this.$cookie.get("loasystem.loginuser");
        if (!loginuser) {
          this.$cookie.delete("loasystem.loginuser");
          this.$router.push({ name: "Login" });
        }
      }
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
