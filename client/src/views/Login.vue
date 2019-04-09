<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar class="theme">
                <v-tooltip bottom>
                  <v-toolbar-title slot="activator">{{localeConf.self.toolbar.title}}</v-toolbar-title>
                  <span>{{localeConf.self.tooltip.title}}</span>
                </v-tooltip>
                <v-img position="right" src="./static/logo.svg" aspect-ratio="6" contain></v-img>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    prepend-icon="person"
                    name="username"
                    :label="localeConf.self.input.username"
                    type="text"
                    v-model="username"
                    :rules="usernameRules"
                    required
                    autocomplete="username"
                  ></v-text-field>
                  <v-text-field
                    :append-icon="showingPassword ? 'visibility_off' : 'visibility'"
                    prepend-icon="lock"
                    name="password"
                    :label="localeConf.self.input.password"
                    :type="showingPassword ? 'text' : 'password'"
                    v-model="password"
                    :rules="passwordRules"
                    required
                    @click:append="showingPassword = !showingPassword"
                    @keyup.enter="login"
                    autocomplete="current-password"
                  ></v-text-field>
                </v-form>
                <v-alert outline v-model="status.failed" type="error">{{status.message}}</v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :class="valid ? 'theme' : 'disabled'"
                  @click="login"
                  :disabled="!valid"
                >{{localeConf.self.btn.login}}</v-btn>
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
export default {
  name: "Login",
  data: () => ({
    showingPassword: false,
    valid: false,
    username: "",
    usernameRules: [],
    password: "",
    passwordRules: [],
    status: { failed: false, message: "" }
  }),
  created() {
    this.usernameRules = [
      v => !!v || this.localeConf.self.input.validation.noEmpty,
      v =>
        /^[a-zA-Z0-9/.]+$/.test(v) ||
        this.localeConf.self.input.validation.notAEnglishName
    ];
    this.passwordRules = [
      v => !!v || this.localeConf.self.input.validation.noEmpty
    ];
  },
  mounted() {
    this.valid = false;
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        const {
          data: { success, token, message, logs }
        } = await EmployeeService.auth({
          username: this.username,
          password: this.password
        });
        if (success) {
          this.$cookie.set("loginuser", this.username.toLocaleLowerCase(), {
            expires: defaultConf.cookie.expiredPeriod.oneHour
          });
          this.$cookie.set("token", token, {
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
