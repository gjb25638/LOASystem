<template>
  <v-tooltip bottom>
    <v-list-tile avatar class="row" slot="activator">
      <v-list-tile-avatar @click="pickOne(leaveType)" class="clickable">
        <v-icon :class="leaveType.class">{{leaveType.icon}}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content :title="leaveType.title" @click="pickOne(leaveType)" class="clickable">
        <v-list-tile-title>{{leaveType.title}}</v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-avatar v-if="!readonly || leaveType.countdown">
        <v-tooltip bottom>
          <animated-circular
            slot="activator"
            :value="calculatePercentage(leaveType.totals, leaveType.consumes)"
            :color="leaveType.class[0]"
          >{{leaveType.consumes.days}}</animated-circular>
          <leave-type-tooltip :complete="leaveType.countdown" :info="leaveType"></leave-type-tooltip>
        </v-tooltip>
      </v-list-tile-avatar>
      <v-list-tile-action v-if="!readonly">
        <leave-type-editor-dialog :info="leaveType" :key="leaveType.title" @removeOne="removeOne"></leave-type-editor-dialog>
      </v-list-tile-action>
      <v-list-tile-action v-if="!readonly">
        <v-btn icon ripple @click="leaveType.enabled = !leaveType.enabled">
          <v-icon
            :class="leaveType.enabled ? 'green--text' : ''"
          >{{leaveType.enabled ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
    {{leaveType.title}}
  </v-tooltip>
</template>
<script>
import LeaveTypeTooltip from "@/components/LeaveTypeTooltip";
import AnimatedCircular from "@/components/AnimatedCircular";
import LeaveTypeEditorDialog from "@/components/LeaveTypeEditorDialog";
export default {
  name: "LeaveTypeRow",
  components: {
    "leave-type-tooltip": LeaveTypeTooltip,
    "animated-circular": AnimatedCircular,
    "leave-type-editor-dialog": LeaveTypeEditorDialog
  },
  props: {
    leaveType: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  data: () => ({
    customTypeName: ""
  }),
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
