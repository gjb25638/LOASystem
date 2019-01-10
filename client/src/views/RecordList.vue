<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <v-toolbar flat class="theme">
              <v-tooltip bottom>
                <v-toolbar-title slot="activator">
                  <v-icon color="white">person</v-icon>
                  {{name}} ({{username}})
                </v-toolbar-title>
                <div>{{localeConf.recordlist.tooltip.dept}} {{dept}}</div>
                <div>{{localeConf.recordlist.tooltip.employeeID}} {{employeeID}}</div>
                <div>{{localeConf.recordlist.tooltip.name}} {{name}}</div>
                <div>{{localeConf.recordlist.tooltip.username}} {{username}}</div>
                <div>{{localeConf.recordlist.tooltip.arrivedDate}} {{arrivedDate}}</div>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-toolbar-title>
                <v-tooltip bottom>
                  <v-btn slot="activator" icon ripple color="white" @click="exportExcel">
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                  <div>{{localeConf.report.tooltip.export}}</div>
                </v-tooltip>
              </v-toolbar-title>
              <v-toolbar-title>
                <v-tooltip bottom>
                  <v-btn slot="activator" icon ripple color="white" @click="logout($cookie, $router)">
                    <v-icon>power_settings_new</v-icon>
                  </v-btn>
                  <div>{{localeConf.list.tooltip.logout}}</div>
                  <div>({{localeConf.list.tooltip.loginuser}}: {{$cookie.get('loginuser')}})</div>
                </v-tooltip>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="search" :label="localeConf.list.input.search" single-line></v-text-field>
            </v-card-title>
            <v-data-table :pagination.sync="pagination" :search="search" :headers="headers" :items="records" class="elevation-1" :rows-per-page-items="[10, 20, {'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]">
              <template slot="items" slot-scope="props">
                <tr>
                  <td style="min-width:120px">{{ props.item.appliedDate }}</td>
                  <td style="min-width:120px">{{ generateSummary(props.item.dates, props.item.startFrom, props.item.endTo) }}</td>
                  <td>{{ generateConsumeSummary(props.item.dates, props.item.startFrom, props.item.endTo) }}</td>
                  <td style="min-width:120px">
                    <v-tooltip bottom>
                      <div slot="activator">
                        <v-icon :class="props.item.class" v-if="false">{{props.item.icon}}</v-icon>
                        {{ props.item.dateType }}
                      </div>
                      <div v-if="fullControl || props.item.countdown">
                        <div>{{localeConf.detail.dialog.consumes}} {{props.item.activatedDateType.consumes.days}} {{localeConf.detail.dialog.input.days}}
                          <span v-if="props.item.activatedDateType.halfHoursEnabled"> {{props.item.activatedDateType.consumes.halfHours / 2}} {{localeConf.detail.dialog.input.hours}}</span>
                        </div>
                        <div>{{localeConf.detail.dialog.totals}} {{props.item.activatedDateType.totals.days}} {{localeConf.detail.dialog.input.days}}
                          <span v-if="props.item.activatedDateType.halfHoursEnabled"> {{props.item.activatedDateType.totals.halfHours / 2}} {{localeConf.detail.dialog.input.hours}}</span>
                        </div>
                        <div v-if="props.item.activatedDateType.deadline">
                          {{localeConf.detail.dialog.deadline}} {{props.item.activatedDateType.deadline}}
                        </div>
                      </div>
                    </v-tooltip>
                  </td>
                  <td style="min-width:100px">{{ props.item.agent }}</td>
                  <td>
                    <div v-for="signing in props.item.signings" :key="signing._id">
                      <v-tooltip bottom>
                        <v-chip :color="signing.pass ? 'green' : 'red'" text-color="white" slot="activator">
                          [{{signing.pass ? localeConf.recordlist.td.pass : localeConf.recordlist.td.reject }}] {{signing.name}}
                        </v-chip>
                        <div>
                          <div>{{localeConf.recordlist.tooltip.dept}} {{signing.dept}}</div>
                          <div>{{localeConf.recordlist.tooltip.name}} {{signing.name}}</div>
                          <div>{{localeConf.recordlist.tooltip.username}} {{signing.username}}</div>
                          <div>{{localeConf.recordlist.tooltip.signed}} {{new Date(signing.signedDate).toLocaleString()}}</div>
                        </div>
                      </v-tooltip>
                    </div>
                  </td>
                  <td>
                    <v-tooltip bottom>
                    <v-btn slot="activator" icon ripple @click="sign(id, props.item._id, false)" v-if="fullControl && props.item.signings.every(signing => signing.pass)">
                      <v-icon color="red">cancel</v-icon>
                    </v-btn>
                    <div>{{localeConf.recordlist.td.reject}}</div>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat>
                  <v-card-text>{{props.item.name}}</v-card-text>
                </v-card>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" color="error" :multi-line="true" :timeout="3000">
      {{ snackbarText }}
      <v-btn dark flat @click="snackbar = false">X</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import EmployeeService from '@/services/EmployeeService'
