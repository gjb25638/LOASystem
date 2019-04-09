<template>
  <v-flex>
    <v-list>
      <v-list-tile avatar v-for="item in leaves" :key="item.index">
        <v-list-tile-avatar>
          <v-icon :class="item.class">{{item.icon}}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{item.title}}</v-list-tile-title>
          <v-list-tile-sub-title>{{combineDatesContent(item.apply.dates, item.apply.startFrom, item.apply.endTo, item.apply.totalHours)}}</v-list-tile-sub-title>
          <v-list-tile-sub-title v-if="item.apply.agent">{{combineAgentContent(item.apply.agent)}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-avatar v-if="!readonly || item.countdown">
          <v-tooltip bottom>
            <v-chip slot="activator" class="theme" text-color="white">{{item.apply.remainings.days}}</v-chip>
            <span>{{localeConf.self.label.remainings}} {{item.apply.remainings.days}} {{localeConf.self.label.days}}</span>
            <span
              v-if="item.halfHoursEnabled"
            >{{item.apply.remainings.hours}} {{localeConf.self.label.hours}}</span>
            <br>
            <span>{{localeConf.self.label.deadline}} {{item.deadline}}</span>
          </v-tooltip>
        </v-list-tile-avatar>
        <v-list-tile-avatar>
          <v-btn icon ripple @click="remove(item)">
            <v-icon size="16">clear</v-icon>
          </v-btn>
        </v-list-tile-avatar>
      </v-list-tile>
    </v-list>
  </v-flex>
</template>

<script>
export default {
  name: "LeaveContainer",
  props: {
    leaves: {
      type: Array,
      default: function() {
        return [];
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    combineDatesContent(dates, startFrom, endTo, totalHours) {
      if (dates.length > 1) {
        return dates.join(", ");
      } else {
        if (startFrom && endTo) {
          return `${dates[0]} - ${startFrom} ~ ${endTo} (${totalHours} ${
            this.localeConf.self.label.hours
          })`;
        } else {
          return dates[0];
        }
      }
    },
    combineAgentContent(agent) {
      return agent ? `${this.localeConf.self.label.agent}: ${agent}` : "";
    },
    remove(target) {
      this.$emit('remove', target);
    }
  }
};
</script>

<style>
</style>
