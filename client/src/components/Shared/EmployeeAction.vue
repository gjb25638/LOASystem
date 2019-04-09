<template>
  <span>
    <span>
      <router-link v-bind:to="{ name: 'RecordList', params: { id: employee._id, query: recordListQuery } }">
        {{localeConf.self.action.records}}</router-link>
    </span>
    <span v-if="fullControl || sameAsCurrentUser">|
      <router-link v-bind:to="{ name: 'Detail', params: { id: employee._id } }">{{localeConf.self.action.edit}}</router-link>
    </span>
    <span v-if="fullControl && !sameAsCurrentUser"> |
      <a href="#" @click.stop="switchEmployee(employee._id)">{{employee.enabled ? localeConf.self.action.disable : localeConf.self.action.enable}}</a>
    </span>
    <span v-if="fullControl && !employee.enabled"> |
      <v-dialog v-model="confirmDialog" max-width="320">
        <span slot="activator">
          <a href="#" @click.stop="confirmDialog = true">{{localeConf.self.action.delete}}</a>
        </span>
        <v-card>
          <v-card-title class="theme">
            <v-icon color="yellow" large style="padding-right:10px">warning</v-icon>
            <span class="headline">{{localeConf.self.message.deleteConfirmation}}</span>
          </v-card-title>
          <v-card-text>
            <span style="margin:auto">{{employee.employeeID}}: {{employee.name}} ({{employee.username}})</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat="flat" @click="confirmDialog = false">
              {{localeConf.self.btn.close}}
            </v-btn>
            <v-btn class="error" flat="flat" @click.stop="deleteEmployee(employee._id)">{{localeConf.self.action.delete}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </span>
  </span>
</template>

<script>
export default {
  name: 'EmployeeAction',
  props: {
    employee: {
      type: Object
    },
    fullControl: {
      type: Boolean,
      default: false
    },
    recordListQuery: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      sameAsCurrentUser:
        this.$cookie.get('loginuser') ===
        this.employee.username.toLocaleLowerCase(),
      confirmDialog: false
    }
  },
  methods: {
    deleteEmployee: function(id) {
      this.$emit('delete', id)
    },
    switchEmployee: function(id) {
      this.$emit('switch', id)
    }
  }
}
</script>

<style>
</style>
