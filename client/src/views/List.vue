<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <v-toolbar flat class="theme">
              <v-spacer></v-spacer>
              <v-toolbar-title>
                <v-tooltip bottom>
                  <v-btn slot="activator" icon ripple color="white" @click="$router.push({ name: 'CompensatoryReport' })">
                    <v-icon>event</v-icon>
                  </v-btn>
                  <div>{{localeConf.report.th.compensatory}}{{localeConf.list.tooltip.report}}</div>
                </v-tooltip>
              </v-toolbar-title>
              <v-toolbar-title>
                <v-tooltip bottom>
                  <v-dialog ref="dialog" v-model="dialog" lazy full-width width="210px" slot="activator">
                    <v-btn slot="activator" icon ripple color="white">
                      <v-icon>format_list_bulleted</v-icon>
                    </v-btn>
                    <v-card>
                      <v-card-title class="theme">
                        <span class="headline">{{localeConf.list.dialog.report}}</span>
                        <v-spacer></v-spacer>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field :label="localeConf.list.input.report" v-model="yearOfReport"></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat @click="dialog = false">{{localeConf.list.btn.close}}</v-btn>
                        <v-btn class="theme" flat @click.native="toReportPage(yearOfReport)">{{localeConf.list.btn.report}}</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <div>{{localeConf.list.tooltip.report}}</div>
                </v-tooltip>
              </v-toolbar-title>
              <v-toolbar-title>
                <v-tooltip bottom>
                  <v-btn icon ripple color="white" @click="logout($cookie, $router)" slot="activator">
                    <v-icon>power_settings_new</v-icon>
                  </v-btn>
                  <div>{{localeConf.list.tooltip.logout}}</div>
                  <div>({{localeConf.list.tooltip.loginuser}}: {{$cookie.get('loginuser')}})</div>
                </v-tooltip>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-title>
              <v-switch :label="localeConf.list.label.showAllPeople" v-if="fullControl" v-model="showAllPeople"></v-switch>
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="search" :label="localeConf.list.input.search" hide-details></v-text-field>
            </v-card-title>
            <v-data-table must-sort :search="search" :headers="headers" :items="filteredEmployees" item-key="_id" :rows-per-page-items="[10, 20, {'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]">
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded" :class="!props.item.enabled ? ['disabled'] : []">
                  <td>
                    <v-badge left v-if="props.item.unSigningRecords.length > 0">
                      <span slot="badge">{{props.item.unSigningRecords.length}}</span>
                    </v-badge>
                    {{ props.item.employeeID }}
                  </td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.username }}</td>
                  <td style="min-width:120px">{{ props.item.dept }}</td>
                  <td style="min-width:120px">{{ props.item.arrivedDate ? props.item.arrivedDate.substr(0, 10) : '' }}</td>
                  <td style="min-width:120px">
                    <router-link v-bind:to="{ name: 'RecordList', params: { id: props.item._id } }">{{localeConf.list.td.records}}</router-link>
                    <span v-if="fullControl || $cookie.get('loginuser') === props.item.username.toLocaleLowerCase()">|
                      <router-link v-bind:to="{ name: 'Detail', params: { id: props.item._id } }">{{localeConf.list.td.edit}}</router-link>
                    </span>
                    <span v-if="fullControl && $cookie.get('loginuser') !== props.item.username.toLocaleLowerCase()"> |
                      <a href="#" @click.stop="switchEmployee(props.item._id)">{{props.item.enabled ? localeConf.list.td.disable : localeConf.list.td.enable}}</a>
                    </span>
                    <span v-if="fullControl && !props.item.enabled"> |
                      <v-dialog v-model="props.item.confirmToDeleteEmployeeDialog" max-width="290">
                        <a slot="activator" href="#" @click.stop="props.item.confirmToDeleteEmployeeDialog = true">{{localeConf.list.td.delete}}</a>
                        <v-card>
                          <v-card-title class="theme">{{localeConf.list.message.confirmToDeleteEmployee}}</v-card-title>
                          <v-card-text>{{props.item.employeeID}}: {{props.item.name}} ({{props.item.username}})</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat="flat" @click="props.item.confirmToDeleteEmployeeDialog = false">
                              {{localeConf.list.btn.close}}
                            </v-btn>
                            <v-btn class="error" flat="flat" @click="deleteEmployee(props.item._id)">{{localeConf.list.td.delete}}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </span>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat>
                  <v-list v-if="props.item.enabled">
                    <v-list-tile v-for="record in props.item.unSigningRecords" :key="record._id">
                      <v-list-tile-avatar>
                        <v-icon riple :class="record.class">{{record.icon}}</v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{localeConf.detail.dateTypes[record.dateType] ? localeConf.detail.dateTypes[record.dateType] : record.dateType}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{generateSummary(record.dates, record.startFrom, record.endTo)}}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action v-if="props.item.username.toLocaleLowerCase() !== $cookie.get('loginuser')">
                        <small>{{localeConf.list.td.sign}}:</small>
                      </v-list-tile-action>
                      <v-list-tile-action v-if="props.item.username.toLocaleLowerCase() !== $cookie.get('loginuser')">
                        <v-tooltip bottom>
                          <v-btn icon ripple @click="sign(props.item._id, record._id, true)" slot="activator">
                            <v-icon color="green">check_circle</v-icon>
                          </v-btn>
                          <div>{{localeConf.recordlist.td.pass}}</div>
                        </v-tooltip>
                      </v-list-tile-action>
                      <v-list-tile-action v-if="props.item.username.toLocaleLowerCase() !== $cookie.get('loginuser')">
                        <v-tooltip bottom>
                          <v-btn icon ripple @click="sign(props.item._id, record._id, false)" slot="activator">
                            <v-icon color="red">cancel</v-icon>
                          </v-btn>
                          <div>{{localeConf.recordlist.td.reject}}</div>
                        </v-tooltip>
                      </v-list-tile-action>
                      <v-list-tile-action>
                        <small>{{localeConf.list.td.signed}}:</small>
                      </v-list-tile-action>
                      <v-list-tile-action>
                        <v-tooltip bottom>
                          <v-rating slot="activator" readonly v-model="record.signings.length" :length="record.signings.length"></v-rating>
                          <div v-for="signing in record.signings" :key="signing._id">
                            <div>
                              {{signing.name}} ({{signing.username}})
                            </div>
                            <div>
                              {{localeConf.recordlist.tooltip.signed}} {{(new Date(signing.signedDate)).toLocaleString()}}
                            </div>
                          </div>
                        </v-tooltip>
                      </v-list-tile-action>
                    </v-list-tile>
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
    <v-snackbar v-model="snackbar" :color="snackColor" :multi-line="true" :timeout="0" auto-height>
      <div>
        <h4>{{localeConf.list.message.dateTypeReset}}</h4>
        <div v-for="snackbarText in snackbarTexts" :key="snackbarText.index">
          <small>{{snackbarText.text}}</small>
        </div>
      </div>
      <v-btn dark flat @click="snackbar = false">X</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import EmployeeService from '@/services/EmployeeService'
