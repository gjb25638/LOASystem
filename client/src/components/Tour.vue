<template>
  <div>
    <v-btn bottom right icon @click="tour">
      <v-icon color="blue-grey">info</v-icon>
    </v-btn>
    <v-tour name="tour" :steps="steps" :options="options"></v-tour>
  </div>
</template>
<script>
export default {
  name: "Tour",
  props: {
    steps: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    options: {
      useKeyboardNavigation: false,
      labels: {
        buttonSkip: "",
        buttonPrevious: "",
        buttonNext: "",
        buttonStop: ""
      }
    }
  }),
  mounted() {
    this.options.labels = {
      buttonSkip: this.loalocale.self.skip,
      buttonPrevious: this.loalocale.self.previous,
      buttonNext: this.loalocale.self.next,
      buttonStop: this.loalocale.self.finish
    };
  },
  methods: {
    tour() {
      this.$tours["tour"].start();
    }
  }
};
</script>
<style scoped>
.v-btn--floating.v-btn--small {
  height: 25px;
  width: 25px;
}
</style>
<style>
.v-tour .v-step {
  z-index: 99;
}
</style>
