<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar class="theme">
                <v-tooltip bottom>
                  <v-toolbar-title slot="activator">{{loalocale.self.title}}</v-toolbar-title>
                  <span>{{loalocale.self.tooltip}}</span>
                </v-tooltip>
                <v-img position="right" src="./static/logo.svg" aspect-ratio="6" contain></v-img>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    prepend-icon="person"
                    name="username"
                    :label="loalocale.self.username"
                    type="text"
                    v-model="username"
                    :rules="rules.username"
                    required
                    autocomplete="username"
                  ></v-text-field>
                  <v-text-field
                    :append-icon="showingPWD ? 'visibility_off' : 'visibility'"
                    prepend-icon="lock"
                    name="password"
                    :label="loalocale.self.password"
                    :type="showingPWD ? 'text' : 'password'"
                    v-model="password"
                    :rules="rules.password"
                    required
                    @click:append="showingPWD = !showingPWD"
                    @keyup.enter="login"
                    autocomplete="current-password"
                  ></v-text-field>
                </v-form>
                <v-alert outline v-model="status.failed" type="error">{{status.message}}</v-alert>
                <v-chip label outline color="primary" v-if="config.dev">
                  <v-icon left>storage</v-icon>
                  {{ config.API_URL.replace("http://", "").replace("https://", "") }}
                </v-chip>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :class="valid ? 'theme' : 'disabled'"
                  @click="login"
                  :disabled="!valid"
                >{{loalocale.self.login}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import EmployeeService from "@/services/EmployeeService";
import utility from "@/utility.js";
import defaultConf from "@/default.js";
import config from "@/services/config.js";
export default {
  name: "Login",
  data: () => ({
    showingPWD: false,
    valid: false,
    username: "",
    rules: { username: [], password: [] },
    password: "",
    status: { failed: false, message: "" },
    config: config
  }),
  created() {
    this.rules.username = [
      v => !!v || this.loalocale.self.noempty,
      v => /^[a-zA-Z0-9/.]+$/.test(v) || this.loalocale.self.notengname
    ];
    this.rules.password = [v => !!v || this.loalocale.self.noempty];
  },
  mounted() {
    this.valid = false;
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        const {
          data: { success, loginuser, message, logs }
        } = await EmployeeService.auth({
          username: this.username,
          password: this.password
        });
        if (success) {
          this.$cookie.set("loasystem.loginuser", JSON.stringify(loginuser), {
            expires: defaultConf.cookie.expiredPeriod.oneHour
          });
          this.$router.push({ name: "List", params: { logs } });
        } else {
          this.status = {
            failed: true,
            message: utility.lookUpCustomMessage(message)
          };
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
