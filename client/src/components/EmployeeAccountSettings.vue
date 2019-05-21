<template>
  <v-layout row wrap>
    <v-flex xs2>
      <v-dialog v-model="dialog.password" max-width="400px">
        <v-tooltip bottom slot="activator">
          <v-btn slot="activator" icon color="primary">
            <v-icon>lock</v-icon>
          </v-btn>
          {{loalocale.self.reset}} {{loalocale.self.password}}
        </v-tooltip>
        <v-card>
          <v-card-title class="theme">
            <span class="headline">{{loalocale.self.reset}} {{loalocale.self.password}}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              :append-icon="showPWD ? 'visibility_off' : 'visibility'"
              prepend-icon="lock"
              name="password"
              :label="loalocale.self.password"
              :type="showPWD ? 'text' : 'password'"
              v-model="account.password"
              @click:append="showPWD = !showPWD"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="dialog.password = false">{{loalocale.self.close}}</v-btn>
            <v-btn class="theme" flat @click="resetPWD">{{loalocale.self.reset}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
    <v-flex xs2>
      <v-dialog v-model="dialog.email" max-width="400px">
        <v-tooltip bottom slot="activator">
          <v-btn slot="activator" icon color="primary">
            <v-icon>email</v-icon>
          </v-btn>
          {{loalocale.self.reset}} {{loalocale.self.email}}
        </v-tooltip>
        <v-card>
          <v-card-title class="theme">
            <span class="headline">{{loalocale.self.reset}} {{loalocale.self.email}}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              prepend-icon="email"
              v-model="account.email"
              type="email"
              label="Email"
              :rules="[v => !v || /.+@.+/.test(v) || loalocale.self.invalidEmail]"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="dialog.email = false">{{loalocale.self.close}}</v-btn>
            <v-btn class="theme" flat @click="resetEmail">{{loalocale.self.reset}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>
import EmployeeService from "@/services/EmployeeService";
export default {
  name: "EmployeeAccountSettings",
  props: {
    account: {
      type: Object,
      default: () => ({
        email: "",
        password: "",
        id: ""
      })
    },
    addingNew: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: {
      password: false,
      email: false
    },
    showPWD: false
  }),
  methods: {
    async resetEmail() {
      const {
        data: { success, message }
      } = await EmployeeService.updateEmail({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        id: this.account.id,
        email: this.account.email
      });
      this.$emit("reset:email", success, message);
    },
    async resetPWD() {
      let {
        data: { success, message }
      } = await EmployeeService.updatePWD({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        id: this.account.id,
        password: this.account.password
      });

      this.$emit("reset:password", success, message);
    }
  }
};
</script>
<style>
</style>
