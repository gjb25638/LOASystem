<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <table-menu :enabled="{ export: true }"></table-menu>
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
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              must-sort
              :search="search"
              :headers="headers"
              :items="filteredEmployees"
              item-key="_id"
              :rows-per-page-items="[10, 20, {'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
            >
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td>{{ props.item.employeeID }}</td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.username }}</td>
                  <td style="min-width:120px">{{ props.item.dept }}</td>
                  <td
                    style="min-width:120px"
                  >{{ props.item.arrivedDate ? props.item.arrivedDate.substr(0, 10) : '' }}</td>
                  <td style="min-width:150px">{{ generateDateTypeSummary(props.item.compensatory) }}</td>
                  <td style="min-width:120px">
                    <router-link
                      v-bind:to="{ name: 'RecordList', params: { id: props.item._id } }"
                    >{{localeConf.list.td.records}}</router-link>
                    <router-link
                      v-if="fullControl || $cookie.get('loginuser') === props.item.username.toLocaleLowerCase()"
                      v-bind:to="{ name: 'Detail', params: { id: props.item._id } }"
                    >| {{localeConf.list.td.edit}}</router-link>
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
import TableMenu from "@/components/TableMenu";
import reportUtility from "@/reportUtility.js";
import utility from "@/utility.js";
export default {
  name: "List",
  data() {
    return {
      search: "",
      headers: [],
      employees: [],
      fullControl: false,
      dialog: false,
      yearOfReport: new Date().getFullYear(),
      showAllPeople: false
    };
  },
  components: {
    "table-menu": TableMenu
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
    this.headers = [
      {
        text: this.localeConf.list.th.employeeID,
        value: "employeeID",
        sortable: false
      },
      { text: this.localeConf.list.th.name, value: "name", sortable: false },
      {
        text: this.localeConf.list.th.username,
        value: "username",
        sortable: false
      },
      { text: this.localeConf.list.th.dept, value: "dept", sortable: false },
      {
        text: this.localeConf.list.th.arrivedDate,
        value: "arrivedDate",
        sortable: false
      },
      {
        text: this.localeConf.list.th.compensatory,
        value: "compensatory",
        sortable: false
      },
      { text: this.localeConf.list.th.action, value: "", sortable: false }
    ];
  },
  mounted() {
    this.getEmployees();
  },
  methods: {
    async getEmployees() {
      const {
        data: { employees, fullControl }
      } = await EmployeeService.fetch({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token")
      });
      Promise.all(await employees.map(this.getEmployee)).then(
        res => (this.employees = res.filter(e => e))
      );
      this.fullControl = fullControl;
    },
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

      let compensatoryDateTypes = activatedDateTypes.filter(dt =>
        dt.name.startsWith(this.localeConf.report.th.compensatory)
      );
      if (compensatoryDateTypes.length > 0) {
        let compensatory = {
          days: 0,
          hours: 0
        };

        records
          .filter(r =>
            r.dateType.startsWith(this.localeConf.report.th.compensatory)
          )
          .forEach(r => {
            compensatory = reportUtility.sumUpDaysNHours(
              compensatory.days,
              compensatory.hours,
              r.totals.halfHours,
              r.totals.days
            );
          });

        compensatory["totalDays"] = compensatoryDateTypes.reduce(
          (acc, cur) => acc + cur.totals.days,
          0
        );
        compensatory["totalHours"] = compensatoryDateTypes.reduce(
          (acc, cur) => acc + cur.totals.halfHours / 2,
          0
        );

        return {
          _id,
          employeeID,
          dept,
          name,
          username,
          enabled: employee.enabled,
          arrivedDate,
          compensatory
        };
      } else {
        return undefined;
      }
    },
    generateDateTypeSummary: reportUtility.generateDateTypeSummary
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
