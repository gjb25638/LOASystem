<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <v-toolbar flat class="theme">
              <v-toolbar-title>
                {{year}} {{localeConf.report.th.years}} {{month}} {{localeConf.report.th.months}}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-title>
                <v-tooltip bottom>
                  <v-btn icon ripple color="white" @click="exportExcel" slot="activator">
                    <v-icon>cloud_download</v-icon>
                  </v-btn>
                  <div>{{localeConf.report.tooltip.export}}</div>
                </v-tooltip>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-title>
              <v-switch :label="localeConf.list.label.showAllPeople" v-if="fullControl" v-model="showAllPeople"></v-switch>
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="search" :label="localeConf.list.input.search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table :search="search" :headers="headers" :items="filteredEmployees" item-key="_id" :rows-per-page-items="[10, 20, {'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]">
              <template slot="items" slot-scope="props">
                <tr :title="props.item.name + ' (' + props.item.username + ')'">
                  <td>{{ props.item.employeeID }}</td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.username }}</td>
                  <td style="min-width:120px">{{ props.item.dept }}</td>
                  <td style="min-width:120px">{{ props.item.arrivedDate }}</td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day1" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day2" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day3" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day4" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day5" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day6" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day7" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day8" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day9" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day10" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day11" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day12" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day13" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day14" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day15" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day16" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day17" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day18" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day19" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day20" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day21" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day22" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day23" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day24" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day25" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day26" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day27" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day28" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day29" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td v-if="[1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(month)">
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day30" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td v-if="[1, 3, 5, 7, 8, 10, 12].includes(month)">
                    <v-chip :class="generateDateTypeClass(data.dateType)" v-for="data in props.item.day31" :key="data.dateType">
                      {{ generateSummary(data) }}
                    </v-chip>
                  </td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.annual) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.compensatory) }}</td>
                  <td>{{ props.item.statutory}}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.marriage) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.funeral) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.menstrual) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.sick) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.personal) }}</td>
                  <td>{{ props.item.derelictionOfDuty}}</td>
                  <td>{{ props.item.late}}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.familyCare) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.preManternity) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.manternityMiscarriage) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.accompanyingManternity) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.businessTrip) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.others) }}</td>
                </tr>
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
import reportUtility from '@/reportUtility.js'
import utility from '@/utility.js'
export default {
  name: 'MonthlyReport',
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      search: '',
      headers: [],
      employees: [],
      fullControl: false,
      month: parseInt(this.$route.params.month),
      year: parseInt(this.$route.params.year),
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
    reportUtility.basicHeaders
      .concat(
        reportUtility.generateColumns('day', this.month),
        reportUtility.dateTypeHeaders
      )
      .forEach(header => this.headers.push(header))
  },
  mounted() {
    this.getEmployees()
  },
  methods: {
    async getEmployee(employee) {
      const {
        data: { employeeID, dept, name, username, arrivedDate, records }
      } = await EmployeeService.get({
        id: employee._id,
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token')
      })

      const counterByDay = Array.apply(null, {
        length: new Date(this.year, this.month, 0).getDate() + 1
      }).map((v, i) => {
        return {}
      })

      records.filter(reportUtility.checkingSigned).forEach(record => {
        const availableDates = record.dates
          .map(reportUtility.parseDateString)
          .filter(dateObj => dateObj.month === this.month)

        availableDates.forEach(dateObj => {
          let counter = counterByDay[dateObj.day][record.dateType]
          if (!counter) {
            counter = { days: 0, hours: 0 }
          }

          counter = reportUtility.sumUpDaysNHours(
            counter.days,
            counter.hours,
            record.totals.halfHours
          )

          counterByDay[dateObj.day][record.dateType] = counter
        })
      })

      const counterByDateType = reportUtility.createObjectByKeys(
        reportUtility.dateTypes,
        {}
      )

      Object.keys(counterByDateType).forEach(
        key => (counterByDateType[key] = { days: 0, hours: 0 })
      )

      counterByDay.forEach(day => {
        Object.keys(day).forEach(dateType => {
          const days = day[dateType].days
          const hours = day[dateType].hours
          let counter = counterByDateType[dateType]
          if (!counter) {
            if (dateType.startsWith(this.localeConf.report.th.compensatory)) {
              counter = counterByDateType['compensatory']
              dateType = 'compensatory'
            } else {
              counter = counterByDateType['others']
              dateType = 'others'
            }
          }
          counter = reportUtility.sumTotalDaysNHours(
            counter.days,
            counter.hours,
            days,
            hours
          )

          counterByDateType[dateType] = counter
        })
      })

      const res = {
        employeeID,
        dept,
        name,
        username,
        enabled: employee.enabled,
        arrivedDate: utility.formatDate(arrivedDate)
      }

      counterByDay.forEach(
        (day, index) =>
          (res['day' + index] = Object.keys(day).map(dateType => {
            return { dateType: dateType, counter: day[dateType] }
          }))
      )
      Object.keys(counterByDateType).forEach(
        dateType => (res[dateType] = counterByDateType[dateType])
      )

      return res
    },
    async getEmployees() {
      const { data: { employees, fullControl } } = await EmployeeService.fetch({
        loginuser: this.$cookie.get('loginuser'),
        token: this.$cookie.get('token')
      })
      Promise.all(await employees.map(this.getEmployee)).then(
        res => (this.employees = res)
      )
      this.fullControl = fullControl
    },
    exportExcel: () =>
      utility.exportExcel(document.querySelector('table').outerHTML),
    generateSummary: reportUtility.generateSummary,
    generateDateTypeSummary: reportUtility.generateDateTypeSummary,
    generateDateTypeClass: reportUtility.generateDateTypeClass
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
}
</style>
