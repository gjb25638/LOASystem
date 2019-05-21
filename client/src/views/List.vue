<template>
  <page-container
    :title="loalocale.self.title"
    icon="view_list"
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
        <v-btn icon dark class="theme" @click="createEmployee" v-if="fullControl">
          <v-icon>add</v-icon>
        </v-btn>
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
            <td class="min-width-120">
              {{ props.item.name }}
              <v-badge left v-if="props.item.unSigningRecords.length > 0">
                <v-icon color="blue">textsms</v-icon>
              </v-badge>
            </td>
            <td>{{ props.item.username }}</td>
            <td class="min-width-120">{{ props.item.dept }}</td>
            <td class="min-width-160">{{ formatDate(props.item.arrivedDate) }}</td>
            <td class="min-width-380">
              <employee-action
                :key="props.item._id"
                :employee="props.item"
                :full-control="fullControl"
                @delete="deleteEmployee"
                @toggle="toggleEnable"
              ></employee-action>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-list v-if="props.item.enabled">
              <signing-block
                v-for="record in props.item.unSigningRecords"
                :key="record._id"
                :employee="props.item"
                :record="record"
                @sign="sign"
              ></signing-block>
            </v-list>
          </v-card>
        </template>
      </v-data-table>
      <v-card-text style="height: 100px; position: relative"></v-card-text>
    </v-card>
    <leave-type-refreshed-notification
      v-model="news"
      @close="news = false"
      :leave-types="$route.params.logs"
      :full-control="fullControl"
    ></leave-type-refreshed-notification>
    <system-notification v-model="systemNotification" @close="systemNotification.visible = false">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </page-container>
</template>

<script>
import EmployeeAction from "@/components/EmployeeAction";
import SigningBlock from "@/components/SigningBlock";
import SystemNotification from "@/components/SystemNotification";
import LeaveTypeRefreshedNotification from "@/components/LeaveTypeRefreshedNotification";
import PageContainer from "@/components/PageContainer";
import EmployeeService from "@/services/EmployeeService";
import utility from "@/utility";
export default {
  name: "List",
  components: {
    "employee-action": EmployeeAction,
    "signing-block": SigningBlock,
    "system-notification": SystemNotification,
    "leave-type-refreshed-notification": LeaveTypeRefreshedNotification,
    "page-container": PageContainer
  },
  data: () => ({
    news: false,
    systemNotification: {
      level: "warning",
      text: "",
      visible: false,
      handler: () => {}
    },
    search: "",
    headers: [],
    employees: [],
    fullControl: false,
    showResigners: false
  }),
  computed: {
    filteredEmployees() {
      return this.employees.filter(e => this.showResigners || e.enabled);
    }
  },
  created() {
    this.headers = [
      { text: this.loalocale.self.employeeID, value: "employeeID" },
      { text: this.loalocale.self.name, value: "name" },
      { text: this.loalocale.self.username, value: "username" },
      { text: this.loalocale.self.dept, value: "dept" },
      { text: this.loalocale.self.arrivedDate, value: "arrivedDate" },
      { text: this.loalocale.self.action, value: "" }
    ];
  },
  mounted() {
    this.getEmployees();
    this.news = this.$route.params.logs && this.$route.params.logs.length > 0;
  },
  methods: {
    async getEmployees() {
      const {
        data: { message, employees, fullControl }
      } = await EmployeeService.fetch({
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      if (employees) {
        this.employees = employees.map(e =>
          Object.assign({}, e, {
            unSigningRecords: e.unSigningRecords.map(r =>
              Object.assign(
                {},
                r,
                utility.lookUpLeaveTypeIconNClass(r.leaveType)
              )
            )
          })
        );
      } else {
        this.systemNotification.text = utility.lookUpCustomMessage(message);
        this.systemNotification.visible = true;
      }
      this.fullControl = fullControl;
    },
    async toggleEnable(id) {
      await EmployeeService.toggle({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        id: id
      });
      this.getEmployees();
    },
    async deleteEmployee(id) {
      await EmployeeService.delete({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        id: id
      });
      this.getEmployees();
    },
    createEmployee() {
      this.$router.push({
        name: "Detail",
        params: { id: "new" }
      });
    },
    async sign(id, recordID, pass) {
      const {
        data: { success, message }
      } = await EmployeeService.updateSign({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        id: id,
        recordID: recordID,
        pass: pass
      });
      if (success) {
        this.getEmployees();
      } else {
        this.systemNotification.text = utility.lookUpCustomMessage(message);
        this.systemNotification.visible = true;
      }
    },
    formatDate: utility.formatDate
  }
};
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
.disabled {
  background-color: #eee;
  color: lightgray;
}
</style>
