<template>
  <v-progress-circular :rotate="-90" :size="50" :width="3" :value="initial" :color="color">
    <slot></slot>
  </v-progress-circular>
</template>

<script>
export default {
  name: "AnimatedCircular",
  props: {
    value: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: ""
    }
  },
  mounted() {
    setInterval(() => {
      this.initial = this.value;
    }, 0);
  },
  data: () => ({
    initial: 0
  })
};
</script>

<style>
</style>
