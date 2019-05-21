<template>
  <page-container
    :title="loalocale.self.title"
    icon="event_note"
    @notified="(notification) => systemNotification = notification"
  >
    <v-card class="elevation-12">
      <calendar-controller
        :calendarDate="new Date(calendarDate)"
        @prev="$refs.calendar.prev()"
        @next="$refs.calendar.next()"
        @tolastest="(date) => calendarDate = formatDate(date)"
      >
        <v-switch v-if="!notASigner" :label="loalocale.self.showOnlyYours" v-model="showOnlyYours"></v-switch>
        <v-switch
          v-if="!notASigner"
          :label="loalocale.self.showOnlyUsername"
          v-model="showOnlyUsername"
        ></v-switch>
      </calendar-controller>
      <v-card-text>
        <v-sheet>
          <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
          <v-calendar
            v-else
            ref="calendar"
            v-model="calendarDate"
            type="month"
            color="primary"
            @click:date="selectDate"
          >
            <template v-slot:day="{ date }">
              <template v-for="(event, index) in leaveGroups[date]">
                <v-menu
                  :key="index"
                  v-model="event.open"
                  full-width
                  offset-x
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <leave-info
                      :on="on"
                      :key="index"
                      :employee="event.employee"
                      :record="event.record"
                      :color="event.color"
                      :textColor="event.textColor"
                      :icon="!showOnlyUsername"
                    ></leave-info>
                  </template>
                  <leave-detail-info
                    :employee="event.employee"
                    :record="event.record"
                    @signed="leaveSigned"
                    @close="event.open = false"
                  ></leave-detail-info>
                </v-menu>
              </template>
            </template>
          </v-calendar>
        </v-sheet>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" max-width="500">
      <leave-taking-block
        :leaveTypes="leaveTypes"
        :employee-id="loginuser._id"
        @taken="leaveTaken"
        @picked="leavePicked"
        @cancel="dialog = false"
        :date="selectedDate"
      ></leave-taking-block>
    </v-dialog>
    <system-notification v-model="systemNotification" @close="systemNotification.visible = false">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </page-container>
</template>
<script>
import PageContainer from "@/components/PageContainer";
import EmployeeInfo from "@/components/EmployeeInfo";
import LeaveTakingBlock from "@/components/LeaveTakingBlock";
import SystemNotification from "@/components/SystemNotification";
import CalendarController from "@/components/CalendarController";
import LeaveInfo from "@/components/LeaveInfo";
import LeaveDetailInfo from "@/components/LeaveDetailInfo";
import EmployeeService from "@/services/EmployeeService";
import utility from "@/utility";
import colors from "@/colors";
export default {
  name: "Calendar",
  components: {
    "page-container": PageContainer,
    "employee-info": EmployeeInfo,
    "leave-taking-block": LeaveTakingBlock,
    "system-notification": SystemNotification,
    "calendar-controller": CalendarController,
    "leave-info": LeaveInfo,
    "leave-detail-info": LeaveDetailInfo
  },
  data: () => ({
    calendarDate: utility.formatDate("now"),
    leaves: [],
    year: "",
    month: "",
    dialog: false,
    showOnlyYours: true,
    showOnlyUsername: false,
    notASigner: false,
    report: [],
    leaveTypes: [],
    systemNotification: {
      level: "warning",
      text: "",
      visible: false,
      handler: () => {}
    },
    selectedDate: "",
    loading: false
  }),
  computed: {
    leaveGroups() {
      const map = {};
      this.leaves.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    }
  },
  async mounted() {
    this.getRecords();
    this.getLeaveTypes();
  },
  methods: {
    async getLeaveTypes() {
      const {
        data: { activatedLeaveTypes }
      } = await EmployeeService.get({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        id: this.loginuser._id
      });
      this.leaveTypes = activatedLeaveTypes;
    },
    async getRecords(force = false) {
      const year = this.calendarDate.substr(0, 4);
      const month = this.calendarDate.substr(5, 2);
      if (!force && (year === this.year && month === this.month)) {
        return;
      } else {
        this.year = year;
        this.month = month;
      }
      this.loading = true;
      const {
        data: { report, fullControl }
      } = await EmployeeService.getMonthly({
        year: this.year,
        month: this.month,
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      this.loading = false;
      this.report = report;
      this.leaves = this.toLeaves(this.report);
      this.fullControl = fullControl;
    },
    toLeaves(report) {
      let randomColors = [];
      if (this.showOnlyUsername) {
        randomColors = colors.random(report.length);
      }
      const leaves = [];
      this.notASigner = report.length === 1;
      report
        .filter(
          employee =>
            !this.showOnlyYours || employee.username === this.loginuser.username
        )
        .forEach((employee, index) => {
          employee.records.forEach(record => {
            record.dates.forEach(date => {
              leaves.push({
                color: randomColors.length > 0 ? randomColors[index].color : "",
                textColor:
                  randomColors.length > 0 ? randomColors[index].textColor : "",
                date: utility.formatDate(date),
                employee: employee,
                record: record,
                open: false
              });
            });
          });
        });
      return leaves;
    },
    selectDate(dateObj) {
      this.dialog = true;
      this.selectedDate = dateObj.date;
    },
    leavePicked(leaveType) {
      if (leaveType.name === "annualPreRequest") {
        this.selectedDate = "";
      }
    },
    leaveSigned(success, message) {
      if (success) {
        this.getRecords(true);
      } else {
        this.systemNotification.text = utility.lookUpCustomMessage(message);
        this.systemNotification.visible = true;
      }
    },
    leaveTaken(success, message) {
      if (success) {
        this.dialog = false;
        this.getRecords(true);
      } else {
        this.systemNotification.text = utility.lookUpCustomMessage(message);
        this.systemNotification.visible = true;
      }
    },
    formatDate: utility.formatDate
  },
  watch: {
    calendarDate() {
      this.getRecords();
    },
    showOnlyYours() {
      this.leaves = this.toLeaves(this.report);
    },
    showOnlyUsername() {
      this.leaves = this.toLeaves(this.report);
    }
  }
};
</script>
<style>
</style>
