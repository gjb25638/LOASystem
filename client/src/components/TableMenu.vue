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
    <v-toolbar-title v-if="enabled.compensatory">
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          icon
          ripple
          color="white"
          @click="$router.push({ name: 'CompensatoryReport' })"
        >
          <v-icon>event</v-icon>
        </v-btn>
        <div>{{localeConf.report.th.compensatory}}{{localeConf.list.tooltip.report}}</div>
      </v-tooltip>
    </v-toolbar-title>
    <v-toolbar-title v-if="enabled.report && enabled.report.type === 'month'">
      <v-tooltip bottom>
        <v-dialog slot="activator" ref="dialog" v-model="dialog" lazy full-width width="210px">
          <v-btn slot="activator" icon ripple color="white">
            <v-icon>format_list_bulleted</v-icon>
          </v-btn>
          <v-card>
            <v-card-title class="theme">
              <span class="headline">{{localeConf.report.dialog.report}}</span>
            </v-card-title>
            <v-card-text>
              <v-text-field :label="localeConf.report.input.report" v-model="monthOfReport"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="dialog = false">{{localeConf.list.btn.close}}</v-btn>
              <v-btn
                class="theme"
                flat
                @click.native="toReportPage(monthOfReport)"
              >{{localeConf.list.btn.report}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div>{{localeConf.report.tooltip.report}}</div>
      </v-tooltip>
    </v-toolbar-title>
    <v-toolbar-title v-if="enabled.report && enabled.report.type === 'year'">
      <v-tooltip bottom>
        <v-dialog ref="dialog" v-model="dialog" lazy full-width width="210px" slot="activator">
          <v-btn slot="activator" icon ripple color="white">
            <v-icon>format_list_bulleted</v-icon>
          </v-btn>
          <v-card>
            <v-card-title class="theme">
              <span class="headline">{{localeConf.list.dialog.report}}</span>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
              <v-text-field :label="localeConf.list.input.report" v-model="yearOfReport"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="dialog = false">{{localeConf.list.btn.close}}</v-btn>
              <v-btn
                class="theme"
                flat
                @click.native="toReportPage(yearOfReport)"
              >{{localeConf.list.btn.report}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div>{{localeConf.list.tooltip.report}}</div>
      </v-tooltip>
    </v-toolbar-title>
    <v-toolbar-title v-if="enabled.export">
      <v-tooltip bottom>
        <v-btn icon ripple color="white" @click="exportExcel" slot="activator">
          <v-icon>cloud_download</v-icon>
        </v-btn>
        <div>{{localeConf.report.tooltip.export}}</div>
      </v-tooltip>
    </v-toolbar-title>
    <v-toolbar-title>
      <v-tooltip bottom>
        <v-btn icon ripple color="white" @click="logout($cookie, $router)" slot="activator">
          <v-icon>power_settings_new</v-icon>
        </v-btn>
        <div>{{localeConf.list.tooltip.logout}}</div>
        <div>({{localeConf.list.tooltip.loginuser}}: {{$cookie.get('loginuser')}})</div>
      </v-tooltip>
    </v-toolbar-title>
  </v-toolbar>
</template>

<script>
import utility from "@/utility.js";
export default {
  name: "TableMenu",
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
          compensatory: false,
          report: false,
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
    toReportPage(yearOrMonth) {
      if (this.enabled.report.type === "year") {
        const [y] = /^\d{4}$/.exec(yearOrMonth);
        if (y) {
          this.$router.push({ name: "AnnualReport", params: { year: y } });
        }
      } else if (this.enabled.report.type === "month") {
        const [m] = /^\d{1,2}$/.exec(yearOrMonth);
        if (m) {
          this.$router.push({
            name: "MonthlyReport",
            params: { year: this.enabled.report.year, month: m }
          });
        }
      }
    },
    exportExcel: () =>
      utility.exportExcel(document.querySelector("table").outerHTML)
  }
};
</script>

<style>
.theme {
  background: linear-gradient(
    to right,
    rgba(225, 56, 89, 1) 0%,
    rgba(195, 43, 127, 1) 35%,
    rgba(146, 49, 140, 1) 65%,
    rgba(78, 56, 130, 1) 100%
  ) !important;
  color: white !important;
}
</style>
