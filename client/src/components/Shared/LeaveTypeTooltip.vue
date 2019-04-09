<template>
  <div>
    <div>{{info_formatted.consumes}}</div>
    <div v-if="complete">{{info_formatted.totals}}</div>
    <div>{{info_formatted.deadline}}</div>
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
      validator: function(value) {
        const missingProperties = ["consumes", "totals", "deadline"].filter(
          prop => !(prop in value)
        );
        const valid = missingProperties.length === 0;
        if (!valid) {
          console.log(
            `<LeaveTypeTooltip> [info] is missing properties: ${missingProperties}`
          );
        }
        return valid;
      }
    }
  },
  computed: {
    info_formatted: function() {
      return {
        consumes: utility.stringFormat(
          this.localeConf.self.tooltip.consumes,
          this.info.consumes.days,
          this.info.consumes.halfHours
            ? this.info.consumes.halfHours / 2
            : this.info.consumes.hours
            ? this.info.consumes.hours
            : 0
        ),
        totals: utility.stringFormat(
          this.localeConf.self.tooltip.totals,
          this.info.totals.days,
          this.info.totals.halfHours
            ? this.info.totals.halfHours / 2
            : this.info.consumes.hours
            ? this.info.consumes.hours
            : 0
        ),
        deadline: utility.stringFormat(
          this.localeConf.self.tooltip.deadline,
          this.info.deadline
        )
      };
    }
  }
};
</script>

<style>
</style>
