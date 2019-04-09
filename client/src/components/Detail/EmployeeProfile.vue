<template>
  <v-layout row wrap>
    <v-flex xs5>
      <v-text-field
        prepend-icon="star_border"
        v-model="profile.employeeID"
        :rules="[v => !!v ||
        localeConf.self.input.validation.noEmpty]"
        :label="localeConf.self.input.employeeID"
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
        :label="localeConf.self.input.dept"
        required
        :readonly="!addingNew && readonly"
        :rules="[v => !!v || localeConf.self.input.validation.noEmpty]"
      ></v-select>
    </v-flex>
    <v-flex xs6>
      <v-text-field
        prepend-icon="person"
        v-model="profile.name"
        :rules="[v => !!v || localeConf.self.input.validation.noEmpty]"
        :label="localeConf.self.input.name"
        required
        :readonly="!addingNew && readonly"
      ></v-text-field>
    </v-flex>
    <v-flex xs6>
      <v-text-field
        v-model="profile.username"
        :rules="[v => !!v || localeConf.self.input.validation.noEmpty]"
        :label="localeConf.self.input.username"
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
          v-model="profile.arrivedDate"
          :label="localeConf.self.input.arrivedDate"
          persistent-hint
          prepend-icon="event"
          return-masked-value
          :rules="[v => !!v || localeConf.self.input.validation.noEmpty]"
        ></v-text-field>
        <v-date-picker
          v-model="profile.arrivedDate"
          no-title
          @input="datepickerMenu = false"
          scrollable
        ></v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex xs6>
      <v-select
        prepend-icon="security"
        v-model="profile.level"
        :items="levelOptions"
        :label="localeConf.self.input.level"
        required
        :readonly="!addingNew && readonly"
        :rules="[v => !!v || localeConf.self.input.validation.noEmpty]"
      ></v-select>
    </v-flex>
    <v-flex xs6>
      <v-text-field
        prepend-icon="email"
        v-model="profile.email"
        type="email"
        :label="localeConf.self.input.email"
        :readonly="!addingNew && readonly"
        :rules="[v => !v || /.+@.+/.test(v) || localeConf.self.input.validation.notEmail]"
      ></v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-combobox
        v-model="formattedSelectedSigners"
        :items="formattedSignerOptions"
        :label="localeConf.self.input.signers"
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
      validator: function(value) {
        const missingProperties = [
          "employeeID",
          "dept",
          "name",
          "username",
          "arrivedDate",
          "level",
          "signers",
          "email"
        ].filter(prop => !(prop in value));
        const valid = missingProperties.length === 0;
        if (!valid) {
          throw new EmployeeProfileException(
            `<EmployeeProfile> [profile] is missing properties: ${missingProperties}`
          );
        }
        return valid;
      }
    },
    signerOptions: {
      type: Array,
      validator: function(value) {
        return value.some(item => {
          const missingProperties = [
            "_id",
            "dept",
            "name",
            "username",
            "level"
          ].filter(prop => !(prop in item));
          const valid = missingProperties.length === 0;
          if (!valid) {
            throw new EmployeeProfileException(
              `<EmployeeProfile> [signerOptions] is missing properties: ${missingProperties}`
            );
          }
          return valid;
        });
      }
    },
    deptOptions: {
      type: Array,
      default: function() {
        return [];
      }
    },
    levelOptions: {
      type: Array,
      default: function() {
        return [];
      }
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
    formattedSignerOptions: function() {
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
            throw new EmployeeProfileException(
              `<EmployeeProfile> [selectedSigners] goet wrong format: ${str}`
            );
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
  data() {
    return {
      datepickerMenu: false
    };
  }
};
function EmployeeProfileException(message) {
  this.message = message;
  this.name = "EmployeeProfileException";
}
</script>

<style>
</style>
