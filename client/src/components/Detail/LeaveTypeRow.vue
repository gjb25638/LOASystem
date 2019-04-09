<template>
  <v-list-tile avatar class="row">
    <v-list-tile-avatar @click="pickOne(leavetype)" class="clickable">
      <v-icon :class="leavetype.class">{{leavetype.icon}}</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content :title="leavetype.title" @click="pickOne(leavetype)" class="clickable">
      <v-list-tile-title>{{leavetype.title}}</v-list-tile-title>
    </v-list-tile-content>
    <v-list-tile-avatar v-if="!readonly || leavetype.countdown">
      <v-tooltip bottom>
        <animated-circular
          slot="activator"
          :value="calculatePercentage(leavetype.totals, leavetype.consumes)"
          :color="leavetype.class[0]"
        >{{leavetype.consumes.days}}</animated-circular>
        <leave-type-tooltip :complete="leavetype.countdown" :info="leavetype"></leave-type-tooltip>
      </v-tooltip>
    </v-list-tile-avatar>
    <v-list-tile-action v-if="!readonly">
      <leave-type-editor-dialog :info="leavetype" :key="leavetype.title" @removeOne="removeOne"></leave-type-editor-dialog>
    </v-list-tile-action>
    <v-list-tile-action v-if="!readonly">
      <v-btn icon ripple @click="leavetype.enabled = !leavetype.enabled">
        <v-icon
          :class="leavetype.enabled ? 'green--text' : ''"
        >{{leavetype.enabled ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import LeaveTypeTooltip from "@/components/Shared/LeaveTypeTooltip";
import AnimatedCircular from "@/components/Shared/AnimatedCircular";
import LeaveTypeEditorDialog from "@/components/Detail/LeaveTypeEditorDialog";
export default {
  name: "LeaveTypeRow",
  components: {
    "leave-type-tooltip": LeaveTypeTooltip,
    "animated-circular": AnimatedCircular,
    "leave-type-editor-dialog": LeaveTypeEditorDialog
  },
  props: {
    leavetype: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  data() {
    return {
      customTypeName: "",
      interval: {}
    };
  },
  methods: {
    calculatePercentage(totals, consumes) {
      const totalsHalfHours =
        totals.days * 8 * 2 +
        (totals.halfHours
          ? totals.halfHours
          : totals.hours
          ? totals.hours * 2
          : 0);
      const consumesHalfHours =
        consumes.days * 8 * 2 +
        (consumes.halfHours
          ? consumes.halfHours
          : consumes.hours
          ? consumes.hours * 2
          : 0);
      return (consumesHalfHours * 100) / totalsHalfHours;
    },
    pickOne(leaveType) {
      this.$emit("pickOne", leaveType);
    },
    removeOne(index) {
      this.$emit("removeOne", index);
    }
  }
};
</script>

<style lang="scss" scoped>
.row:hover {
  background-color: lightgray;
}
.clickable {
  cursor: pointer;
}
</style>
