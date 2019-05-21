<template>
  <v-app id="inspire">
    <page-container :title="loalocale.self.title" icon="view_list">
      <v-card class="elevation-12">
        <calendar-controller
          annual
          :calendarDate="calendarDate"
          @prev="(date) => calendarDate = date"
          @next="(date) => calendarDate = date"
          @tolastest="(date) => calendarDate = date"
        >
          <v-switch
            :label="loalocale.self.showResigners"
            v-if="fullControl"
            v-model="showResigners"
          ></v-switch>
        </calendar-controller>
        <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
        <v-data-table
          v-else
          :headers="headers"
          :items="filteredEmployees"
          item-key="_id"
          :rows-per-page-items="[{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td class="min-width-160">
                <employee-info :profile="props.item"></employee-info>
              </td>
              <td class="min-width-380">
                <v-data-iterator
                  :items="props.item.recordGroups.filter(x => x.list.length > 0)"
                  :rows-per-page-items="[12]"
                  content-tag="v-layout"
                  row
                  wrap
                  hide-actions
                >
                  <v-flex xs6 slot="item" slot-scope="subprops">
                    <v-card>
                      <v-card-title>
                        <h4>{{ subprops.item.month + 1 }}{{loalocale.self.month}}</h4>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-list dense>
                        <v-list-tile
                          v-for="(record, index) in subprops.item.list"
                          :key="index"
                          :class="generateleaveTypeClass(record.key)"
                        >
                          <v-list-tile-content>{{generateSummary({ leaveType: record.key, days: record.totals.days, hours: record.totals.hours })}}</v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-card>
                  </v-flex>
                </v-data-iterator>
              </td>
              <td class="min-width-380">
                <v-data-iterator
                  :items="props.item.leaveTypeGroups"
                  :rows-per-page-items="[props.item.leaveTypeGroups.length]"
                  content-tag="v-layout"
                  row
                  wrap
                  hide-actions
                >
                  <v-flex xs6 slot="item" slot-scope="subprops">
                    <v-card>
                      <v-list dense>
                        <v-list-tile :class="generateleaveTypeClass(subprops.item.key)">
                          <v-list-tile-content>{{generateSummary({ leaveType: subprops.item.key, days: subprops.item.totals.days, hours: subprops.item.totals.hours })}}</v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-card>
                  </v-flex>
                </v-data-iterator>
              </td>
              <td>
                <v-data-iterator
                  :items="props.item.annualInfo"
                  :rows-per-page-items="[props.item.annualInfo.length]"
                  content-tag="v-layout"
                  row
                  wrap
                  hide-actions
                >
                  <v-flex slot="item" slot-scope="subprops">
                    <v-card>
                      <v-card-title>
                        <h4>{{ subprops.item.deadline }}</h4>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-list dense>
                        <v-list-tile>
                          <v-list-tile-content>{{ subprops.item.totals.days }}/{{ subprops.item.totalDays }}</v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-card>
                  </v-flex>
                </v-data-iterator>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </page-container>
  </v-app>
</template>
<script>
import PageContainer from "@/components/PageContainer";
import CalendarController from "@/components/CalendarController";
import EmployeeInfo from "@/components/EmployeeInfo";
import EmployeeService from "@/services/EmployeeService";
import reportUtility from "@/reportUtility.js";
export default {
  name: "AnnualReport",
  components: {
    "page-container": PageContainer,
    "calendar-controller": CalendarController,
    "employee-info": EmployeeInfo
  },
  data: () => ({
    calendarDate: new Date(),
    headers: [],
    employees: [],
    fullControl: false,
    showResigners: false,
    loading: false
  }),
  computed: {
    filteredEmployees() {
      return this.employees.filter(e => this.showResigners || e.enabled);
    },
    year() {
      return this.calendarDate.getFullYear();
    }
  },
  created() {
    [
      {
        text: this.loalocale.self.employeeInfo,
        sortable: false,
        width: "200"
      },
      { text: this.loalocale.self.monthGroupStat, sortable: false },
      { text: this.loalocale.self.leaveTypeGroupStat, sortable: false },
      { text: this.loalocale.self.annualStat, sortable: false }
    ].forEach(header => this.headers.push(header));
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    async getRecords() {
      this.loading = true;
      const {
        data: { report, fullControl }
      } = await EmployeeService.getAnnualReport({
        year: this.year,
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      this.loading = false;
      this.employees = report;
      this.fullControl = fullControl;
    },
    generateSummary: reportUtility.generateSummary,
    generateleaveTypeClass: reportUtility.generateleaveTypeClass
  },
  watch: {
    calendarDate() {
      this.getRecords();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
