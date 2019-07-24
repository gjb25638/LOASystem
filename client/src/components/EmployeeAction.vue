<template>
  <span>
    <span>
      <router-link
        v-bind:to="{ name: 'RecordList', params: { id: employee._id, query: query } }"
      >{{loalocale.self.records}}</router-link>
    </span>
    <span v-if="fullControl">
      |
      <router-link
        v-bind:to="{ name: 'Detail', params: { id: employee._id } }"
      >{{loalocale.self.edit}}</router-link>
    </span>
    <span v-else>
      |
      <router-link
        v-bind:to="{ name: 'Detail', params: { id: employee._id } }"
      >{{loalocale.self.view}}</router-link>
    </span>
    <span v-if="fullControl && !sameAsCurrentUser">
      |
      <a
        href="#"
        @click.stop="toggleEnable(employee._id)"
      >{{employee.enabled ? loalocale.self.disable : loalocale.self.enable}}</a>
    </span>
    <span v-if="fullControl && !employee.enabled">
      |
      <v-dialog v-model="dialog" max-width="320">
        <span slot="activator">
          <a href="#" @click.stop="dialog = true">{{loalocale.self.delete}}</a>
        </span>
        <v-card>
          <v-card-title class="theme">
            <v-icon color="yellow" large style="padding-right:10px">warning</v-icon>
            <span class="headline">{{loalocale.self.deletionConfirm}}</span>
          </v-card-title>
          <v-card-text>
            <span
              style="margin:auto"
            >{{employee.employeeID}}: {{employee.name}} ({{employee.username}})</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat="flat" @click="dialog = false">{{loalocale.self.close}}</v-btn>
            <v-btn
              class="error"
              flat="flat"
              @click.stop="deleteEmployee(employee._id)"
            >{{loalocale.self.delete}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </span>
  </span>
</template>
<script>
export default {
  name: "EmployeeAction",
  props: {
    employee: {
      type: Object
    },
    fullControl: {
      type: Boolean,
      default: false
    },
    query: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
    sameAsCurrentUser: false,
    dialog: false
  }),
  mounted() {
    this.sameAsCurrentUser =
      this.loginuser.username.toLocaleLowerCase() ===
      this.employee.username.toLocaleLowerCase();
  },
  methods: {
    deleteEmployee(id) {
      this.$emit("delete", id);
    },
    toggleEnable(id) {
      this.$emit("toggle", id);
    }
  }
};
</script>
<style>
</style>
