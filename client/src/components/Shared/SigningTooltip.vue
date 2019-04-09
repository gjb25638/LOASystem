<template>
  <div>
    <span>
      {{signer.name}}({{signer.username}})
    </span>
    <span v-if="!signingOfTheSigner || signingOfTheSigner.pass === undefined">
      {{localeConf.self.tooltip.notSignYet}}
      <v-icon color="blue">help</v-icon>
    </span>
    <span v-else-if="signingOfTheSigner.pass">
      {{localeConf.self.tooltip.pass}}
      <v-icon color="green">thumb_up</v-icon>
    </span>
    <span v-else>
      {{localeConf.self.tooltip.reject}}
      <v-icon color="red">pan_tool</v-icon>
    </span>
    <div>
      {{localeConf.self.tooltip.signingTime}}
      <span v-if="signingOfTheSigner">
        {{(new Date(signingOfTheSigner.signedDate)).toLocaleString()}}
      </span>
      <span v-else>-</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SigningTooltip',
  props: {
    signer: {
      type: Object
    },
    signings: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  mounted() {
    const filteredSignings = this.signings
      .filter(signing => signing.username === this.signer.username)
      .sort(signing => signing.pass ? 1 : -1)
    if (filteredSignings.length > 0) {
      this.signingOfTheSigner = filteredSignings[0]
    }
  },
  data() {
    return {
      signingOfTheSigner: undefined
    }
  },
  methods: {
    signLeave: function(eid, rid, pass) {
      this.$emit('sign', eid, rid, pass)
    }
  }
}
</script>

<style>
</style>
