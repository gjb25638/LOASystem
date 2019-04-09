<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <menu-bar></menu-bar>
            <v-card-title>
              <v-switch :label="localeConf.self.switch.showAll" v-if="fullControl" v-model="showAll"></v-switch>
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="search" :label="localeConf.self.input.search" hide-details></v-text-field>
            </v-card-title>
            <v-data-table must-sort :search="search" :headers="headers" :items="filteredEmployees" item-key="_id" :rows-per-page-items="[10, 20, {'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]">
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded" :class="props.item.enabled ? '' : 'disabled'">
                  <td>
                    {{ props.item.employeeID }}
                  </td>
                  <td class="min-width-120">{{ props.item.name }}
                    <v-badge left v-if="props.item.unSigningRecords.length > 0">
                      <v-icon color="blue">textsms</v-icon>
                    </v-badge>
                  </td>
                  <td>{{ props.item.username }}</td>
                  <td class="min-width-120">{{ props.item.dept }}</td>
                  <td class="min-width-160">{{ formatDate(props.item.arrivedDate) }}</td>
                  <td class="min-width-380">
                    <employee-action :key="props.item._id" :employee="props.item" :full-control="fullControl" @delete="deleteEmployee" @switch="switchEmployee"></employee-action>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat>
                  <v-list v-if="props.item.enabled">
                    <signing-block v-for="record in props.item.unSigningRecords" :key="record._id" :employee="props.item" :record="record" @sign="sign"></signing-block>
                  </v-list>
                </v-card>
              </template>
            </v-data-table>
            <v-card-text style="height: 100px; position: relative">
              <v-btn absolute dark fab bottom right class="theme" @click="createEmployee" v-if="fullControl">
                <v-icon>add</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <leave-type-refreshed-notification v-model="leaveTypesRefreshedNotification" @close="leaveTypesRefreshedNotification = false" :leave-types="$route.params.logs" :full-control="fullControl"></leave-type-refreshed-notification>
    <system-notification v-model="systemNotification" @close="systemNotification.visible = false">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </v-app>
</template>

<script>
import EmployeeService from '@/services/EmployeeService'
import MenuBar from '@/components/Shared/MenuBar'
import EmployeeAction from '@/components/Shared/EmployeeAction'
import SigningBlock from '@/components/List/SigningBlock'
import SystemNotification from '@/components/Shared/SystemNotification'
import LeaveTypeRefreshedNotification from '@/components/List/LeaveTypeRefreshedNotification'
import utility from '@/utility'
import leaveTypesRefreshed from '@/fake/leaveTypesRefreshed'
export default {
  name: 'List',
  components: {
    'menu-bar': MenuBar,
    'employee-action': EmployeeAction,
    'signing-block': SigningBlock,
    'system-notification': SystemNotification,
    'leave-type-refreshed-notification': LeaveTypeRefreshedNotification
  },
  data() {
    return {
      leaveTypesRefreshedNotification: false,
      systemNotification: {
        level: 'warning',
        text: '',
        visible: false
      },
      search: '',
      headers: [],
      employees: [],
      fullControl: false,
      showAll: false
    }
  },
  computed: {
    filteredEmployees: function() {
      return this.employees.filter(e => this.showAll || e.enabled)
    }
  },
  created() {
    this.headers = [
      { text: this.localeConf.self.th.employeeID, value: 'employeeID' },
      { text: this.localeConf.self.th.name, value: 'name' },
      { text: this.localeConf.self.th.username, value: 'username' },
      { text: this.localeConf.self.th.dept, value: 'dept' },
      { text: this.localeConf.self.th.arrivedDate, value: 'arrivedDate' },
      { text: this.localeConf.self.th.action, value: '' }
    ]
  },
  mounted() {
    this.getEmployees()
    this.$route.params.logs = leaveTypesRefreshed
    this.leaveTypesRefreshedNotification =
      this.$route.params.logs && this.$route.params.logs.length > 0
  },
  methods: {
    async getEmployees() {
      const { data: { employees, fullControl } } = await EmployeeService.fetch({
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token')
      })
      if (employees) {
        this.employees = employees.map(e => {
          e.unSigningRecords = e.unSigningRecords.map(r =>
            Object.assign({}, r, utility.lookUpLeaveTypeIconNClass(r.dateType))
          )
          return e
        })
      }
      this.fullControl = fullControl
    },
    async switchEmployee(id) {
      await EmployeeService.switch({
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token'),
        id: id
      })
      this.getEmployees()
    },
    async deleteEmployee(id) {
      await EmployeeService.delete({
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token'),
        id: id
      })
      this.getEmployees()
    },
    createEmployee() {
      this.$router.push({
        name: 'Detail',
        params: { id: 'new' }
      })
    },
    async sign(id, recordID, pass) {
      const { data: { success, message } } = await EmployeeService.updateSign({
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token'),
        id: id,
        recordID: recordID,
        pass: pass
      })
      if (success) {
        this.getEmployees()
      } else {
        this.systemNotification.text = utility.lookUpCustomMessage(
          message,
          this.localeConf.self.message
        )
        this.systemNotification.visible = true
      }
    },
    formatDate: utility.formatDate
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #007bff !important;
  text-decoration: none;
}
a.add_link {
  background: #007bff;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
.disabled {
  background-color: #eee;
  color: lightgray;
}
</style>
