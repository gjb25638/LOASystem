<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template v-slot:activator="{ on }">
      <v-btn icon ripple @click="dialog = true">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
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
              :label="localeConf.self.title.hoursLeave"
            ></v-checkbox>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              type="number"
              min="0"
              :label="localeConf.self.title.consumes + localeConf.self.input.days"
              v-model.number="info.consumes.days"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              :disabled="!info.halfHoursEnabled"
              type="number"
              min="0"
              max="15"
              :label="localeConf.self.input.hours"
              v-model.number="info.consumes.hours"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              type="number"
              min="0"
              :label="localeConf.self.title.totals + localeConf.self.input.days"
              v-model.number="info.totals.days"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              :disabled="!info.halfHoursEnabled"
              type="number"
              min="0"
              max="15"
              :label="localeConf.self.input.hours"
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
                v-model="info.deadline"
                :label="localeConf.self.label.deadline"
                persistent-hint
                prepend-icon="event"
                mask="####-##-##"
                return-masked-value
              ></v-text-field>
              <v-date-picker v-model="info.deadline" no-title @input="datepicker = false"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="theme" @click="dialog = false">{{localeConf.self.btn.close}}</v-btn>
        <v-btn v-if="!info.default" class="theme" @click="removeOne(info.index)">remove</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "LeaveTypeEditorDialog",
  props: {
    info: {
      type: Object,
      validator: function(value) {
        const missingProperties = [
          "consumes",
          "totals",
          "deadline",
          "default",
          "index",
          "halfHoursEnabled"
        ].filter(prop => !(prop in value));
        const valid = missingProperties.length === 0;
        if (!valid) {
          throw new LeaveTypeEditorDialogException(
            `<LeaveTypeEditorDialog> [info] is missing properties: ${missingProperties}`
          );
        }
        return valid;
      }
    }
  },
  data() {
    return {
      dialog: false,
      datepicker: false
    };
  },
  methods: {
    removeOne(index) {
      this.$emit("removeOne", index);
    }
  }
};
function LeaveTypeEditorDialogException(message) {
  this.message = message;
  this.name = "LeaveTypeEditorDialogException";
}
</script>

<style>
</style>
