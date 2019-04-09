<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <menu-bar
              :enabled="{ list: true, compensatoryList: true, report: true, export: true }"
              :title="`${yearOfReport} ${localeConf.self.toolbar.year} ${monthOfReport} ${localeConf.self.toolbar.month}`"
            ></menu-bar>
            <v-card-title>
              <v-btn
                icon
                ripple
                @click="goToLatest()"
                :disabled="currentYear === yearOfReport && currentMonth === monthOfReport"
              >
                <v-icon>first_page</v-icon>
              </v-btn>
              <v-btn
                icon
                ripple
                @click="goToNext()"
                :disabled="currentYear === yearOfReport && currentMonth === monthOfReport"
              >
                <v-icon>keyboard_arrow_left</v-icon>
              </v-btn>
              <v-btn icon ripple @click="goToPrevious()">
                <v-icon>keyboard_arrow_right</v-icon>
              </v-btn>
              <v-switch :label="localeConf.self.label.showAll" v-if="fullControl" v-model="showAll"></v-switch>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                :label="localeConf.self.input.search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :search="search"
              :headers="headers"
              :items="filteredEmployees"
              item-key="_id"
              :rows-per-page-items="[10, 20, {'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="min-width-160">
                    {{ props.item.employeeID }}
                    <br>
                    {{ props.item.name }}
                    <br>
                    {{ props.item.username }}
                    <br>
                    {{ props.item.dept }}
                    <br>
                    {{ props.item.arrivedDate }}
                  </td>
                  <td class="min-width-380">
                    <v-data-iterator
                      :items="props.item.recordGroups.filter(x => x.list.length > 0)"
                      :rows-per-page-items="[31]"
                      content-tag="v-layout"
                      row
                      wrap
                      hide-actions
                    >
                      <v-flex slot="item" slot-scope="subprops">
                        <v-card>
                          <v-card-title>
                            <h4>{{ subprops.item.day + 1 }}{{localeConf.self.toolbar.day}}</h4>
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-list dense>
                            <v-list-tile v-for="(record, index) in subprops.item.list" :key="index">
                              <v-list-tile-content>{{generateSummary({ dateType: record.key, counter: record.totals })}}</v-list-tile-content>
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
                      <v-flex slot="item" slot-scope="subprops">
                        <v-card>
                          <v-list dense>
                            <v-list-tile>
                              <v-list-tile-content>{{generateSummary({ dateType: subprops.item.key, counter: subprops.item.totals })}}</v-list-tile-content>
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
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import EmployeeService from "@/services/EmployeeService";
import MenuBar from "@/components/Shared/MenuBar";
import reportUtility from "@/reportUtility.js";

export default {
  name: "MonthlyReport",
  components: {
    "menu-bar": MenuBar
  },
  data() {
    return {
      search: "",
      headers: [],
      employees: [],
      fullControl: false,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      yearOfReport: new Date().getFullYear(),
      monthOfReport: new Date().getMonth() + 1,
      showAll: false
    };
  },
  computed: {
    filteredEmployees: function() {
      return this.employees.filter(e => this.showAll || e.enabled);
    }
  },
  created() {
    [
      {
        text: this.localeConf.self.th.employeeInfo,
        sortable: false
      },
      { text: this.localeConf.self.th.dateGroupStat, sortable: false },
      { text: this.localeConf.self.th.leaveTypeGroupStat, sortable: false }
    ].forEach(header => this.headers.push(header));
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    goToLatest() {
      this.yearOfReport = this.currentYear;
      this.monthOfReport = this.currentMonth;
      this.getRecords();
    },
    goToNext() {
      if (this.monthOfReport === 12) {
        this.yearOfReport++;
        this.monthOfReport = 1;
      } else {
        this.monthOfReport++;
      }
      this.getRecords();
    },
    goToPrevious() {
      if (this.monthOfReport === 1) {
        this.yearOfReport--;
        this.monthOfReport = 12;
      } else {
        this.monthOfReport--;
      }
      this.getRecords();
    },
    async getRecords() {
      const {
        data: { report, fullControl }
      } = await EmployeeService.getMonthlyReport({
        year: this.yearOfReport,
        month: this.monthOfReport,
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token")
      });
      this.employees = report;
      this.fullControl = fullControl;
    },
    generateSummary: reportUtility.generateSummary
  }
};
</script>
<style lang="scss" scoped>
</style>
