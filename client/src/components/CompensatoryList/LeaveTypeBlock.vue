<template>
  <v-list-tile>
    <v-list-tile-content>
      <v-list-tile-title>{{localeConf.shared.dateTypes[record.dateType] ? localeConf.shared.dateTypes[record.dateType] : record.dateType}}</v-list-tile-title>
      <v-list-tile-sub-title>{{generateDateTypeSummary(record.daysNHours)}}</v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
import reportUtility from '@/reportUtility.js'
export default {
  name: 'LeaveTypeBlock',
  props: {
    record: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {
    generateDateTypeSummary: reportUtility.generateDateTypeSummary
  }
}
</script>

<style>
.sign-btn {
  justify-content: center !important;
}
</style>
