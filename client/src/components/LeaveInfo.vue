<template>
  <v-chip
    v-on="on"
    :label="allDay"
    :color="color ? color : lt.color"
    :text-color="pass ? (textColor ? textColor : whiteTextColor) : (color ? color : lt.color)"
    :outline="!pass"
    :class="{flash:!pass}"
  >
    <v-avatar :tile="allDay" :color="lt.color" v-if="icon">
      <v-icon :color="whiteTextColor">{{lt.icon}}</v-icon>
    </v-avatar>
    {{taker}}
  </v-chip>
</template>

<script>
import utility from "@/utility";

export default {
  name: "LeaveInfo",
  props: {
    on: {
      type: Object,
      default: () => ({})
    },
    employee: {
      type: Object,
      default: () => ({})
    },
    record: {
      type: Object,
      default: () => ({})
    },
    color: {
      type: String,
      default: ""
    },
    textColor: {
      type: String,
      default: ""
    },
    icon: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    whiteTextColor: "white"
  }),
  computed: {
    pass() {
      return this.record.pass;
    },
    allDay() {
      return this.record.totals.days > 0;
    },
    taker() {
      return this.employee.username;
    },
    lt() {
      return utility.lookUpLeaveType(this.record.leaveType);
    }
  },
  methods: {}
};
</script>

<style scoped>
.v-chip {
  width: 95%;
}
</style>
