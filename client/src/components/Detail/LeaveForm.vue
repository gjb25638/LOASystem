<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card id="apply">
        <v-toolbar :class="leavetype.class">
          <h3>{{leavetype.title}}</h3>
          <v-spacer></v-spacer>
          <v-icon :class="leavetype.class" :title="leavetype.title">{{leavetype.icon}}</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-dialog
                :disabled="!leavetype.title"
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
            <v-flex v-if="leavetype.halfHoursEnabled && apply.dates.length === 1" xs2>
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
                <v-time-picker v-model="apply.startFrom" format="24hr">
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    class="theme"
                    @click="calculateTotalTime($refs.startFromDialog, 'startFrom')"
                  >OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex v-if="leavetype.halfHoursEnabled && apply.dates.length === 1" xs2>
              <v-dialog ref="endToDialog" v-model="endToDialog" lazy width="290px">
                <v-text-field
                  slot="activator"
                  v-model="apply.endTo"
                  :label="localeConf.self.input.to"
                ></v-text-field>
                <v-time-picker v-model="apply.endTo" format="24hr">
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    class="theme"
                    @click="calculateTotalTime($refs.endToDialog, 'endTo')"
                  >OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex v-if="leavetype.halfHoursEnabled && apply.dates.length === 1" xs1>
              <v-btn icon ripple @click="clearStartFromEndTo">
                <v-icon size="16">clear</v-icon>
              </v-btn>
            </v-flex>
            <v-flex v-if="leavetype.halfHoursEnabled && apply.dates.length === 1" xs4></v-flex>
            <v-flex v-if="leavetype.halfHoursEnabled && apply.dates.length === 1" xs1>
              <v-text-field
                v-model.number="apply.totalHours"
                :label="localeConf.self.input.totals"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex v-if="leavetype.halfHoursEnabled && apply.dates.length === 1" xs2>
              <v-text-field :value="localeConf.self.input.hours" readonly></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-text-field
                :disabled="!leavetype.title"
                :label="localeConf.self.input.agent"
                v-model="apply.agent"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn
                @click="submit"
                :class="valid ? 'theme' : 'disabled'"
                :disabled="!valid"
              >
                <v-icon>move_to_inbox</v-icon>
                {{localeConf.self.btn.leave}}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import utility from "@/utility";
export default {
  name: "LeaveForm",
  props: {
    leavetype: {
      type: Object,
      validator: function(value) {
        const missingProperties = [
          "class",
          "icon",
          "title",
          "halfHoursEnabled"
        ].filter(prop => !(prop in value));
        const valid = missingProperties.length === 0;
        if (!valid) {
          console.log(
            `<LeaveForm> [leavetype] is missing properties: ${missingProperties}`
          );
        }
        return valid;
      }
    },
    allowedDates: {
      type: Function
    }
  },
  data() {
    return {
      dateDialog: false,
      apply: {
        created: null,
        startFrom: null,
        endTo: null,
        dates: [],
        totalHours: 0,
        agent: "",
        remainings: {
          days: 0,
          hours: 0
        }
      },
      startFromDialog: false,
      endToDialog: false
    };
  },
  computed: {
    valid: function() {
      return this.apply.dates.length > 0;
    }
  },
  methods: {
    calculateTotalTime(dialog, target) {
      dialog.save(this.apply[target]);
      this.apply.totalHours = utility.calculateTotalHours(
        this.apply.startFrom,
        this.apply.endTo
      );
      if (this.apply.totalHours === -1) {
        this.apply.totalHours = 0;
        this.apply.endTo = this.apply.startFrom = null;
      }
    },
    checkDates(dialog, target) {
      this.apply[target] = this.apply[target].slice(0, 5).sort();
      dialog.save(this.apply[target]);
    },
    clearStartFromEndTo() {
      this.apply.startFrom = null;
      this.apply.endTo = null;
      this.apply.totalHours = 0;
    },
    submit() {
      this.$emit("submit", this.apply);
    }
  }
};
</script>

<style>
</style>
