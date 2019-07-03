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
              :leaveTypes="availableLTs"
              :readonly="!fullControl"
              @importOne="import1LT"
              @removeOne="remove1LT"
              helper
            ></leave-type-container>
            <v-layout row wrap>
              <v-flex>
                <v-expansion-panel dark>
                  <v-expansion-panel-content>
                    <div slot="header">{{ loalocale.self.unavailableLTs }}</div>
                    <v-expansion-panel
                      class="insider"
                      dark
                      v-for="group in unavailableLTsGroups"
                      :key="group.year"
                    >
                      <v-expansion-panel-content>
                        <div slot="header">- {{ group.year }} ({{group.list.length}})</div>
                        <leave-type-container :leaveTypes="group.list" :readonly="!fullControl"></leave-type-container>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-btn
                  :class="['theme', 'float-right']"
                  @click="submit"
                  v-if="fullControl"
                >{{isEditMode ? loalocale.self.update: loalocale.self.create}}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
    <system-notification v-model="systemNotification" @close="systemNotification.visible = false">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </v-app>
</template>
<script>
import SystemNotification from "@/components/SystemNotification";
import EmployeeProfile from "@/components/EmployeeProfile";
import EmployeeAccountSettings from "@/components/EmployeeAccountSettings";
import LeaveTypeContainer from "@/components/LeaveTypeContainer";
import EmployeeService from "@/services/EmployeeService";
import utility from "@/utility";
import defaultConf from "@/default";
export default {
  name: "Detail",
  components: {
    "system-notification": SystemNotification,
    "employee-profile": EmployeeProfile,
    "employee-account-settings": EmployeeAccountSettings,
    "leave-type-container": LeaveTypeContainer
  },
  data: () => ({
    systemNotification: {
      level: "warning",
      text: "",
      visible: false
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
      email: "",
      id: ""
    },
    leaveTypes: [],
    isEditMode: false,
    fullControl: false,
    signerOptions: [
      {
        id: "",
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
    availableLTs() {
      return this.leaveTypes.filter(lt => {
        return !this.isEditMode || (!this.isAvailableLT(lt) && !lt.stashed);
      });
    },
    unavailableLTs() {
      return this.leaveTypes.filter(lt => {
        return this.isAvailableLT(lt) || lt.stashed;
      });
    },
    unavailableLTsGroups() {
      const groups = [];
      this.unavailableLTs.forEach(leaveType => {
        const date = new Date(leaveType.deadline);
        const year = date.getFullYear();
        const group = groups.find(g => g.year === year);
        if (group) {
          group.list.push(leaveType);
        } else {
          groups.push({ list: [leaveType], year });
        }
      });
      return groups;
    }
  },
  mounted() {
    this.account.id = this.$route.params.id;
    this.isEditMode = this.$route.params.id && this.$route.params.id !== "new";
    if (this.isEditMode) {
      this.getEmployee();
    } else {
      this.fullControl = true;
      this.leaveTypes = JSON.parse(JSON.stringify(defaultConf.leaveTypes));
    }
    this.getEmployees();
  },
  methods: {
    isAvailableLT(leaveType) {
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
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      this.signerOptions = employees.map(e => ({
        id: e._id,
        dept: e.dept,
        name: e.name,
        username: e.username,
        level: e.level
      }));
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
          activatedLeaveTypes,
          fullControl,
          email
        }
      } = await EmployeeService.get({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
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
      this.leaveTypes = this.accumulateLTsCosumes(
        this.formatLT(activatedLeaveTypes)
      );
    },
    async submit() {
      if (this.$refs.form.validate()) {
        const params = {
          employeeID: this.profile.employeeID,
          dept: this.profile.dept,
          name: this.profile.name,
          username: this.profile.username,
          arrivedDate: this.profile.arrivedDate,
          level: this.profile.level,
          email: this.profile.email,
          activatedLeaveTypes: this.leaveTypes.map(lt => {
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
          loginuser: this.loginuser.username,
          token: this.loginuser.token,
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
          this.systemNotification.text = utility.lookUpCustomMessage(message);
          this.systemNotification.visible = true;
        }
      } else {
        this.systemNotification = {
          text: this.loalocale.self.textfieldUndone,
          level: "warning",
          visible: true
        };
      }
    },
    formatLT(leaveTypes) {
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
            enabled: lt.enabled,
            stashed: lt.stashed,
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
            deadline: utility.formatDate(lt.deadline),
            halfHoursEnabled: lt.halfHoursEnabled
          });
        }
      });
      return newLeaveTypes.filter(lt => this.fullControl || lt.enabled);
    },
    remove1LT(index) {
      this.leaveTypes = this.leaveTypes.filter(lt => lt.index !== index);
    },
    import1LT(customTypeName) {
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
    accumulateLTsCosumes(leaveTypes) {
      const familyCare = leaveTypes.find(lt => lt.name === "familyCare");
      if (familyCare) {
        const personal = leaveTypes.find(lt => lt.name === "personal");
        personal.consumes.days += familyCare.consumes.days;
      }
      return leaveTypes;
    },
    async resetEmail(success, message) {
      this.systemNotification = {
        text: utility.lookUpCustomMessage(message),
        level: success ? "info" : "warning",
        visible: true,
        handler: ($router, $cookie) => {
          if (success) {
            $router.push({ name: "List" });
          }
        }
      };
    },
    async resetPWD(success, message) {
      this.systemNotification = {
        text: utility.lookUpCustomMessage(message),
        level: success ? "info" : "warning",
        visible: true,
        handler: ($router, $cookie) => {
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
<style>
.insider .v-expansion-panel__header {
  padding: 12px 50px !important;
}
</style>
