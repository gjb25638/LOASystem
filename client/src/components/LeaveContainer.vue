<template>
  <v-flex>
    <v-list>
      <v-list-tile avatar v-for="item in leaves" :key="item.index">
        <v-list-tile-avatar>
          <v-icon :class="item.class">{{item.icon}}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{item.title}}</v-list-tile-title>
          <v-tooltip bottom>
            <v-list-tile-sub-title
              slot="activator"
            >{{getTitle(item.apply.dates, item.apply.startFrom, item.apply.endTo, item.apply.totalHours)}}</v-list-tile-sub-title>
            {{getTitle(item.apply.dates, item.apply.startFrom, item.apply.endTo, item.apply.totalHours)}}
          </v-tooltip>
          <v-list-tile-sub-title v-if="item.apply.remarks">{{getAgent(item.apply.remarks)}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-avatar v-if="!readonly || item.countdown">
          <v-tooltip bottom>
            <v-chip slot="activator" class="theme" text-color="white">{{item.apply.remainings.days}}</v-chip>
            <span>{{loalocale.self.remainings}} {{item.apply.remainings.days}} {{loalocale.self.days}}</span>
            <span
              v-if="item.halfHoursEnabled"
            >{{item.apply.remainings.hours}} {{loalocale.self.hours}}</span>
            <br>
            <span>{{loalocale.self.deadline}} {{item.deadline}}</span>
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
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({}),
  methods: {
    getTitle(dates, startFrom, endTo, totalHours) {
      if (dates.length > 1) {
        return dates.join(", ");
      } else {
        if (startFrom && endTo) {
          return `${dates[0]} - ${startFrom} ~ ${endTo} (${totalHours} ${
            this.loalocale.self.hours
          })`;
        } else {
          return dates[0];
        }
      }
    },
    getAgent(remarks) {
      return remarks ? `${this.loalocale.self.remarks}: ${remarks}` : "";
    },
    remove(target) {
      this.$emit("remove", target);
    }
  }
};
</script>
<style>
</style>
