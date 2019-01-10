<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar class="theme">
                <v-tooltip bottom>
                  <v-toolbar-title slot="activator">LOA System</v-toolbar-title>
                  <span>Leave of Absence System</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field prepend-icon="person" name="username" :label="localeConf.login.input.username" type="text" v-model="username" :rules="usernameRules" required></v-text-field>
                  <v-text-field :append-icon="showingPassword ? 'visibility_off' : 'visibility'" prepend-icon="lock" name="password" :label="localeConf.login.input.password" :type="showingPassword ? 'text' : 'password'" v-model="password" :rules="passwordRules" required @click:append="showingPassword = !showingPassword" @keyup.enter="login"></v-text-field>
                </v-form>
                <v-alert v-model="status.failed" type="error">{{status.message}}</v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="theme" @click="login">{{localeConf.login.btn.login}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import EmployeeService from '@/services/EmployeeService'
import utility from '@/utility.js'
import defaultConf from '@/default.js'
export default {
  name: 'Login',
  data: () => ({
    showingPassword: false,
    valid: true,
    username: '',
    usernameRules: [v => !!v || ''],
    password: '',
    passwordRules: [v => !!v || ''],
    status: { failed: false, message: '' }
  }),
  beforeCreate() {
    location.search.split(';').forEach(v => {
      const res = /\?(.*)=(.*)/.exec(v)
      if (res) this.$cookie.set(res[1], res[2])
    })
    utility.checkingLoginStatus(this.$cookie, this.$router, {
      expires: defaultConf.cookie.expiredPeriod.oneDay
    })
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        const {
          data: { success, token, message, logs }
        } = await EmployeeService.auth({
          username: this.username,
          password: this.password
        })
        if (success) {
          this.$cookie.set('loginuser', this.username.toLocaleLowerCase(), {
            expires: defaultConf.cookie.expiredPeriod.oneHour
          })
          this.$cookie.set('token', token, {
            expires: defaultConf.cookie.expiredPeriod.oneHour
          })
          this.$router.push({ name: 'List', params: { logs } })
        } else {
          this.status = { failed: true, message }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.theme {
  background: linear-gradient(
    to right,
    rgba(225, 56, 89, 1) 0%,
    rgba(195, 43, 127, 1) 35%,
    rgba(146, 49, 140, 1) 65%,
    rgba(78, 56, 130, 1) 100%
  ) !important;
  color: white !important;
}
</style>
