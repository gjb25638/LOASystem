<template>
  <v-list-tile>
    <v-list-tile-avatar>
      <v-icon riple :class="record.class">{{record.icon}}</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>{{localeConf.shared.dateTypes[record.dateType] ? localeConf.shared.dateTypes[record.dateType] : record.dateType}}</v-list-tile-title>
      <v-list-tile-sub-title>{{generateSummary(record.dates, record.startFrom, record.endTo)}}</v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action v-if="!sameAsCurrentUser">
      <small>{{localeConf.self.label.sign}}</small>
    </v-list-tile-action>
    <v-list-tile-action v-if="!sameAsCurrentUser" class="sign-btn">
      <v-tooltip bottom>
        <v-btn icon ripple @click="signLeave(employee._id, record._id, true)" slot="activator">
          <v-icon color="green">thumb_up</v-icon>
        </v-btn>
        <div>{{localeConf.self.tooltip.pass}}</div>
      </v-tooltip>
    </v-list-tile-action>
    <v-list-tile-action v-if="!sameAsCurrentUser" class="sign-btn">
      <v-tooltip bottom>
        <v-btn icon ripple @click="signLeave(employee._id, record._id, false)" slot="activator">
          <v-icon color="red">pan_tool</v-icon>
        </v-btn>
        <div>{{localeConf.self.tooltip.reject}}</div>
      </v-tooltip>
    </v-list-tile-action>
    <v-list-tile-action>
      <small>{{localeConf.self.label.signed}}</small>
    </v-list-tile-action>
    <v-list-tile-action>
      <v-tooltip bottom>
        <v-rating slot="activator" readonly v-model="record.signings.length" :length="record.signers.length" empty-icon="check_box_outline_blank" full-icon="check_box"></v-rating>
        <signing-tooltip v-for="signer in record.signers" :key="signer._id" :signer="signer" :signings="record.signings"></signing-tooltip>
      </v-tooltip>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import utility from '@/utility.js'
import SigningTooltip from '@/components/Shared/SigningTooltip'
export default {
  name: 'SigningBlock',
  components: {
    'signing-tooltip': SigningTooltip
  },
  props: {
    employee: {
      type: Object
    },
    record: {
      type: Object
    }
  },
  data() {
    return {
      sameAsCurrentUser:
        this.$cookie.get('loginuser') ===
        this.employee.username.toLocaleLowerCase()
    }
  },
  methods: {
    signLeave: function(eid, rid, pass) {
      this.$emit('sign', eid, rid, pass)
    },
    generateSummary: utility.generateSummary
  }
}
</script>

<style>
.sign-btn {
  justify-content: center !important;
}
</style>
