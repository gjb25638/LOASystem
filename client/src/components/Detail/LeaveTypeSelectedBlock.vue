<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card id="apply">
        <v-toolbar :class="selectedDateType.class">
          <h3>{{selectedDateType.title}}</h3>
          <v-spacer></v-spacer>
          <v-icon
            :class="selectedDateType.class"
            :title="selectedDateType.title"
          >{{selectedDateType.icon}}</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-dialog
                :disabled="!selectedDateType.title"
                ref="dateDialog"
                :close-on-content-click="false"
                v-model="dateDialog"
                lazy
                width="290px"
                persistent
              >
                <v-combobox
                  slot="activator"
                  v-model="apply.dates"
                  multiple
                  chips
                  small-chips
                  :label="localeConf.self.input.leaveDates"
                  readonly
                ></v-combobox>
                <v-date-picker
                  :allowed-dates="allowedDates"
                  v-model="apply.dates"
                  multiple
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn flat class="theme" @click="checkDates($refs.dateDialog, 'dates')">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-flex>
            <v-flex v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1" xs2>
              <v-dialog
                ref="startFromDialog"
                :close-on-content-click="false"
                v-model="startFromDialog"
                lazy
                width="290px"
                persistent
              >
                <v-text-field
                  slot="activator"
                  v-model="apply.startFrom"
                  :label="localeConf.self.input.from"
                  prepend-icon="access_time"
                ></v-text-field>
                <v-time-picker
                  v-model="apply.startFrom"
                  format="24hr"
                  :allowed-hours="allowedHours"
                  :allowed-minutes="allowedMinutes"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    class="theme"
                    @click="calculateTotalTime($refs.startFromDialog, 'startFrom')"
                  >OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1" xs2>
              <v-dialog
                ref="endToDialog"
                :close-on-content-click="false"
                v-model="endToDialog"
                lazy
                width="290px"
                persistent
              >
                <v-text-field
                  slot="activator"
                  v-model="apply.endTo"
                  :label="localeConf.self.input.to"
                ></v-text-field>
                <v-time-picker
                  v-model="apply.endTo"
                  format="24hr"
                  :allowed-hours="allowedHours"
                  :allowed-minutes="allowedMinutes"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    class="theme"
                    @click="calculateTotalTime($refs.endToDialog, 'endTo')"
                  >OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1" xs1>
              <v-btn icon ripple @click="clearStartFromEndTo">
                <v-icon size="16">clear</v-icon>
              </v-btn>
            </v-flex>
            <v-flex v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1" xs4></v-flex>
            <v-flex v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1" xs1>
              <v-text-field
                v-model.number="apply.totalHours"
                :label="localeConf.self.input.totals"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex v-if="selectedDateType.halfHoursEnabled && apply.dates.length === 1" xs2>
              <v-text-field :value="localeConf.self.input.hours" readonly></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-text-field
                :disabled="!selectedDateType.title"
                :label="localeConf.self.input.agent"
                v-model="apply.agent"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn @click="takeALeave" class="theme">
                <v-icon>move_to_inbox</v-icon>
                {{localeConf.self.btn.leave}}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex>
      <v-list>
        <v-list-tile avatar v-for="item in records" :key="item.index">
          <v-list-tile-avatar>
            <v-icon :class="item.class">{{item.icon}}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
            <v-list-tile-sub-title>{{combineDatesContent(item.apply.dates, item.apply.startFrom, item.apply.endTo, item.apply.totalHours)}}</v-list-tile-sub-title>
            <v-list-tile-sub-title v-if="item.apply.agent">{{combineAgentContent(item.apply.agent)}}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-avatar v-if="fullControl || item.countdown">
            <v-tooltip bottom>
              <v-chip
                slot="activator"
                class="theme"
                text-color="white"
              >{{item.apply.remainings.days}}</v-chip>
              <span>{{localeConf.self.dialog.remainings}} {{item.apply.remainings.days}} {{localeConf.self.dialog.input.days}}</span>
              <span
                v-if="item.halfHoursEnabled"
              >{{item.apply.remainings.hours}} {{localeConf.self.dialog.input.hours}}</span>
              <br>
              <span>{{localeConf.self.dialog.deadline}} {{item.deadline}}</span>
            </v-tooltip>
          </v-list-tile-avatar>
          <v-list-tile-avatar>
            <v-btn icon ripple @click="removeALeave(item)">
              <v-icon size="16">clear</v-icon>
            </v-btn>
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "LeaveTypeSelectedBlock",
  props: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style>
</style>
