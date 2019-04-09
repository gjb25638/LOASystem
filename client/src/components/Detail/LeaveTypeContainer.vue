<template>
  <v-layout row wrap>
    <v-flex v-if="!listonly" xs12>
      <small>{{localeConf.self.label.pickLeaveType}}</small>
      <router-link v-bind:to="{ name: 'LeaveTypeInfo' }" target="_blank">
        <v-icon>open_in_new</v-icon>
      </router-link>
    </v-flex>
    <v-flex xs12>
      <v-list>
        <leave-type-row
          v-for="lt in leaveTypes"
          :key="lt.title"
          :leavetype="lt"
          :readonly="readonly"
          @pickOne="pickOne"
          @removeOne="removeOne"
        ></leave-type-row>
        <v-list-tile avatar v-if="!readonly && !listonly">
          <v-list-tile-avatar>
            <v-icon :class="['brown', 'darken-1', 'white--text']">event</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-text-field :label="this.localeConf.self.input.others" v-model="customTypeName"></v-text-field>
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
              <div>{{localeConf.self.btn.import}}</div>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import AnimatedCircular from "@/components/Shared/AnimatedCircular";
import LeaveTypeRow from "@/components/Detail/LeaveTypeRow";
export default {
  name: "LeaveTypeContainer",
  components: {
    "animated-circular": AnimatedCircular,
    "leave-type-row": LeaveTypeRow
  },
  props: {
    leaveTypes: {
      type: Array,
      default: function() {
        return [];
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    listonly: {
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
    pickOne(leaveType) {
      this.$emit("pickOne", leaveType);
    },
    importOne() {
      this.$emit("importOne", this.customTypeName);
    },
    removeOne(index) {
      this.$emit("removeOne", index);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
