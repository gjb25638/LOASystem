<template>
  <div>
    <v-btn icon ripple @click="dialog = true">
      <v-icon>edit</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title>
          <h2>{{info.title}}</h2>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-checkbox
                v-if="!info.default"
                v-model="info.halfHoursEnabled"
                :label="loalocale.self.hoursLeave"
              ></v-checkbox>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                type="number"
                min="0"
                :label="loalocale.self.consumes + loalocale.self.days"
                v-model.number="info.consumes.days"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                :disabled="!info.halfHoursEnabled"
                type="number"
                min="0"
                max="15"
                :label="loalocale.self.hours"
                v-model.number="info.consumes.hours"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                type="number"
                min="0"
                :label="loalocale.self.totals + loalocale.self.days"
                v-model.number="info.totals.days"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                :disabled="!info.halfHoursEnabled"
                type="number"
                min="0"
                max="15"
                :label="loalocale.self.hours"
                v-model.number="info.totals.hours"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-menu
                :close-on-content-click="false"
                v-model="datepicker"
                :nudge-right="0"
                lazy
                transition="scale-transition"
                offset-x
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="dateInput"
                  :label="loalocale.self.deadline"
                  persistent-hint
                  prepend-icon="event"
                  mask="####-##-##"
                  return-masked-value
                  @blur="info.deadline = dateInput"
                ></v-text-field>
                <v-date-picker
                  v-model="info.deadline"
                  no-title
                  @input="datepicker = false;dateInput = info.deadline"
                ></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="theme" @click="dialog = false">{{loalocale.self.close}}</v-btn>
          <v-btn
            v-if="!info.default"
            class="theme"
            @click="removeOne(info.index)"
          >{{loalocale.self.remove}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "LeaveTypeEditorDialog",
  props: {
    info: {
      type: Object,
      default: () => ({
        consumes: { days: 0, hours: 0 },
        totals: { days: 0, hours: 0 },
        deadline: "",
        default: false,
        index: 0,
        halfHoursEnabled: false
      })
    }
  },
  data: () => ({
    dialog: false,
    datepicker: false,
    dateInput: ""
  }),
  mounted() {},
  watch: {
    info() {
      this.dateInput = this.info.deadline;
    }
  },
  methods: {
    removeOne(index) {
      this.$emit("removeOne", index);
    }
  }
};
</script>
<style>
</style>