import defaultConf from '@/default.js'
import utility from '@/utility.js'
export default {
  name: 'RecordList',
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      search: '',
      headers: [],
      records: [],
      fullControl: false,
      id: '',
      employeeID: '',
      dept: '',
      name: '',
      username: '',
      arrivedDate: '',
      level: '',
      pagination: {
        sortBy: 'appliedDate',
        descending: true
      }
    }
  },
  beforeCreate() {
    utility.checkingLoginStatus(this.$cookie, this.$router)
  },
  created() {
    this.headers = [
      {
        text: this.localeConf.recordlist.th.appliedDate,
        value: 'appliedDate',
        width: 120,
        sortable: false
      },
      {
        text: this.localeConf.recordlist.th.dates,
        value: '',
        sortable: false
      },
      {
        text: this.localeConf.recordlist.th.totals,
        value: '',
        sortable: false
      },
      {
        text: this.localeConf.recordlist.th.dateType,
        value: 'dateType',
        width: 150,
        sortable: false
      },
      {
        text: this.localeConf.recordlist.th.agent,
        value: 'agent',
        sortable: false
      },
      {
        text: this.localeConf.recordlist.th.signings,
        value: 'signings',
        sortable: false
      },
      {
        text: this.localeConf.list.th.action,
        value: '',
        sortable: false
      }
    ]
  },
  mounted() {
    this.getRecords()
  },
  methods: {
    async getRecords() {
      const {
        data: {
          _id,
          employeeID,
          dept,
          name,
          username,
          arrivedDate,
          level,
          activatedDateTypes,
          records,
          fullControl
        }
      } = await EmployeeService.get({
        id: this.$route.params.id,
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token')
      })
      this.employeeID = employeeID
      this.dept = dept
      this.name = name
      this.username = username
      this.arrivedDate = utility.formatDate(arrivedDate)
      this.level = level
      const dateTypes = defaultConf.dateTypes
      this.records = records.map(record => {
        const dt = dateTypes.find(dt => dt.name === record.dateType)
        let dtTitle = this.localeConf.detail.dateTypes[record.dateType]
        if (!dtTitle) {
          dtTitle = record.dateType
        }
        const activatedDt = activatedDateTypes.find(
          dt => dt.name === record.dateType
        )
        activatedDt.deadline = utility.formatDate(activatedDt.deadline)
        return Object.assign({}, record, {
          appliedDate: utility.formatDate(record.appliedDate),
          activatedDateType: activatedDt,
          dateType: dtTitle,
          icon: dt ? dt.icon : defaultConf.customDateType.icon,
          class: dt ? dt.class : defaultConf.customDateType.class,
          countdown: dt ? dt.countdown : defaultConf.customDateType.countdown
        })
      })
      this.fullControl = fullControl
      this.id = _id
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
        this.getRecords()
      } else {
        this.snackbar = true
        this.snackbarText = response.data.message
      }
    },
    generateConsumeSummary: utility.generateConsumeSummary,
    calculateTotalHours: utility.calculateTotalHours,
    formatDate: utility.formatDate,
    generateSummary: utility.generateSummary,
    logout: (cookie, router) => utility.logout(cookie, router),
    exportExcel: () =>
      utility.exportExcel(document.querySelector('table').outerHTML)
  }
}
</script>
<style lang="scss" scoped>
.theme {
  background: linear-gradient(
    to right,
    rgba(225, 56, 89, 1) 0%,
    rgba(195, 43, 127, 1) 35%,
    rgba(146, 49, 140, 1) 65%,
    rgba(78, 56, 130, 1) 100%
  ) !important;
  color: white !important;
  float: right;
}
</style>
