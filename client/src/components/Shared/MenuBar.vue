<template>
  <v-toolbar flat class="theme">
    <v-tooltip bottom>
      <v-toolbar-title slot="activator">
        <v-icon color="white">{{icon}}</v-icon>
        {{title}}
      </v-toolbar-title>
      <slot></slot>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-toolbar-title>
      <v-tooltip bottom>
        <v-btn slot="activator" icon ripple color="white" @click="$router.push({ name: 'List' })">
          <v-icon>view_list</v-icon>
        </v-btn>
        <div>{{localeConf.self.tooltip.list}}</div>
      </v-tooltip>
    </v-toolbar-title>
    <v-toolbar-title>
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          icon
          ripple
          color="white"
          @click="$router.push({ name: 'CompensatoryList' })"
        >
          <v-icon>event_note</v-icon>
        </v-btn>
        <div>{{localeConf.self.tooltip.compensatoryList}}</div>
      </v-tooltip>
    </v-toolbar-title>
    <v-toolbar-title>
      <v-tooltip bottom>
        <v-dialog slot="activator" ref="dialog" v-model="dialog" lazy full-width width="230px">
          <v-btn slot="activator" icon ripple color="white">
            <v-icon>view_quilt</v-icon>
          </v-btn>
          <v-card>
            <v-card-title class="theme">
              <span class="headline">{{localeConf.self.title.chooseReportType}}</span>
            </v-card-title>
            <v-card-actions>
              <v-btn
                class="theme"
                flat
                @click="toReportPage('annual')"
              >{{localeConf.self.btn.annualType}}</v-btn>
              <v-btn
                class="theme"
                flat
                @click="toReportPage('monthly')"
              >{{localeConf.self.btn.monthlyType}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div>{{localeConf.self.tooltip.report}}</div>
      </v-tooltip>
    </v-toolbar-title>
    <v-toolbar-title v-if="enabled.export">
      <v-tooltip bottom>
        <v-btn icon ripple color="white" @click="exportExcel" slot="activator">
          <v-icon>cloud_download</v-icon>
        </v-btn>
        <div>{{localeConf.self.tooltip.export}}</div>
      </v-tooltip>
    </v-toolbar-title>
    <v-toolbar-title>
      <v-tooltip bottom>
        <v-btn icon ripple color="white" @click="logout($cookie, $router)" slot="activator">
          <v-icon>power_settings_new</v-icon>
        </v-btn>
        <div>{{localeConf.self.tooltip.logout}}</div>
        <div>({{localeConf.self.tooltip.currentUser}}: {{$cookie.get('loginuser')}})</div>
      </v-tooltip>
    </v-toolbar-title>
  </v-toolbar>
</template>

<script>
import utility from "@/utility.js";
export default {
  name: "MenuBar",
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    enabled: {
      type: Object,
      default: function() {
        return {
          export: false
        };
      }
    }
  },
  data() {
    return {
      dialog: false,
      yearOfReport: new Date().getFullYear(),
      monthOfReport: new Date().getMonth() + 1
    };
  },
  methods: {
    logout: (cookie, router) => utility.logout(cookie, router),
    toReportPage(type) {
      if (type === "annual") {
        this.$router.push({ name: "AnnualReport" });
      } else if (type === "monthly") {
        this.$router.push({
          name: "MonthlyReport"
        });
      }
      this.dialog = false;
    },
    exportExcel: () =>
      utility.exportExcel(document.querySelector("table").outerHTML)
  }
};
</script>

<style>
</style>
