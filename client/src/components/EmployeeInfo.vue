<template>
  <v-tooltip bottom>
    <div slot="activator">
      <div>
        <v-icon v-if="icon">group</v-icon>
        {{profile.dept}}
        <v-icon v-if="icon">security</v-icon>
        {{profile.level}}
      </div>
      <div v-if="!small">
        <v-icon v-if="icon">star</v-icon>
        {{profile.employeeID}}
      </div>
      <div>
        <v-icon v-if="icon">person</v-icon>
        {{profile.name}} ({{profile.username}})
      </div>
      <div>
        <v-icon v-if="icon">event</v-icon>
        {{formatDate(profile.arrivedDate)}}
      </div>
      <div v-if="!small && email">
        <v-icon v-if="icon">email</v-icon>
        {{profile.email}}
      </div>
    </div>
    <div>
      <div>
        {{loalocale.self.dept}}:
        {{profile.dept}}
        {{loalocale.self.level}}:
        {{profile.level}}
      </div>
      <div v-if="!small">
        {{loalocale.self.employeeID}}:
        {{profile.employeeID}}
      </div>
      <div>
        {{loalocale.self.name}} ({{loalocale.self.username}}):
        {{profile.name}} ({{profile.username}})
      </div>
      <div>
        {{loalocale.self.arrivedDate}}:
        {{formatDate(profile.arrivedDate)}}
      </div>
      <div v-if="!small && email">
        {{loalocale.self.email}}:
        {{profile.email}}
      </div>
    </div>
  </v-tooltip>
</template>
<script>
import utility from "@/utility";
export default {
  name: "EmployeeInfo",
  props: {
    small: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    email: {
      type: Boolean,
      default: false
    },
    profile: {
      type: Object,
      default: () => ({
        dept: "Dept",
        level: "Level",
        employeeID: "ID000",
        name: "My Name",
        username: "My Username",
        arrivedDate: "now",
        email: "sample@email.com"
      })
    }
  },
  data: () => ({}),
  methods: {
    formatDate: utility.formatDate
  }
};
</script>
<style>
</style>
