<template>
  <v-layout row wrap>
    <v-flex xs6>
      <v-dialog v-model="resetPWDDialog" max-width="400px">
        <v-btn slot="activator">
          <v-icon>lock</v-icon>
          {{localeConf.self.btn.resetPWD}}
        </v-btn>
        <v-card>
          <v-card-title class="theme">
            <span class="headline">{{localeConf.self.btn.resetPWD}}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              :append-icon="showingPWD ? 'visibility_off' : 'visibility'"
              prepend-icon="lock"
              name="password"
              :label="localeConf.self.input.password"
              :type="showingPWD ? 'text' : 'password'"
              v-model="account.password"
              @click:append="showingPWD = !showingPWD"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="resetPWDDialog = false">{{localeConf.self.dialog.close}}</v-btn>
            <v-btn class="theme" flat @click="resetPWD">{{localeConf.self.btn.update}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
    <v-flex xs6>
      <v-dialog v-model="resetEmailDialog" max-width="400px">
        <v-btn slot="activator">
          <v-icon>email</v-icon>
          {{localeConf.self.btn.resetEmail}}
        </v-btn>
        <v-card>
          <v-card-title class="theme">
            <span class="headline">{{localeConf.self.btn.resetEmail}}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              prepend-icon="email"
              v-model="account.email"
              type="email"
              label="Email"
              :rules="[v => !v || /.+@.+/.test(v) || localeConf.self.input.validation.notEmail]"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="resetEmailDialog = false">{{localeConf.self.dialog.close}}</v-btn>
            <v-btn class="theme" flat @click="resetEmail">{{localeConf.self.btn.update}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "EmployeeAccountSettings",
  props: {
    account: {
      type: Object,
      validator: function(value) {
        const missingProperties = ["password", "email"].filter(
          prop => !(prop in value)
        );
        const valid = missingProperties.length === 0;
        if (!valid) {
          console.log(
            `<EmployeeAccountSettings> [account] is missing properties: ${missingProperties}`
          );
        }
        return valid;
      }
    },
    addingNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resetPWDDialog: false,
      resetEmailDialog: false,
      showingPWD: false
    };
  },
  methods: {
    resetPWD(value) {
      this.$emit("resetPWD", value);
    },
    resetEmail(value) {
      this.$emit("resetEmail", value);
    }
  }
};
</script>

<style>
</style>
