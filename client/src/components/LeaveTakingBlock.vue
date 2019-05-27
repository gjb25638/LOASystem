<template>
  <v-app id="detail">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex>
          <v-form ref="form" lazy-validation>
            <leave-type-container
              :leaveTypes="availableLTs"
              :readonly="!fullControl"
              @pickOne="pick1LT"
              helper
            ></leave-type-container>
            <v-layout row wrap>
              <v-flex>
                <v-expansion-panel dark>
                  <v-expansion-panel-content>
                    <div slot="header">{{ loalocale.self.unavailableLTs }}</div>
                    <leave-type-container :leaveTypes="unavailableLTs" :readonly="!fullControl"></leave-type-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>
            </v-layout>
            <leave-form
              :dates="date ? [date] : []"
              :leave-type="selectedLT"
              @submit="take1L"
              :allowed-dates="allowedDates"
            ></leave-form>
            <leave-container :leaves="records" :readonly="!fullControl" @remove="remove1L"></leave-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-btn
                  :class="records.length == 0 ? ['float-right'] : ['theme', 'float-right']"
                  @click="updateLOA"
                  v-if="isEditMode"
                  :disabled="records.length == 0"
                >{{loalocale.self.save}}</v-btn>
                <v-btn @click="cancel">{{loalocale.self.cancel}}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import LeaveTypeContainer from "@/components/LeaveTypeContainer";
