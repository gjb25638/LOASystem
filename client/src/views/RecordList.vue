<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout>
        <v-flex xs12>
          <v-card class="elevation-12">
            <menu-bar icon="person" :title="`${name} (${username})`" :enabled="{ export: true }">
              <div>{{localeConf.self.tooltip.dept}} {{dept}}</div>
              <div>{{localeConf.self.tooltip.employeeID}} {{employeeID}}</div>
              <div>{{localeConf.self.tooltip.name}} {{name}}</div>
              <div>{{localeConf.self.tooltip.username}} {{username}}</div>
              <div>{{localeConf.self.tooltip.arrivedDate}} {{formatDate(arrivedDate)}}</div>
            </menu-bar>
            <v-card-title>
              <v-switch
                :label="localeConf.self.switch.showAll"
                v-if="fullControl"
                v-model="showAll"
              ></v-switch>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                :label="localeConf.self.input.search"
                single-line
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :pagination.sync="pagination"
              :search="search"
              :headers="headers"
              :items="filteredRecords"
              class="elevation-1"
              :rows-per-page-items="[10, 20, {'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
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
                      <div slot="activator">{{ props.item.dateType }}</div>
                      <leave-type-tooltip :info="props.item.activatedDateType"></leave-type-tooltip>
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
                        >{{signing.name}} [{{signing.pass ? localeConf.self.td.pass : localeConf.self.td.reject }}]</v-chip>
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
                        @click="sign(id, props.item._id, false)"
                        v-if="props.item.signings.every(signing => signing.pass)"
                      >
                        <v-icon color="red">pan_tool</v-icon>
                      </v-btn>
                      <div>{{localeConf.self.tooltip.reject}}</div>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <system-notification v-model="systemNotification" @close="systemNotification.visible = false">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </v-app>
</template>

<script>
import EmployeeService from "@/services/EmployeeService";
import MenuBar from "@/components/Shared/MenuBar";
import SigningTooltip from "@/components/Shared/SigningTooltip";
import LeaveTypeTooltip from "@/components/Shared/LeaveTypeTooltip";
import SystemNotification from "@/components/Shared/SystemNotification";
import utility from "@/utility";
export default {
  name: "RecordList",
  components: {
    "menu-bar": MenuBar,
    "signing-tooltip": SigningTooltip,
    "leave-type-tooltip": LeaveTypeTooltip,
    "system-notification": SystemNotification
  },
  data() {
    return {
      showAll: false,
      systemNotification: {
        level: "warning",
        text: "",
        visible: false
      },
      search: this.$route.params.query,
      headers: [],
      records: [],
      fullControl: false,
      id: "",
      employeeID: "",
      dept: "",
      name: "",
      username: "",
      arrivedDate: "",
      level: "",
      pagination: {
        sortBy: "appliedDate",
        descending: true
      }
    };
  },
  computed: {
    filteredRecords: function() {
      return this.records.filter(
        r => this.showAll || r.signings.every(s => s.pass)
      );
    }
  },
  created() {
    this.headers = [
      {
        text: this.localeConf.self.th.appliedDate,
        value: "appliedDate",
        width: 120,
        sortable: false
      },
      {
        text: this.localeConf.self.th.dates,
        value: "",
        sortable: false
      },
      {
        text: this.localeConf.self.th.totals,
        value: "",
        sortable: false
      },
      {
        text: this.localeConf.self.th.dateType,
        value: "dateType",
        width: 150,
        sortable: false
      },
      {
        text: this.localeConf.self.th.agent,
        value: "agent",
        sortable: false
      },
      {
        text: this.localeConf.self.th.signings,
        value: "signings",
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
          activatedDateTypes,
          records,
          fullControl
        }
      } = await EmployeeService.get({
        id: this.$route.params.id,
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token")
      });
      this.employeeID = employeeID;
      this.dept = dept;
      this.name = name;
      this.username = username;
      this.arrivedDate = arrivedDate;
      this.level = level;
      this.fullControl = fullControl;
      this.id = _id;
      this.records = records.map(record => {
        const leaveType = activatedDateTypes.find(
          dt => dt.name === record.dateType
        );
        return this.combineRecord(record, leaveType);
      });
    },
    combineRecord(record, leaveType) {
      const combinedLeaveType = Object.assign({}, leaveType, {
        deadline: utility.formatDate(leaveType.deadline),
        countdown: utility.isLeaveTypeInfoGeneral(leaveType.name),
        localeName: this.localeConf.shared.dateTypes[leaveType.name]
      });
      return Object.assign({}, record, {
        appliedDate: utility.formatDate(record.appliedDate),
        activatedDateType: combinedLeaveType,
        dateType: utility.getLocaleDateTypeNames(record.dateType)
      });
    },
    async sign(id, recordID, pass) {
      const {
        data: { success, message }
      } = await EmployeeService.updateSign({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token"),
        id: id,
        recordID: recordID,
        pass: pass
      });
      if (success) {
        this.getRecords();
      } else {
        this.systemNotification.text = utility.lookUpCustomMessage(
          message,
          this.localeConf.self.message
        );
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
