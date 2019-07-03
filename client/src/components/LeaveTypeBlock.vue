<template>
  <v-list-tile>
    <v-list-tile-content>
      <v-list-tile-title>{{loalocale.shared.leaveTypes[leaveType.leaveType] ? loalocale.shared.leaveTypes[leaveType.leaveType] : leaveType.leaveType}}</v-list-tile-title>
      <v-list-tile-sub-title>{{generateleaveTypeSummary(leaveType.daysNHours)}}</v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
import reportUtility from "@/reportUtility.js";
export default {
  name: "LeaveTypeBlock",
  props: {
    leaveType: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    generateleaveTypeSummary: reportUtility.generateleaveTypeSummary
  }
};
</script>
<style>
.sign-btn {
  justify-content: center !important;
}
</style>
