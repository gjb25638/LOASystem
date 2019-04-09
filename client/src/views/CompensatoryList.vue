<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <menu-bar :enabled="{ export: true }"></menu-bar>
            <v-card-title>
              <v-switch
                :label="localeConf.self.switch.showAllPeople"
                v-if="fullControl"
                v-model="showAllPeople"
              ></v-switch>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                :label="localeConf.self.input.search"
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
                <tr
                  @click="props.expanded = !props.expanded"
                  :class="props.item.enabled ? '' : 'disabled'"
                >
                  <td>{{ props.item.employeeID }}</td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.username }}</td>
                  <td class="min-width-120">{{ props.item.dept }}</td>
                  <td class="min-width-120">{{ formatDate(props.item.arrivedDate) }}</td>
                  <td class="min-width-160">{{ generateDateTypeSummary(props.item.totals) }}</td>
                  <td class="min-width-120">
                    <employee-action
                      :key="props.item._id"
                      :employee="props.item"
                      :recordListQuery="compensatoryKeyword"
                    ></employee-action>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat>
                  <v-list v-if="props.item.enabled">
                    <leave-type-block
                      v-for="record in props.item.records"
                      :key="record._id"
                      :employee="props.item"
                      :record="record"
                    ></leave-type-block>
                  </v-list>
                </v-card>
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
import LeaveTypeBlock from "@/components/CompensatoryList/LeaveTypeBlock";
import EmployeeAction from "@/components/Shared/EmployeeAction";
import reportUtility from "@/reportUtility";
import defaultConf from "@/default";
import utility from "@/utility";
export default {
  name: "CompensatoryList",
  data() {
    return {
      search: "",
      headers: [],
      employees: [],
      fullControl: false,
      showAllPeople: false,
      compensatoryKeyword: ""
    };
  },
  components: {
    "menu-bar": MenuBar,
    "employee-action": EmployeeAction,
    "leave-type-block": LeaveTypeBlock
  },
  computed: {
    filteredEmployees: function() {
      return this.employees.filter(e => this.showAllPeople || e.enabled);
    }
  },
  created() {
    this.compensatoryKeyword = defaultConf.compensatory.keyword;
    this.headers = [
      {
        text: this.localeConf.self.th.employeeID,
        value: "employeeID",
        sortable: false
      },
      {
        text: this.localeConf.self.th.name,
        value: "name",
        sortable: false
      },
      {
        text: this.localeConf.self.th.username,
        value: "username",
        sortable: false
      },
      {
        text: this.localeConf.self.th.dept,
        value: "dept",
        sortable: false
      },
      {
        text: this.localeConf.self.th.arrivedDate,
        value: "arrivedDate",
        sortable: false
      },
      {
        text: this.localeConf.self.th.compensatory,
        value: "compensatory",
        sortable: false
      },
      {
        text: this.localeConf.self.th.action,
        value: "",
        sortable: false
      }
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
      const compensatoryLeaveTypes = utility.getCompensatoryLeaveTypes(
        activatedDateTypes
      );
      const compensatoryRecords = utility.getCompensatoryRecords(records);
      if (compensatoryLeaveTypes.length > 0) {
        return {
          _id,
          employeeID,
          dept,
          name,
          username,
          enabled: employee.enabled,
          arrivedDate,
          totals: this.sumUpTotalsNTotalUsed(
            compensatoryRecords,
            compensatoryLeaveTypes
          ),
          records: utility.getUnusedOutLeaveTypes(
            compensatoryLeaveTypes,
            compensatoryRecords
          )
        };
      } else {
        return undefined;
      }
    },
    sumUpTotalsNTotalUsed: function(records, leaveTypes) {
      const totals = utility.sumUpTotals(records.map(r => r.totals));
      totals["totalDays"] = leaveTypes.reduce(
        (totalDays, currentLeaveType) =>
          totalDays + currentLeaveType.totals.days,
        0
      );
      totals["totalHours"] = leaveTypes.reduce(
        (totalHours, currentLeaveType) =>
          totalHours + currentLeaveType.totals.halfHours / 2,
        0
      );
      return totals;
    },
    generateDateTypeSummary: reportUtility.generateDateTypeSummary,
    formatDate: utility.formatDate
  }
};
</script>

<style>
.disabled {
  background-color: #eee;
  color: lightgray;
}
</style>
