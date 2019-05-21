<template>
  <page-container
    icon="person"
    :title="`${profile.name} (${profile.username})`"
    @notified="(notification) => systemNotification = notification"
  >
    <template v-slot:tooltip>
      <employee-info :profile="profile" icon email></employee-info>
    </template>
    <v-card class="elevation-12">
      <v-card-title>
        <v-switch :label="loalocale.self.showRejects" v-model="showRejects"></v-switch>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          :label="loalocale.self.search"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :pagination.sync="pagination"
        :search="search"
        :headers="headers"
        :items="filteredRecords"
        class="elevation-1"
        :rows-per-page-items="[{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td class="min-width-160">
              <v-tooltip bottom>
                <div slot="activator">{{ props.item.appliedDate }}</div>
              </v-tooltip>
            </td>
            <td
              class="min-width-160"
            >{{ generateSummary(props.item.dates, props.item.startFrom, props.item.endTo) }}</td>
            <td
              class="min-width-160"
            >{{ generateConsumeSummary(props.item.dates, props.item.startFrom, props.item.endTo) }}</td>
            <td class="min-width-120">
              <v-tooltip bottom>
                <div slot="activator">{{ props.item.leaveType }}</div>
                <leave-type-tooltip :info="props.item.activatedLeaveTypes"></leave-type-tooltip>
              </v-tooltip>
            </td>
            <td class="min-width-100">{{ props.item.agent }}</td>
            <td>
              <div v-for="signing in props.item.signings" :key="signing._id">
                <v-tooltip bottom>
                  <v-chip
                    :color="signing.pass ? 'green' : 'red'"
                    text-color="white"
                    slot="activator"
                  >{{signing.name}} [{{signing.pass ? loalocale.self.pass : loalocale.self.reject }}]</v-chip>
                  <signing-tooltip
                    v-for="signer in props.item.signers"
                    :key="signer._id"
                    :signer="signer"
                    :signings="props.item.signings"
                  ></signing-tooltip>
                </v-tooltip>
              </div>
            </td>
            <td>
              <v-tooltip bottom>
                <v-btn
                  slot="activator"
                  icon
                  ripple
                  @click="sign(profile.id, props.item._id, false)"
                  v-if="fullControl && props.item.signings.every(signing => signing.pass)"
                >
                  <v-icon color="red">pan_tool</v-icon>
                </v-btn>
                <div>{{loalocale.self.reject}}</div>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <system-notification v-model="systemNotification" @close="systemNotification.visible = false">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </page-container>
</template>

<script>
import SigningTooltip from "@/components/SigningTooltip";
import LeaveTypeTooltip from "@/components/LeaveTypeTooltip";
import SystemNotification from "@/components/SystemNotification";
import PageContainer from "../components/PageContainer";
import EmployeeInfo from "../components/EmployeeInfo";
import EmployeeService from "@/services/EmployeeService";
import utility from "@/utility";
export default {
  name: "RecordList",
  components: {
    "signing-tooltip": SigningTooltip,
    "leave-type-tooltip": LeaveTypeTooltip,
    "system-notification": SystemNotification,
    "page-container": PageContainer,
    "employee-info": EmployeeInfo
  },
  data: () => ({
    showRejects: false,
    systemNotification: {
      level: "warning",
      text: "",
      visible: false,
      handler: () => {}
    },
    search: "",
    headers: [],
    records: [],
    fullControl: false,
    profile: {
      id: "",
      employeeID: "",
      dept: "",
      name: "",
      username: "",
      arrivedDate: "",
      level: "",
      email: ""
    },
    pagination: {
      sortBy: "appliedDate",
      descending: true
    }
  }),
  computed: {
    filteredRecords() {
      return this.records.filter(
        r => this.showRejects || r.signings.every(s => s.pass)
      );
    }
  },
  created() {
    this.headers = [
      {
        text: this.loalocale.self.appliedDate,
        value: "appliedDate",
        width: 120,
        sortable: false
      },
      {
        text: this.loalocale.self.dates,
        value: "",
        sortable: false
      },
      {
        text: this.loalocale.self.totals,
        value: "",
        sortable: false
      },
      {
        text: this.loalocale.self.leaveType,
        value: "leaveType",
        width: 160,
        sortable: false
      },
      {
        text: this.loalocale.self.agent,
        value: "agent",
        sortable: false
      },
      {
        text: this.loalocale.self.signings,
        value: "signings",
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
    this.search = this.$route.params.query;
    this.getRecords();
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
          activatedLeaveTypes,
          email,
          records,
          fullControl
        }
      } = await EmployeeService.get({
        id: this.$route.params.id,
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      this.profile = {
        employeeID,
        dept,
        name,
        username,
        arrivedDate,
        level,
        email,
        id: _id
      };
      this.fullControl = fullControl;
      this.records = records.map(record => {
        const leaveType = activatedLeaveTypes.find(
          dt => dt.name === record.leaveType
        );
        return this.combineRecord(record, leaveType);
      });
    },
    combineRecord(record, leaveType) {
      const combinedLeaveType = Object.assign({}, leaveType, {
        deadline: utility.formatDate(leaveType.deadline),
        countdown: utility.isLeaveTypeInfoGeneral(leaveType.name),
        localeName: this.loalocale.shared.leaveTypes[leaveType.name]
      });
      return Object.assign({}, record, {
        appliedDate: utility.formatDate(record.appliedDate),
        activatedLeaveTypes: combinedLeaveType,
        leaveType: utility.getLocaleleaveTypeNames(record.leaveType)
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
        pass: pass,
        forced: true
      });
      if (success) {
        this.getRecords();
      } else {
        this.systemNotification.text = utility.lookUpCustomMessage(message);
        this.systemNotification.visible = true;
      }
    },
    generateConsumeSummary: utility.generateConsumeSummary,
    formatDate: utility.formatDate,
    generateSummary: utility.generateSummary
  }
};
</script>
<style lang="scss" scoped>
</style>
