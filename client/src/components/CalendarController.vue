<template>
  <v-card-title>
    <slot></slot>
    <v-spacer></v-spacer>
    <div class="controller">
      <v-btn icon flat @click="toPrev">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      {{ year }}{{ annual ? '' : `/${month + 1}` }}
      <v-btn icon flat @click="toNext">
        <v-icon>keyboard_arrow_right</v-icon>
      </v-btn>
      <v-btn icon flat @click="toLastest">
        <v-icon>last_page</v-icon>
      </v-btn>
    </div>
  </v-card-title>
</template>
<script>
export default {
  name: "CalendarController",
  props: {
    calendarDate: {
      type: Date,
      default: () => new Date()
    },
    annual: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({}),
  computed: {
    year() {
      return this.calendarDate.getFullYear();
    },
    month() {
      return this.calendarDate.getMonth();
    },
    date() {
      return this.calendarDate.getDate();
    }
  },
  methods: {
    toPrev() {
      const newDate = this.annual
        ? new Date(this.year - 1, this.month, this.date)
        : new Date(this.year, this.month - 1, this.date);
      this.$emit("prev", newDate);
    },
    toNext() {
      const newDate = this.annual
        ? new Date(this.year + 1, this.month, this.date)
        : new Date(this.year, this.month + 1, this.date);
      this.$emit("next", newDate);
    },
    toLastest() {
      const today = new Date();
      this.$emit("tolastest", today);
    }
  }
};
</script>
<style scoped>
</style>
