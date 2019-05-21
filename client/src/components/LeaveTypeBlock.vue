<template>
  <v-list-tile>
    <v-list-tile-content>
      <v-list-tile-title>{{loalocale.shared.leaveTypes[record.leaveType] ? loalocale.shared.leaveTypes[record.leaveType] : record.leaveType}}</v-list-tile-title>
      <v-list-tile-sub-title>{{generateleaveTypeSummary(record.daysNHours)}}</v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
import reportUtility from "@/reportUtility.js";
export default {
  name: "LeaveTypeBlock",
  props: {
    record: {
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
