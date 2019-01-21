<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <table-menu
              :enabled="{ report: { type: 'month', year: yearOfReport }, export: true }"
              :title="`${yearOfReport} ${localeConf.report.th.years}`"
            ></table-menu>
            <v-card-title>
              <v-switch
                :label="localeConf.list.label.showAllPeople"
                v-if="fullControl"
                v-model="showAllPeople"
              ></v-switch>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                :label="localeConf.list.input.search"
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
                <tr :title="props.item.name + ' (' + props.item.username + ')'">
                  <td>{{ props.item.employeeID }}</td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.username }}</td>
                  <td style="min-width:120px">{{ props.item.dept }}</td>
                  <td style="min-width:120px">{{ props.item.arrivedDate }}</td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month1"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month2"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month3"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month4"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month5"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month6"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month7"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month8"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month9"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month10"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month11"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :class="generateDateTypeClass(data.dateType)"
                      v-for="data in props.item.month12"
                      :key="data.dateType"
                    >{{ generateSummary(data) }}</v-chip>
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
                  <td
                    style="min-width:100px"
                  >{{ generateDateTypeSummary(props.item.preManternity) }}</td>
                  <td
                    style="min-width:100px"
                  >{{ generateDateTypeSummary(props.item.manternityMiscarriage) }}</td>
                  <td
                    style="min-width:100px"
                  >{{ generateDateTypeSummary(props.item.accompanyingManternity) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.businessTrip) }}</td>
                  <td style="min-width:100px">{{ generateDateTypeSummary(props.item.others) }}</td>
                  <td
                    v-if="yearOfReport === currentYear"
                    style="min-width:100px"
                  >{{ generateDateTypeSummary(props.item.annualInfo) }}</td>
                  <td
                    v-if="yearOfReport === currentYear"
                    style="min-width:120px"
                  >{{ props.item.annualInfo.deadline }}</td>
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
import EmployeeService from "@/services/EmployeeService";
import TableMenu from "@/components/TableMenu";
import reportUtility from "@/reportUtility.js";
import utility from "@/utility.js";
export default {
  name: "AnnualReport",
  components: {
    "table-menu": TableMenu
  },
  data() {
    return {
      snackbar: false,
      snackbarText: "",
      search: "",
      headers: [],
      employees: [],
      fullControl: false,
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      yearOfReport: parseInt(this.$route.params.year),
      monthOfReport: new Date().getMonth() + 1,
      dialog: false,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDay: new Date().getDate(),
      showAllPeople: false
    };
  },
  computed: {
    filteredEmployees: function() {
      return this.employees.filter(e => this.showAllPeople || e.enabled);
    }
  },
  beforeCreate() {
    utility.checkingLoginStatus(this.$cookie, this.$router);
  },
  created() {
    reportUtility.basicHeaders
      .concat(
        reportUtility.generateColumns("month", this.yearOfReport),
        reportUtility.dateTypeHeaders,
        this.yearOfReport === this.currentYear
          ? reportUtility.annualInfoHeaders
          : []
      )
      .forEach(header => this.headers.push(header));
  },
  mounted() {
    this.getEmployees();
  },
  methods: {
    async getEmployee(employee) {
      const {
        data: {
          _id,
          employeeID,
          dept,
          name,
          username,
          arrivedDate,
          activatedDateTypes,
          records
        }
      } = await EmployeeService.get({
        id: employee._id,
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token")
      });

      const counterByMonth = Array.apply(null, { length: 13 }).map(v => {
        return {};
      });

      const annualDateType = activatedDateTypes.find(
        dt => dt.enabled && dt.name === "annual"
      );

      let annualRemainingDays = annualDateType ? annualDateType.totals.days : 0;
      const annualDeadlineDate = annualDateType
        ? new Date(annualDateType.deadline)
        : undefined;
      let annualDeadlineDateLastYear;
      if (annualDeadlineDate) {
        const adLastYear = annualDeadlineDate.getFullYear() - 1;
        const adMonth = annualDeadlineDate.getMonth();
        const adDay = annualDeadlineDate.getDate();
        annualDeadlineDateLastYear = annualDateType
          ? new Date(adLastYear, adMonth, adDay)
          : undefined;
      }

      records.filter(reportUtility.checkingSigned).forEach(record => {
        const availableDates = record.dates
          .map(reportUtility.parseDateString)
          .filter(
            dateObj =>
              dateObj &&
              (dateObj.year === this.yearOfReport &&
                (this.currentDay > 5
                  ? dateObj.month <= this.currentMonth
                  : dateObj.month < this.currentMonth))
          );

        availableDates.forEach(dateObj => {
          let counter = counterByMonth[dateObj.month][record.dateType];
          if (!counter) {
            counter = {
              days: 0,
              hours: 0
            };
          }

          if (
            annualDateType &&
            record.dateType === "annual" &&
            annualDeadlineDateLastYear &&
            dateObj.date > annualDeadlineDateLastYear
          ) {
            annualRemainingDays--;
          }

          counter = reportUtility.sumUpDaysNHours(
            counter.days,
            counter.hours,
            record.totals.halfHours
          );

          counterByMonth[dateObj.month][record.dateType] = counter;
        });
      });

      const counterByDateType = reportUtility.createObjectByKeys(
        reportUtility.dateTypes,
        {}
      );
      Object.keys(counterByDateType).forEach(
        key => (counterByDateType[key] = { days: 0, hours: 0 })
      );

      counterByMonth.forEach(month => {
        Object.keys(month).forEach(dateType => {
          const days = month[dateType].days;
          const hours = month[dateType].hours;
          let counter = counterByDateType[dateType];
          if (!counter) {
            if (dateType.startsWith(this.localeConf.report.th.compensatory)) {
              counter = counterByDateType["compensatory"];
              dateType = "compensatory";
            } else {
              counter = counterByDateType["others"];
              dateType = "others";
            }
          }
          counter = reportUtility.sumTotalDaysNHours(
            counter.days,
            counter.hours,
            days,
            hours
          );

          counterByDateType[dateType] = counter;
        });
      });

      const res = {
        _id,
        employeeID,
        dept,
        name,
        username,
        enabled: employee.enabled,
        arrivedDate: utility.formatDate(arrivedDate),
        annualInfo: {
          totalDays: annualDateType ? annualDateType.totals.days : 0,
          days: annualDateType ? annualRemainingDays : 0,
          deadline: annualDateType
            ? utility.formatDate(annualDateType.deadline)
            : ""
        }
      };

      counterByMonth.forEach(
        (month, index) =>
          (res["month" + index] = Object.keys(month).map(dateType => {
            return { dateType: dateType, counter: month[dateType] };
          }))
      );

      Object.keys(counterByDateType).forEach(
        dateType => (res[dateType] = counterByDateType[dateType])
      );
      return res;
    },
    async getEmployees() {
      const {
        data: { employees, fullControl }
      } = await EmployeeService.fetch({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token")
      });
      Promise.all(await employees.map(this.getEmployee)).then(
        res => (this.employees = res)
      );
      this.fullControl = fullControl;
    },
    generateSummary: reportUtility.generateSummary,
    generateDateTypeSummary: reportUtility.generateDateTypeSummary,
    generateDateTypeClass: reportUtility.generateDateTypeClass
  }
};
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