import LeaveForm from "@/components/LeaveForm";
import LeaveContainer from "@/components/LeaveContainer";
import EmployeeService from "@/services/EmployeeService";
import utility from "@/utility";
import defaultConf from "@/default";
export default {
  name: "LeaveTakingBlock",
  components: {
    "leave-type-container": LeaveTypeContainer,
    "leave-form": LeaveForm,
    "leave-container": LeaveContainer
  },
  props: {
    date: {
      type: String
    },
    fullControl: {
      type: Boolean,
      default: false
    },
    isEditMode: {
      type: Boolean,
      default: true
    },
    leaveTypes: {
      type: Array,
      default: () => []
    },
    employeeId: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    selectedLT: {
      class: "",
      icon: "",
      title: "",
      halfHoursEnabled: false
    },
    formattedLeaveTypes: [],
    records: []
  }),
  computed: {
    availableLTs: function() {
      return this.formattedLeaveTypes.filter(lt => {
        return !this.isEditMode || !this.isLTAvailable(lt);
      });
    },
    unavailableLTs: function() {
      return this.formattedLeaveTypes.filter(lt => {
        return this.isLTAvailable(lt);
      });
    }
  },
  mounted() {
    this.formattedLeaveTypes = this.accumulateLTsCosumes(
      this.formatLTs(this.leaveTypes)
    );
  },
  methods: {
    isLTAvailable: function(leaveType) {
      return (
        leaveType.name.startsWith(defaultConf.compensatory.keyword) &&
        leaveType.consumes.days === leaveType.totals.days &&
        leaveType.consumes.halfHours === leaveType.totals.halfHours &&
        utility.formatDate(leaveType.deadline) <= utility.formatDate("now")
      );
    },
    async updateLOA() {
      const records = this.records.map(record => {
        return {
          appliedDate: new Date(),
          startFrom: record.apply.startFrom,
          endTo: record.apply.endTo,
          leaveType: record.name,
          dates: record.apply.dates.map(date => new Date(date)),
          remarks: record.apply.remarks,
          signings: [],
          totals: {
            days: record.apply.totalHours === 0 ? record.apply.dates.length : 0,
            halfHours: record.apply.totalHours * 2
          }
        };
      });
      const {
        data: { success, message }
      } = await EmployeeService.updateLOA({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        id: this.employeeId,
        records: records,
        activatedLeaveTypes: this.formattedLeaveTypes.map(lt => {
          return {
            ...lt,
            consumes: {
              days: lt.consumes.days,
              halfHours: lt.consumes.hours * 2
            }
          };
        })
      });

      this.reset();
      this.$emit("taken", success, message);
    },
    accumulateLTsCosumes(leaveTypes) {
      const familyCare = leaveTypes.find(lt => lt.name === "familyCare");
      if (familyCare) {
        const personal = leaveTypes.find(lt => lt.name === "personal");
        personal.consumes.days += familyCare.consumes.days;
      }
      return leaveTypes;
    },
    formatLTs(leaveTypes) {
      const newLeaveTypes = JSON.parse(JSON.stringify(defaultConf.leaveTypes));
      leaveTypes.forEach(lt => {
        let leaveTypeInDefault = newLeaveTypes.find(
          ltInDefault => ltInDefault.name === lt.name
        );
        if (leaveTypeInDefault) {
          leaveTypeInDefault.enabled = lt.enabled;
          leaveTypeInDefault.consumes = {
            days: lt.consumes.days,
            hours: lt.consumes.halfHours ? lt.consumes.halfHours / 2 : 0
          };
          leaveTypeInDefault.totals = {
            days: lt.totals.days,
            hours: lt.totals.halfHours ? lt.totals.halfHours / 2 : 0
          };
          leaveTypeInDefault.deadline = utility.formatDate(lt.deadline);
        } else {
          const customLeaveType = defaultConf.customLeaveType;
          newLeaveTypes.push({
            ...customLeaveType,
            index: newLeaveTypes.length,
            enabled: true,
            title: lt.name,
            name: lt.name,
            consumes: {
              days: lt.consumes.days,
              hours: lt.consumes.halfHours ? lt.consumes.halfHours / 2 : 0
            },
            totals: {
              days: lt.totals.days,
              hours: lt.totals.halfHours ? lt.totals.halfHours / 2 : 0
            },
            deadline: utility.formatDate(lt.deadline)
          });
        }
      });
      return newLeaveTypes.filter(lt => this.fullControl || lt.enabled);
    },
    pick1LT(leaveType) {
      this.$emit("picked", leaveType);
      this.selectedLT = leaveType;
    },
    remove1L(target) {
      const record = this.records.find(r => r.index === target.index);
      const leaveType = this.formattedLeaveTypes.find(
        lt => lt.name === record.name
      );
      if (record.apply.totalHours === 0) {
        leaveType.consumes.days -= record.apply.dates.length;
      } else {
        let consumeHours =
          leaveType.consumes.days * 8 + leaveType.consumes.hours;
        consumeHours -= record.apply.totalHours;
        leaveType.consumes.days = Math.floor(consumeHours / 8);
        leaveType.consumes.hours = consumeHours % 8;
      }
      this.records = this.records.filter(r => r.index !== target.index);
    },
    take1L(apply) {
      if (apply.dates.length === 1) {
        // 1 date chosen.
        if (this.selectedLT.totals.days > 0) {
          // totals days > 0.
          if (
            this.selectedLT.totals.days - this.selectedLT.consumes.days === 1 &&
            apply.totalHours >= 8
          ) {
            // totals days - consumes days = 1 day left, but the applied time > 9 hours(=1 work day).
            this.systemNotification.text = this.loalocale.self.runOutQotaOfLeave;
            this.systemNotification.visible = true;
            return;
          }
        } else {
          // totals days = 0.
          if (
            this.selectedLT.consumes.hours + apply.totalHours >
            this.selectedLT.totals.hours
          ) {
            // consume hours + applied time > totals hours.
            this.systemNotification.text = this.loalocale.self.runOutQotaOfLeave;
            this.systemNotification.visible = true;
            return;
          }
        }
      }
      if (
        this.selectedLT.consumes.days + apply.dates.length >
        this.selectedLT.totals.days
      ) {
        // consume days + chosen dates > totals days.
        this.systemNotification.text = this.loalocale.self.runOutQotaOfLeave;
        this.systemNotification.visible = true;
        return;
      }
      const personalLeaveType = this.formattedLeaveTypes.find(
        lt => lt.name === "personal"
      );
      const familyCareLeaveType = this.formattedLeaveTypes.find(
        lt => lt.name === "familyCare"
      );
      if (
        personalLeaveType &&
        familyCareLeaveType &&
        ["personal", "familyCare"].includes(this.selectedLT.name)
      ) {
        // familyCare leave is a kind of personal leave
        // , so when taking a personal/familyCare leave
        // , all of both consumes must < totals of personal leave.
        if (
          personalLeaveType.consumes.days * 8 +
            personalLeaveType.consumes.hours +
            familyCareLeaveType.consumes.days * 8 +
            familyCareLeaveType.consumes.hours +
            (apply.dates.length === 1 && apply.totalHours > 0
              ? apply.totalHours
              : apply.dates.length * 8) >
          personalLeaveType.totals.days * 8
        ) {
          this.systemNotification.text = this.loalocale.self.runOutQotaOfLeave;
          this.systemNotification.visible = true;
          return;
        }
      }
      if (this.selectedLT.halfHoursEnabled) {
        // can leave in hours/half-hours.
        this.selectedLT.consumes.days +=
          apply.dates.length === 1 && apply.totalHours === 0
            ? apply.dates.length
            : 0;
        // sum up consumes days with the length of chosen dates
        // , but only if it's not a hours/half-hours leave.
        this.selectedLT.consumes.hours += apply.totalHours;
        // sum up consumes hours with the appled time.
        if (this.selectedLT.consumes.hours >= 8) {
          // recalculate the consumes if the hours overflow.
          this.selectedLT.consumes.days++;
          this.selectedLT.consumes.hours -= 8;
        }
        const hoursLeft =
          this.selectedLT.totals.days * 8 +
          this.selectedLT.totals.hours -
          this.selectedLT.consumes.days * 8 -
          this.selectedLT.consumes.hours;
        apply.remainings.days = Math.floor(hoursLeft / 8);
        apply.remainings.hours = hoursLeft % 8;
      } else {
        // cannot leave in hours/half-hours.
        this.selectedLT.consumes.days += apply.dates.length;
        // sum up consumes days with the length of chosen dates.

        apply.remainings.days =
          this.selectedLT.totals.days - this.selectedLT.consumes.days;
      }
      this.records.push({
        apply: { ...apply },
        index: this.records.length,
        ...this.selectedLT
      });
    },
    allowedDates(dateStr) {
      const date = new Date(dateStr);
      const annualPreRequest = this.formattedLeaveTypes.find(
        lt => lt.name === "annualPreRequest"
      );
      const annual = this.formattedLeaveTypes.find(lt => lt.name === "annual");
      if (
        annual &&
        annualPreRequest &&
        this.selectedLT.name === annualPreRequest.name
      ) {
        return new Date(annual.deadline) < date;
      } else {
        return true;
      }
    },
    cancel() {
      this.reset();
      this.$emit("cancel");
    },
    reset() {
      this.selectedLT = {
        class: "",
        icon: "",
        title: "",
        halfHoursEnabled: false
      };
      this.records = [];
    }
  },
  watch: {
    leaveTypes() {
      this.formattedLeaveTypes = this.accumulateLTsCosumes(
        this.formatLTs(this.leaveTypes)
      );
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
