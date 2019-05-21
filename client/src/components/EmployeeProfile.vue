<template>
  <v-layout row wrap>
    <v-flex xs5>
      <v-text-field
        prepend-icon="star_border"
        v-model="profile.employeeID"
        :rules="[v => !!v ||
        loalocale.self.noEmpty]"
        :label="loalocale.self.employeeID"
        required
        :readonly="!addingNew && readonly"
      ></v-text-field>
    </v-flex>
    <v-flex xs1></v-flex>
    <v-flex xs6>
      <v-select
        prepend-icon="group"
        v-model="profile.dept"
        :items="deptOptions"
        :label="loalocale.self.dept"
        required
        :readonly="!addingNew && readonly"
        :rules="[v => !!v || loalocale.self.noEmpty]"
      ></v-select>
    </v-flex>
    <v-flex xs6>
      <v-text-field
        prepend-icon="person"
        v-model="profile.name"
        :rules="[v => !!v || loalocale.self.noEmpty]"
        :label="loalocale.self.name"
        required
        :readonly="!addingNew && readonly"
      ></v-text-field>
    </v-flex>
    <v-flex xs6>
      <v-text-field
        v-model="profile.username"
        :rules="[v => !!v || loalocale.self.noEmpty]"
        :label="loalocale.self.username"
        required
        :readonly="!addingNew && !addingNew"
      ></v-text-field>
    </v-flex>
    <v-flex xs6>
      <v-menu
        :close-on-content-click="false"
        v-model="datepickerMenu"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
        :disabled="!addingNew && readonly"
      >
        <v-text-field
          slot="activator"
          mask="####-##-##"
          v-model="dateInput"
          :label="loalocale.self.arrivedDate"
          persistent-hint
          prepend-icon="event"
          return-masked-value
          :rules="[v => !!v || loalocale.self.noEmpty]"
          @blur="profile.arrivedDate = dateInput"
        ></v-text-field>
        <v-date-picker
          v-model="profile.arrivedDate"
          no-title
          @input="datepickerMenu = false;dateInput = profile.arrivedDate"
          scrollable
        ></v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex xs6>
      <v-select
        prepend-icon="security"
        v-model="profile.level"
        :items="levelOptions"
        :label="loalocale.self.level"
        required
        :readonly="!addingNew && readonly"
        :rules="[v => !!v || loalocale.self.noEmpty]"
      ></v-select>
    </v-flex>
    <v-flex xs12>
      <v-text-field
        prepend-icon="email"
        v-model="profile.email"
        type="email"
        :label="loalocale.self.email"
        :readonly="!addingNew && readonly"
        :rules="[v => !v || /.+@.+/.test(v) || loalocale.self.invalidEmail]"
      ></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-combobox
        v-model="formattedSelectedSigners"
        :items="signerInfos"
        :label="loalocale.self.signers"
        multiple
        chips
        :readonly="!addingNew && readonly"
      ></v-combobox>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: "EmployeeProfile",
  props: {
    profile: {
      type: Object,
      default: () => ({
        employeeID: "",
        dept: "",
        name: "",
        username: "",
        arrivedDate: "",
        level: "",
        signers: [],
        email: ""
      })
    },
    signerOptions: {
      type: Array,
      default: () => ({
        _id: "",
        dept: "",
        name: "",
        username: "",
        level: ""
      })
    },
    deptOptions: {
      type: Array,
      default: () => []
    },
    levelOptions: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: true
    },
    addingNew: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    signerInfos() {
      return this.signerOptions
        .filter(e => e.username !== this.username)
        .map(e => `[${e.dept}]${e.name}(${e.username})`);
    },
    formattedSelectedSigners: {
      set: function(newValue) {
        const selectedSigners = newValue
          .map(str => {
            const [, dept, name, username] = /\[(.*?)\](.*?)\((.*?)\)/.exec(
              str
            );
            if (dept && name && username) {
              const employee = this.signerOptions.find(
                e => e.username === username
              );
              if (employee) {
                return employee;
              }
            }
          })
          .filter(e => e);
        this.$emit("update:profile", {
          ...this.profile,
          signers: selectedSigners
        });
      },
      get: function() {
        return this.profile.signers.map(
          x => `[${x.dept}]${x.name}(${x.username})`
        );
      }
    }
  },
  data: () => ({
    datepickerMenu: false,
    dateInput: ""
  }),
  watch: {
    profile() {
      this.dateInput = this.profile.arrivedDate;
    }
  }
};
</script>
<style>
</style>
