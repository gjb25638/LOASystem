<template>
  <page-container
    :title="loalocale.self.title"
    icon="event_note"
    @notified="(notification) => systemNotification = notification"
  >
    <v-card class="elevation-12">
      <v-card-title>
        <v-switch :label="loalocale.self.showResigners" v-if="fullControl" v-model="showResigners"></v-switch>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          :label="loalocale.self.search"
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        must-sort
        :search="search"
        :headers="headers"
        :items="filteredEmployees"
        item-key="_id"
        :rows-per-page-items="[{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
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
            <td class="min-width-160">{{ generateleaveTypeSummary(props.item.totals) }}</td>
            <td class="min-width-120">
              <employee-action
                :key="props.item._id"
                :employee="props.item"
                :query="compensatoryKeyword"
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
    <system-notification v-model="systemNotification" @close="systemNotification.visible = false">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </page-container>
</template>
<script>
import LeaveTypeBlock from "@/components/LeaveTypeBlock";
import EmployeeAction from "@/components/EmployeeAction";
import PageContainer from "@/components/PageContainer";
import SystemNotification from "@/components/SystemNotification";
import EmployeeService from "@/services/EmployeeService";
import reportUtility from "@/reportUtility";
import defaultConf from "@/default";
import utility from "@/utility";
export default {
  name: "CompensatoryList",
  data: () => ({
    search: "",
    headers: [],
    employees: [],
    fullControl: false,
    showResigners: false,
    compensatoryKeyword: "",
    systemNotification: {
      level: "warning",
      text: "",
      visible: false,
      handler: () => {}
    }
  }),
  components: {
    "employee-action": EmployeeAction,
    "system-notification": SystemNotification,
    "leave-type-block": LeaveTypeBlock,
    "page-container": PageContainer
  },
  computed: {
    filteredEmployees: function() {
      return this.employees.filter(e => this.showResigners || e.enabled);
    }
  },
  created() {
    this.compensatoryKeyword = defaultConf.compensatory.keyword;
    this.headers = [
      {
        text: this.loalocale.self.employeeID,
        value: "employeeID",
        sortable: false
      },
      {
        text: this.loalocale.self.name,
        value: "name",
        sortable: false
      },
      {
        text: this.loalocale.self.username,
        value: "username",
        sortable: false
      },
      {
        text: this.loalocale.self.dept,
        value: "dept",
        sortable: false
      },
      {
        text: this.loalocale.self.arrivedDate,
        value: "arrivedDate",
        sortable: false
      },
      {
        text: this.loalocale.self.compensatory,
        value: "compensatory",
        sortable: false
      },
      {
        text: this.loalocale.self.action,
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
      } = await EmployeeService.compensatory({
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      this.employees = employees;
      this.fullControl = fullControl;
    },
    generateleaveTypeSummary: reportUtility.generateleaveTypeSummary,
    formatDate: utility.formatDate
  }
};
</script>
<style scoped>
.disabled {
  background-color: #eee;
  color: lightgray;
}
</style>
