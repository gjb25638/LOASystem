<template>
  <v-list-tile>
    <v-list-tile-avatar v-if="!small">
      <v-icon riple :class="record.class">{{record.icon}}</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content v-if="!small">
      <v-list-tile-title>{{loalocale.shared.leaveTypes[record.leaveType] ? loalocale.shared.leaveTypes[record.leaveType] : record.leaveType}}</v-list-tile-title>
      <v-list-tile-sub-title>{{generateSummary(record.dates, record.startFrom, record.endTo)}}</v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action v-if="needToSign">
      <small>{{loalocale.self.label.sign}}</small>
    </v-list-tile-action>
    <v-list-tile-action class="sign-btn" v-if="needToSign">
      <v-tooltip top>
        <v-btn icon ripple @click="signLeave(employee._id, record._id, true)" slot="activator">
          <v-icon color="green">thumb_up</v-icon>
        </v-btn>
        <div>{{loalocale.self.tooltip.pass}}</div>
      </v-tooltip>
    </v-list-tile-action>
    <v-list-tile-action class="sign-btn" v-if="needToSign">
      <v-tooltip top>
        <v-btn icon ripple @click="signLeave(employee._id, record._id, false)" slot="activator">
          <v-icon color="red">pan_tool</v-icon>
        </v-btn>
        <div>{{loalocale.self.tooltip.reject}}</div>
      </v-tooltip>
    </v-list-tile-action>
    <v-list-tile-action>
      <small>{{loalocale.self.label.signed}}</small>
    </v-list-tile-action>
    <v-list-tile-action>
      <v-tooltip bottom>
        <v-rating
          slot="activator"
          readonly
          :value="distinctSignings(record.signings).length"
          :length="record.signers.length"
          empty-icon="check_box_outline_blank"
          full-icon="check_box"
        ></v-rating>
        <signing-tooltip
          v-for="signer in record.signers"
          :key="signer._id"
          :signer="signer"
          :signings="record.signings"
        ></signing-tooltip>
      </v-tooltip>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import utility from "@/utility.js";
import SigningTooltip from "@/components/SigningTooltip";
export default {
  name: "SigningBlock",
  components: {
    "signing-tooltip": SigningTooltip
  },
  props: {
    small: {
      type: Boolean,
      default: false
    },
    employee: {
      type: Object
    },
    record: {
      type: Object
    }
  },
  data: () => ({}),
  computed: {
    needToSign() {
      return !this.record.pass && !this.sameAsCurrentUser;
    },
    sameAsCurrentUser() {
      return (
        this.loginuser.username.toLocaleLowerCase() ===
        this.employee.username.toLocaleLowerCase()
      );
    }
  },
  mounted() {},
  methods: {
    signLeave(eid, rid, pass) {
      this.$emit("sign", eid, rid, pass);
    },
    distinctSignings(signings) {
      const result = [];
      signings.forEach(signing => {
        if (!result.some(x => x.username === signing.username)) {
          result.push(signing);
        }
      });
      return result;
    },
    generateSummary: utility.generateSummary
  }
};
</script>

<style>
.sign-btn {
  justify-content: center !important;
}
</style>
