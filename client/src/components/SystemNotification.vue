<template>
  <v-snackbar
    v-model="value.visible"
    :color="value.level"
    multi-line
    vertical
    right
    top
    :timeout="0"
    auto-height
  >
    <div>
      <h1 style="font-size: 25px">
        <v-icon large>{{iconType}}</v-icon>
        {{value.title ? value.title : loalocale.shared.title.systemNotification}}
      </h1>
      <slot></slot>
    </div>
    <v-btn flat @click="close(value.keyword)">{{loalocale.self.btn.iGotIt}}</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "SystemNotification",
  props: {
    value: {
      type: Object
    }
  },
  created() {},
  computed: {
    iconType() {
      return {
        info: "info",
        success: "verified_user",
        warning: "warning",
        error: "error_outline"
      }[this.level];
    }
  },
  data: () => ({
    snackbar: false
  }),
  methods: {
    close(value) {
      if (this.value.handler) {
        this.value.handler(this.$router, this.$cookie);
      }
      this.$emit("close", value);
    }
  }
};
</script>

<style scoped>
button {
  opacity: 0.6;
}
button:hover {
  opacity: 1;
}
</style>
