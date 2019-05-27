<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card id="apply">
        <v-toolbar :class="leaveType.class">
          <h3>{{leaveType.title}}</h3>
          <v-spacer></v-spacer>
          <v-icon :class="leaveType.class" :title="leaveType.title">{{leaveType.icon}}</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-dialog
                :disabled="!leaveType.title"
                ref="dialog"
                :close-on-content-click="false"
                v-model="dialog.date"
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
                  :label="loalocale.self.leaveDates"
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
                  <v-btn flat class="theme" @click="checkDates($refs.dialog, 'dates')">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-flex>
            <v-flex v-if="leaveType.halfHoursEnabled && apply.dates.length === 1" xs6>
              <v-dialog
                ref="startFromDialog"
                :close-on-content-click="false"
                v-model="dialog.startFrom"
                lazy
                width="290px"
                persistent
              >
                <v-text-field
                  slot="activator"
                  v-model="apply.startFrom"
                  :label="loalocale.self.from"
                  prepend-icon="access_time"
                ></v-text-field>
                <v-time-picker
                  v-model="apply.startFrom"
                  format="24hr"
                  :allowed-minutes="allowedMinutes"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    class="theme"
                    @click="calculateTotals($refs.startFromDialog, 'startFrom')"
                  >OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex v-if="leaveType.halfHoursEnabled && apply.dates.length === 1" xs5>
              <v-dialog ref="endToDialog" v-model="dialog.endTo" lazy width="290px">
                <v-text-field
                  slot="activator"
                  v-model="apply.endTo"
                  :label="loalocale.self.to"
                  :allowed-minutes="allowedMinutes"
                ></v-text-field>
                <v-time-picker v-model="apply.endTo" format="24hr">
                  <v-spacer></v-spacer>
                  <v-btn flat class="theme" @click="calculateTotals($refs.endToDialog, 'endTo')">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex v-if="leaveType.halfHoursEnabled && apply.dates.length === 1" xs1>
              <v-btn icon ripple @click="clear">
                <v-icon size="16">clear</v-icon>
              </v-btn>
            </v-flex>
            <v-flex v-if="leaveType.halfHoursEnabled && apply.dates.length === 1" xs6>
              <v-text-field
                v-model.number="apply.totalHours"
                :label="loalocale.self.totals"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex v-if="leaveType.halfHoursEnabled && apply.dates.length === 1" xs6>
              <v-text-field :value="loalocale.self.hour" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :disabled="!leaveType.title"
                :label="loalocale.self.remarks"
                v-model="apply.remarks"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn @click="submit" :class="valid ? 'theme' : 'disabled'" :disabled="!valid">
                <v-icon>move_to_inbox</v-icon>
                {{loalocale.self.take}}
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
    dates: {
      type: Array,
      default: () => []
    },
    leaveType: {
      type: Object,
      default: () => ({
        class: "",
        icon: "",
        title: "",
        halfHoursEnabled: false
      })
    },
    allowedDates: {
      type: Function
    }
  },
  data: () => ({
    dialog: {
      date: false,
      startFrom: false,
      endTo: false
    },
    apply: {
      created: null,
      startFrom: null,
      endTo: null,
      dates: [],
      totalHours: 0,
      remarks: "",
      remainings: {
        days: 0,
        hours: 0
      }
    }
  }),
  computed: {
    valid() {
      return this.apply.dates.length > 0;
    }
  },
  mounted() {
    this.apply.dates = this.dates;
  },
  methods: {
    calculateTotals(dialog, target) {
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
    allowedMinutes(minutes) {
      return minutes === 30 || minutes === 0;
    },
    clear() {
      this.apply.startFrom = null;
      this.apply.endTo = null;
      this.apply.totalHours = 0;
    },
    submit() {
      this.$emit("submit", this.apply);
      this.apply = {
        created: null,
        startFrom: null,
        endTo: null,
        dates: [],
        totalHours: 0,
        remarks: "",
        remainings: {
          days: 0,
          hours: 0
        }
      };
    }
  },
  watch: {
    dates() {
      this.apply.dates = this.dates;
    }
  }
};
</script>
<style>
</style>
