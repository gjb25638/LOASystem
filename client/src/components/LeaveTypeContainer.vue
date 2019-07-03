<template>
  <v-layout row wrap>
    <v-flex v-if="helper" xs12>
      <small>{{loalocale.self.pickLeaveType}}</small>
      <router-link v-bind:to="{ name: 'LeaveTypeInfo' }" target="_blank">
        <v-icon>open_in_new</v-icon>
      </router-link>
    </v-flex>
    <v-flex xs12>
      <v-list>
        <leave-type-row
          v-for="lt in leaveTypes"
          :key="lt.title"
          :leaveType="lt"
          :readonly="readonly"
          @pickOne="pickOne"
          @removeOne="removeOne"
        ></leave-type-row>
        <v-list-tile avatar v-if="!readonly && helper">
          <v-list-tile-avatar>
            <v-icon :class="['teal', 'lighten-3', 'white--text']">event</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-text-field :label="this.loalocale.self.others" v-model="customTypeName"></v-text-field>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip bottom>
              <v-btn
                icon
                ripple
                :class="customTypeName ? 'theme' : 'disabled'"
                slot="activator"
                @click="importOne"
                :disabled="!customTypeName"
              >
                <v-icon>add</v-icon>
              </v-btn>
              <div>{{loalocale.self.import}}</div>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import LeaveTypeRow from "@/components/LeaveTypeRow";
export default {
  name: "LeaveTypeContainer",
  components: {
    "leave-type-row": LeaveTypeRow
  },
  props: {
    leaveTypes: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    helper: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  data: () => ({
    customTypeName: "",
    interval: {}
  }),
  methods: {
    pickOne(leaveType) {
      this.$emit("pickOne", leaveType);
    },
    importOne() {
      this.$emit("importOne", this.customTypeName);
      this.customTypeName = "";
    },
    removeOne(index) {
      this.$emit("removeOne", index);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
