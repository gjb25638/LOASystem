<template>
  <v-card flat>
    <v-tooltip bottom>
      <v-toolbar slot="activator" class="theme">
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="$emit('close')">
          <v-icon color="white">clear</v-icon>
        </v-btn>
      </v-toolbar>
      {{title}}
    </v-tooltip>
    <v-card-title>
      <div>
        <div>{{loalocale.self.applied}} {{applied}}</div>
        <div>
          {{loalocale.self.taken}} {{taken}}
          <span v-if="!allDay">{{timeRange}}</span>
        </div>
        <div>{{loalocale.self.remarks}} {{remarks ? remarks : loalocale.self.defaultAgent}}</div>
      </div>
    </v-card-title>
    <v-card-actions v-if="signable">
      <signing-block :employee="employee" :record="record" small @sign="sign"></signing-block>
    </v-card-actions>
  </v-card>
</template>
<script>
import EmployeeService from "@/services/EmployeeService";
import SigningBlock from "@/components/SigningBlock";
import utility from "@/utility";
import reportUtility from "@/reportUtility";
export default {
  name: "LeaveDetailInfo",
  components: {
    "signing-block": SigningBlock
  },
  props: {
    employee: {
      type: Object,
      default: () => ({})
    },
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({}),
  computed: {
    title() {
      return `${this.employee.name}(${
        this.employee.username
      }) ${reportUtility.generateSummary({
        leaveType: this.record.leaveType,
        days: this.record.totals.days,
        hours: this.record.totals.halfHours / 2
      })}`;
    },
    taken() {
      return this.record.dates.map(date => utility.formatDate(date)).join(", ");
    },
    applied() {
      return utility.formatDate(this.record.appliedDate);
    },
    remarks() {
      return this.record.remarks;
    },
    timeRange() {
      return `${this.record.startFrom}-${this.record.endTo}`;
    },
    signable() {
      return this.record.signers.length > 0;
    },
    allDay() {
      return this.record.totals.days > 0;
    }
  },
  methods: {
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
      this.$emit("signed", success, message);
    }
  }
};
</script>
<style>
</style>
