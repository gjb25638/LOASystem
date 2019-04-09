<template>
  <v-app id="detail">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md8>
          <v-form ref="form" v-model="valid" lazy-validation>
            <employee-profile
              :signer-options="signerOptions"
              :dept-options="deptOptions"
              :level-options="levelOptions"
              :readonly="!fullControl"
              :addingNew="!isEditMode"
              :profile.sync="profile"
            ></employee-profile>
            <employee-account-settings
              :account="account"
              :addingNew="!isEditMode"
              @resetPWD="resetPWD"
              @resetEmail="resetEmail"
            ></employee-account-settings>
            <v-divider></v-divider>
            <leave-type-container
              :leaveTypes="availableLeaveTypes"
              :readonly="!fullControl"
              @pickOne="pickOneLeaveType"
              @importOne="importOneLeaveType"
              @removeOne="removeOneLeaveType"
            ></leave-type-container>
            <v-layout row wrap>
              <v-flex>
                <v-expansion-panel dark>
                  <v-expansion-panel-content>
                    <div slot="header">
                      {{ localeConf.self.message.unavailableLeaveTypes }}
                      ({{ localeConf.self.message.unavailableLeaveTypesDetails }})
                    </div>
                    <leave-type-container
                      :leaveTypes="unavailableLeaveTypes"
                      :readonly="!fullControl"
                      listonly
                    ></leave-type-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>
            </v-layout>
            <leave-form
              :leavetype="selectedLeaveType"
              @submit="takeALeave"
              :allowed-dates="allowedDates"
            ></leave-form>
            <leave-container :leaves="records" :readonly="!fullControl" @remove="removeOneLeave"></leave-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-btn
                  :class="['theme', 'float-right']"
                  @click="submit"
                  v-if="fullControl"
                >{{isEditMode ? localeConf.self.btn.update: localeConf.self.btn.create}}</v-btn>
                <v-btn
                  :class="records.length == 0 ? ['float-right'] : ['theme', 'float-right']"
                  @click="save"
                  v-if="isEditMode"
                  :disabled="records.length == 0"
                >{{localeConf.self.btn.save}}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
    <system-notification v-model="systemNotification" @close="closeNotification">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </v-app>
</template>

