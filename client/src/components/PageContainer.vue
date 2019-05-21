<template>
  <v-app id="inspire">
    <nav-drawer :title="title" :icon="icon" @notified="notified">
      <slot name="tooltip"></slot>
    </nav-drawer>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex xs12>
            <slot></slot>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import NavDrawer from "@/components/NavDrawer";

export default {
  name: "PageContainer",
  components: {
    "nav-drawer": NavDrawer
  },
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  data: () => ({}),
  methods: {
    notified(notification) {
      this.$emit("notified", notification);
    }
  }
};
</script>
<style>
</style>