import defaultConf from '@/default.js'
import utility from '@/utility.js'
export default {
  name: 'List',
  data() {
    return {
      snackbar: false,
      snackbarTexts: [],
      snackColor: '',
      search: '',
      headers: [],
      employees: [],
      fullControl: false,
      dialog: false,
      yearOfReport: new Date().getFullYear(),
      showAllPeople: false
    }
  },
  computed: {
    filteredEmployees: function() {
      return this.employees.filter(e => this.showAllPeople || e.enabled)
    }
  },
  beforeCreate() {
    utility.checkingLoginStatus(this.$cookie, this.$router)
  },
  created() {
    this.headers = [
      { text: this.localeConf.list.th.employeeID, value: 'employeeID' },
      { text: this.localeConf.list.th.name, value: 'name' },
      { text: this.localeConf.list.th.username, value: 'username' },
      { text: this.localeConf.list.th.dept, value: 'dept' },
      { text: this.localeConf.list.th.arrivedDate, value: 'arrivedDate' },
      { text: this.localeConf.list.th.action, value: '' }
    ]
  },
  mounted() {
    this.getEmployees()
  },
  methods: {
    async getEmployees() {
      const { data: { employees, fullControl } } = await EmployeeService.fetch({
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token')
      })
      if (employees) {
        this.employees = employees.map(e => {
          e.unSigningRecords = e.unSigningRecords.map(r => {
            const dt = defaultConf.dateTypes.find(dt => dt.name === r.dateType)
            return Object.assign({}, r, {
              icon: dt ? dt.icon : defaultConf.customDateType.icon,
              class: dt ? dt.class : defaultConf.customDateType.class
            })
          })
          e.confirmToDeleteEmployeeDialog = false
          return e
        })
      }
      this.fullControl = fullControl
      if (this.$route.params.logs && this.$route.params.logs.length > 0) {
        this.showDateTypeResetInfo(this.$route.params.logs)
      }
    },
    showDateTypeResetInfo(logs) {
      this.snackbar = true
      this.snackColor = 'info'
      this.snackbarTexts = logs
        .filter(
          dt =>
            this.fullControl ||
            ['annual', 'menstrual'].some(name => name === dt.name)
        )
        .map((dt, index) => {
          return {
            index,
            text: `${index + 1}. ${
              this.localeConf.detail.dateTypes[dt.name]
            } [${utility.formatDate(dt.deadline)}] (${dt.totals.days})`
          }
        })
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
      const response = await EmployeeService.updateSign({
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token'),
        id: id,
        recordID: recordID,
        pass: pass
      })
      if (response.data.success) {
        this.getEmployees()
      } else {
        this.snackbar = true
        this.snackColor = 'error'
        this.snackbarText = response.data.message
      }
    },
    generateSummary: utility.generateSummary,
    logout: (cookie, router) => utility.logout(cookie, router),
    toReportPage(year) {
      const [y] = /^\d{4}$/.exec(year)
      if (y) {
        this.$router.push({ name: 'AnnualReport', params: { year: y } })
      }
    }
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
.theme {
  background: linear-gradient(
    to right,
    rgba(225, 56, 89, 1) 0%,
    rgba(195, 43, 127, 1) 35%,
    rgba(146, 49, 140, 1) 65%,
    rgba(78, 56, 130, 1) 100%
  ) !important;
  color: white !important;
}
.disabled {
  background-color: #eee;
  color: lightgray;
}
</style>