<script>
import EmployeeService from "@/services/EmployeeService";
import SystemNotification from "@/components/Shared/SystemNotification";
import defaultConf from "@/default";
import utility from "@/utility";
import EmployeeProfile from "@/components/Detail/EmployeeProfile";
import EmployeeAccountSettings from "@/components/Detail/EmployeeAccountSettings";
import LeaveTypeContainer from "@/components/Detail/LeaveTypeContainer";
import LeaveTypeSelectedBlock from "@/components/Detail/LeaveTypeSelectedBlock";
import LeaveForm from "@/components/Detail/LeaveForm";
import LeaveContainer from "@/components/Detail/LeaveContainer";
export default {
  name: "Detail",
  components: {
    "system-notification": SystemNotification,
    "employee-profile": EmployeeProfile,
    "employee-account-settings": EmployeeAccountSettings,
    "leave-type-container": LeaveTypeContainer,
    "leave-type-selected-block": LeaveTypeSelectedBlock,
    "leave-form": LeaveForm,
    "leave-container": LeaveContainer
  },
  data: () => ({
    systemNotification: {
      level: "warning",
      text: "",
      visible: false,
      keyword: ""
    },
    valid: true,
    profile: {
      employeeID: "",
      dept: "",
      name: "",
      username: "",
      arrivedDate: "",
      level: "",
      signers: [],
      email: ""
    },
    account: {
      password: "",
      email: ""
    },
    leaveTypes: [],
    isEditMode: false,
    fullControl: false,
    selectedLeaveType: {
      class: "",
      icon: "",
      title: "",
      halfHoursEnabled: false
    },
    records: [],
    employees: [],
    signerOptions: [
      {
        _id: "",
        dept: "",
        name: "",
        username: "",
        level: ""
      }
    ],
    deptOptions: defaultConf.deptOptions,
    levelOptions: defaultConf.levelOptions
  }),
  computed: {
    availableLeaveTypes: function() {
      return this.leaveTypes.filter(lt => {
        return !this.isAvailableLeaveType(lt);
      });
    },
    unavailableLeaveTypes: function() {
      return this.leaveTypes.filter(lt => {
        return this.isAvailableLeaveType(lt);
      });
    }
  },
  mounted() {
    this.isEditMode = this.$route.params.id && this.$route.params.id !== "new";
    if (this.isEditMode) {
      this.getEmployee();
    }
    this.getEmployees();
  },
  methods: {
    isAvailableLeaveType: function(leaveType) {
      return (
        leaveType.name.startsWith(defaultConf.compensatory.keyword) &&
        leaveType.consumes.days === leaveType.totals.days &&
        leaveType.consumes.halfHours === leaveType.totals.halfHours &&
        utility.formatDate(leaveType.deadline) <= utility.formatDate("now")
      );
    },
    async getEmployees() {
      const {
        data: { employees }
      } = await EmployeeService.fetchForLightweight({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token")
      });
      this.signerOptions = employees;
    },
    async getEmployee() {
      const {
        data: {
          employeeID,
          dept,
          name,
          username,
          arrivedDate,
          level,
          signers,
          activatedDateTypes,
          fullControl,
          email
        }
      } = await EmployeeService.get({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token"),
        id: this.$route.params.id
      });
      this.profile = {
        employeeID,
        dept,
        name,
        username,
        arrivedDate: utility.formatDate(arrivedDate),
        level,
        signers: signers,
        email: email
      };
      this.fullControl = fullControl;
      this.leaveTypes =
        activatedDateTypes.length > 0
          ? this.transformLeaveTypes(activatedDateTypes)
          : JSON.parse(JSON.stringify(defaultConf.leaveTypes));
    },
    async save() {
      const records = this.records.map(r => {
        return {
          appliedDate: r.apply.created,
          startFrom: r.apply.startFrom,
          endTo: r.apply.endTo,
          dateType: r.name,
          dates: r.apply.dates.map(d => new Date(d)),
          agent: r.apply.agent,
          signings: [],
          totals: {
            days: r.apply.totalHours === 0 ? r.apply.dates.length : 0,
            halfHours: r.apply.totalHours * 2
          }
        };
      });
      const {
        data: { success, message }
      } = await EmployeeService.updateLOA({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token"),
        id: this.$route.params.id,
        records: records,
        activatedDateTypes: this.leaveTypes.map(lt => {
          return {
            consumes: {
              days: lt.consumes.days,
              halfHours: lt.consumes.hours * 2
            },
            ...lt
          };
        })
      });

      if (success) {
        this.$router.push({ name: "List" });
      } else {
        this.systemNotification.text = utility.lookUpCustomMessage(
          message,
          this.localeConf.self.message
        );
        this.systemNotification.visible = true;
      }
    },
    async submit() {
      if (this.$refs.form.validate()) {
        const params = {
          employeeID: this.employeeID,
          dept: this.dept,
          name: this.name,
          username: this.username,
          arrivedDate: this.arrivedDate,
          level: this.level,
          email: this.email,
          activatedDateTypes: this.leaveTypes.map(lt => {
            return {
              ...lt,
              consumes: {
                days: lt.consumes.days,
                halfHours: lt.consumes.hours * 2
              },
              totals: {
                days: lt.totals.days,
                halfHours: lt.totals.hours * 2
              }
            };
          }),
          loginuser: this.$cookie.get("loginuser"),
          token: this.$cookie.get("token"),
          id: this.$route.params.id,
          signers: this.profile.signers
        };
        let {
          data: { success, message }
        } = this.isEditMode
          ? await EmployeeService.update(params)
          : await EmployeeService.add(params);

        if (success) {
          this.$router.push({ name: "List" });
        } else {
          this.systemNotification.text = utility.lookUpCustomMessage(
            message,
            this.localeConf.self.message
          );
          this.systemNotification.visible = true;
        }
      } else {
        this.systemNotification.visible = {
          text: "",
          level: "warning",
          visible: true
        };
      }
    },
    transformLeaveTypes(leaveTypes) {
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
    removeOneLeaveType(index) {
      this.leaveTypes = this.leaveTypes.filter(lt => lt.index !== index);
    },
    importOneLeaveType(customTypeName) {
      if (customTypeName) {
        const sameNameLeaveTypes = this.leaveTypes.filter(lt =>
          lt.name.startsWith(customTypeName)
        );

        if (sameNameLeaveTypes.length > 0) {
          customTypeName += "_" + sameNameLeaveTypes.length;
        }

        this.leaveTypes.push({
          ...JSON.parse(JSON.stringify(defaultConf.customLeaveType)),
          index: this.leaveTypes.length,
          title: customTypeName,
          name: customTypeName
        });
      }
    },
    takeALeave(apply) {
      debugger
      if (apply.dates.length === 1) {
        // 1 date chosen.
        if (this.selectedLeaveType.totals.days > 0) {
          // totals days > 0.
          if (
            this.selectedLeaveType.totals.days -
              this.selectedLeaveType.consumes.days ===
              1 &&
            apply.totalHours >= 8
          ) {
            // totals days - consumes days = 1 day left, but the applied time > 9 hours(=1 work day).
            this.systemNotification.text = this.localeConf.self.message.runOutQotaOfLeave;
            this.systemNotification.visible = true;
            return;
          }
        } else {
          // totals days = 0.
          if (
            this.selectedLeaveType.consumes.hours + apply.totalHours >
            this.selectedLeaveType.totals.hours
          ) {
            // consume hours + applied time > totals hours.
            this.systemNotification.text = this.localeConf.self.message.runOutQotaOfLeave;
            this.systemNotification.visible = true;
            return;
          }
        }
      }

      if (
        this.selectedLeaveType.consumes.days + apply.dates.length >
        this.selectedLeaveType.totals.days
      ) {
        // consume days + chosen dates > totals days.
        this.systemNotification.text = this.localeConf.self.message.runOutQotaOfLeave;
        this.systemNotification.visible = true;
        return;
      }

      if (["personal", "familyCare"].includes(this.selectedLeaveType.name)) {
        debugger;
        // familyCare leave is a kind of personal leave
        // , so when taking a personal/familyCare leave
        // , all of both consumes must < totals of personal leave.
        const personalLeaveType = this.leaveTypes.find(
          lt => lt.name === "personal"
        );
        const familyCareLeaveType = this.leaveTypes.find(
          lt => lt.name === "familyCare"
        );

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
          this.systemNotification.text = this.localeConf.self.message.runOutQotaOfLeave;
          this.systemNotification.visible = true;
          return;
        }
      }

      if (this.selectedLeaveType.halfHoursEnabled) {
        // can leave in hours/half-hours.
        this.selectedLeaveType.consumes.days +=
          apply.dates.length === 1 && apply.totalHours === 0
            ? apply.dates.length
            : 0;
        // sum up consumes days with the length of chosen dates
        // , but only if it's not a hours/half-hours leave.

        this.selectedLeaveType.consumes.hours += apply.totalHours;
        // sum up consumes hours with the appled time.

        if (this.selectedLeaveType.consumes.hours >= 8) {
          // recalculate the consumes if the hours overflow.
          this.selectedLeaveType.consumes.days++;
          this.selectedLeaveType.consumes.hours -= 8;
        }

        const hoursLeft =
          this.selectedLeaveType.totals.days * 8 +
          this.selectedLeaveType.totals.hours -
          this.selectedLeaveType.consumes.days * 8 -
          this.selectedLeaveType.consumes.hours;
        apply.remainings.days = Math.floor(hoursLeft / 8);
        apply.remainings.hours = hoursLeft % 8;
      } else {
        // cannot leave in hours/half-hours.
        this.selectedLeaveType.consumes.days += apply.dates.length;
        // sum up consumes days with the length of chosen dates.

        apply.remainings.days =
          this.selectedLeaveType.totals.days -
          this.selectedLeaveType.consumes.days;
      }

      this.records.push({
        apply: { ...apply },
        index: this.records.length,
        ...this.selectedLeaveType
      });
    },
    pickOneLeaveType(leaveType) {
      this.$vuetify.goTo("#apply", {
        duration: 500,
        offset: 0,
        easing: "easeInOutCubic"
      });
      this.selectedLeaveType = leaveType;
    },
    allowedDates(d) {
      const date = new Date(d);
      const annualPreRequest = this.leaveTypes.find(
        lt => lt.name === "annualPreRequest"
      );
      const annual = this.leaveTypes.find(lt => lt.name === "annual");
      if (
        annual &&
        annualPreRequest &&
        this.selectedLeaveType.name === annualPreRequest.name
      ) {
        return new Date(annual.deadline) < date;
      } else {
        return true;
      }
    },
    closeNotification() {
      this.systemNotification.visible = false;
      if (this.systemNotification.handler) {
        this.systemNotification.handler(this.$router, this.$cookie);
      }
    },
    removeOneLeave(target) {
      debugger;
      const record = this.records.find(r => r.index === target.index);
      const dateType = this.leaveTypes.find(lt => lt.name === record.name);
      if (record.apply.totalHours === 0) {
        dateType.consumes.days -= record.apply.dates.length;
      } else {
        let consumeHours = dateType.consumes.days * 8 + dateType.consumes.hours;
        consumeHours -= record.apply.totalHours;
        dateType.consumes.days = Math.floor(consumeHours / 8);
        dateType.consumes.hours = consumeHours % 8;
      }
      this.records = this.records.filter(r => r.index !== target.index);
    },
    async resetEmail() {
      const {
        data: { success, message }
      } = await EmployeeService.updateEmail({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token"),
        id: this.$route.params.id,
        email: this.account.email
      });

      this.systemNotification = {
        text: utility.lookUpCustomMessage(
          message,
          this.localeConf.self.message
        ),
        level: success ? "info" : "warning",
        visible: true,
        handler: function($router, $cookie) {
          if (success) {
            $router.push({ name: "List" });
          }
        }
      };
    },
    async resetPWD() {
      let {
        data: { success, message }
      } = await EmployeeService.updatePWD({
        loginuser: this.$cookie.get("loginuser"),
        token: this.$cookie.get("token"),
        id: this.$route.params.id,
        password: this.account.password
      });

      this.systemNotification = {
        text: utility.lookUpCustomMessage(
          message,
          this.localeConf.self.message
        ),
        level: success ? "info" : "warning",
        visible: true,
        handler: function($router, $cookie) {
          if (success) {
            $cookie.delete("loginuser");
            $cookie.delete("token");
            $router.push({ name: "Login" });
          }
        }
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.float-right {
  float: right;
}
</style>
