<template>
  <v-dialog max-width="600" v-model="dialog" scrollable persistent>
    <v-btn icon slot="activator">
      <v-icon color="warning">local_airport</v-icon>
    </v-btn>
    <v-card class="annualinfo-management">
      <v-card-title class="theme">
        <div class="headline">員工特別休假管理</div>
      </v-card-title>
      <v-card-title class="header">
        <div class="action" @click="toggleSelectAll">
          <div class="select-action-label">全選</div>
          <v-checkbox class="select-action" :value="allSelected"></v-checkbox>
        </div>
        <div class="user-info">
          <div>員工姓名</div>
          <div class="sub-title">英文名</div>
        </div>
        <div class="status-info">
          <div class="sub-title">到期日</div>
          <div>已用天數/總天數</div>
        </div>
      </v-card-title>
      <v-card-text>
        <v-list two-line>
          <template v-for="(employee, index) in employees">
            <v-list-tile :key="employee._id">
              <v-list-tile-action>
                <v-checkbox v-model="employee.selected"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{employee.name}}</v-list-tile-title>
                <v-list-tile-sub-title>{{employee.username}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action class="status">
                <v-list-tile-action-text>{{employee.annualInfo.deadline}}</v-list-tile-action-text>
                {{generateleaveTypeSummary(employee.annualInfo)}}
              </v-list-tile-action>
              <v-list-tile-action v-if="employee.isAnnualLTRefreshable">
                <v-icon>arrow_forward</v-icon>
              </v-list-tile-action>
              <v-list-tile-action class="status" v-if="employee.isAnnualLTRefreshable">
                <v-list-tile-action-text>{{employee.nextAnnualInfo.deadline}}</v-list-tile-action-text>
                {{generateleaveTypeSummary(employee.nextAnnualInfo)}}
              </v-list-tile-action>
            </v-list-tile>
            <v-divider :key="`${index}-divider`"></v-divider>
          </template>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="dialog = false">關閉</v-btn>
        <v-btn
          :disabled="!employees.some(e => e.selected)"
          :class="{'theme': employees.some(e => e.selected)}"
          @click="update"
        >更新</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import EmployeeService from "@/services/EmployeeService";
import reportUtility from "@/reportUtility";
import utility from "@/utility";

export default {
  name: "AnnualInfoManagement",
  props: {},
  data: () => ({
    dialog: false,
    employees: []
  }),
  computed: {
    allSelected() {
      return this.employees.every(e => e.selected);
    }
  },
  mounted() {
    this.getEmployees();
  },
  methods: {
    toggleSelectAll() {
      const toggle = !this.allSelected;
      this.employees.forEach(e => {
        e.selected = toggle;
      });
    },
    async update() {
      const {
        data: { success, message }
      } = await EmployeeService.updateAnnualInfo({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        usernames: this.employees.filter(e => e.selected).map(e => e.username)
      });
      if (success) {
        this.getEmployees();
      }
      this.$emit("update", success, message);
    },
    async getEmployees() {
      const {
        data: { employees }
      } = await EmployeeService.fetchForLightweight({
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      if (employees) {
        this.employees = employees
          .filter(e => e.enabled)
          .map(e => ({
            ...e,
            annualInfo: {
              ...e.annualInfo,
              deadline: this.formatDate(e.annualInfo.deadline)
            },
            nextAnnualInfo: {
              ...e.nextAnnualInfo,
              deadline: this.formatDate(e.nextAnnualInfo.deadline)
            },
            selected: false
          }))
          .map(e => ({
            ...e,
            backup: Object.assign({}, e)
          }));
      }
    },
    formatDate: utility.formatDate,
    generateleaveTypeSummary: annualInfo =>
      reportUtility.generateleaveTypeSummary({
        days: annualInfo.consumes.days,
        hours: annualInfo.consumes.halfHours / 2,
        totalDays: annualInfo.totals.days,
        totalHours: annualInfo.totals.halfHours / 2
      })
  },
  watch: {
    dialog(value) {
      if (value) {
        this.getEmployees();
      }
    }
  }
};
</script>
<style>
.annualinfo-management .header {
  display: grid;
  grid-template-columns: 1fr 5fr 3fr;
  border-bottom: black 1px solid;
  padding: 5px 16px;
}
.annualinfo-management .header .select-action-label {
  margin-left: 16px;
}
.annualinfo-management .header .select-action {
  margin: 0px 0px 0px 16px;
  width: 56px;
  height: 30px;
  display: grid;
}
.annualinfo-management .header .sub-title {
  color: rgba(0, 0, 0, 0.54);
}
.annualinfo-management .header .status-info {
  justify-self: end;
  display: grid;
  justify-items: end;
}
.annualinfo-management .status {
  margin-left: 16px;
}
</style>
