<template>
  <div>
    <div>{{formattedInfo.consumes}}</div>
    <div v-if="complete">{{formattedInfo.totals}}</div>
    <div>{{formattedInfo.deadline}}</div>
  </div>
</template>
<script>
import utility from "@/utility.js";
export default {
  name: "LeaveTypeTooltip",
  props: {
    complete: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => ({
        consumes: { days: 0, halfHours: 0 },
        totals: { days: 0, halfHours: 0 },
        deadline: ""
      })
    }
  },
  computed: {
    formattedInfo() {
      return {
        consumes: utility.stringFormat(
          this.loalocale.self.stringTemplate.consumes,
          this.info.consumes.days,
          this.info.consumes.halfHours
            ? this.info.consumes.halfHours / 2
            : this.info.consumes.hours
            ? this.info.consumes.hours
            : 0
        ),
        totals: utility.stringFormat(
          this.loalocale.self.stringTemplate.totals,
          this.info.totals.days,
          this.info.totals.halfHours
            ? this.info.totals.halfHours / 2
            : this.info.totals.hours
            ? this.info.totals.hours
            : 0
        ),
        deadline: utility.stringFormat(
          this.loalocale.self.stringTemplate.deadline,
          this.info.deadline
        )
      };
    }
  }
};
</script>
<style>
</style>
