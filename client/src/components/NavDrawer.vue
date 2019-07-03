<template>
  <div>
    <v-navigation-drawer :mini-variant="mini" fixed app right>
      <v-card>
        <v-img
          class="white--text"
          height="200px"
          :src="`${config.API_URL}/avatar/${loginuser.username}`"
        >
          <v-btn class="nav-expander" icon @click.stop="mini = !mini">
            <v-icon>{{mini ? "chevron_left" : "chevron_right"}}</v-icon>
          </v-btn>
        </v-img>
        <v-card-title v-if="!mini">
          <employee-info :profile="loginuser" small icon></employee-info>
          <employee-account-settings
            :account="account"
            @reset:email="resetEmail"
            @reset:password="resetPWD"
          ></employee-account-settings>
        </v-card-title>
      </v-card>
      <v-list dense>
        <template v-for="(submenu, i) in menu">
          <template v-for="(item, j) in submenu.list">
            <v-subheader :key="`header_${i}_${j}`" v-if="item.header">{{item.title}}</v-subheader>
            <v-list-tile
              :key="`list-tile_${i}_${j}`"
              v-else
              @click="item.action"
              :class="{active: item.title === title}"
            >
              <v-tooltip left>
                <v-list-tile-action slot="activator">
                  <v-icon>{{item.icon}}</v-icon>
                </v-list-tile-action>
                {{item.title}}
              </v-tooltip>
              <v-list-tile-content>
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="theme" dark fixed app height="40">
      <v-toolbar-title>
        <v-tooltip bottom>
          <v-toolbar-title slot="activator">
            <v-icon color="white">{{icon}}</v-icon>
            {{title}}
          </v-toolbar-title>
          <slot></slot>
        </v-tooltip>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="loginuser.level === 'admin'">
        <database-management @dbbackup="dbbackup" @dbrestore="dbrestore"></database-management>
      </v-toolbar-title>
      <v-toolbar-title>
        <v-tooltip bottom>
          <v-btn slot="activator" icon @click="logout($cookie, $router)">
            <v-icon color="white">power_settings_new</v-icon>
          </v-btn>
          {{loalocale.self.logout}}
        </v-tooltip>
      </v-toolbar-title>
    </v-toolbar>
  </div>
</template>
<script>
import EmployeeInfo from "@/components/EmployeeInfo";
import EmployeeAccountSettings from "@/components/EmployeeAccountSettings";
import DatabaseManagement from "@/components/DatabaseManagement";
import config from "@/services/config";
import utility from "@/utility";
export default {
  name: "NavDrawer",
  components: {
    "employee-info": EmployeeInfo,
    "employee-account-settings": EmployeeAccountSettings,
    "database-management": DatabaseManagement
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
  data: () => ({
    mini: true,
    dialog: false,
    config,
    menu: [],
    account: {
      password: "",
      email: "",
      id: ""
    }
  }),
  mounted() {
    this.account.email = this.loginuser.email;
    this.account.id = this.loginuser._id;
    this.menu = [
      {
        list: [
          {
            title: this.loalocale.self.common,
            header: true
          },
          {
            title: this.loalocale.self.leaveCalendar,
            icon: "event_note",
            action: () => this.$router.push({ name: "LeaveCalendar" })
          },
          {
            title: this.loalocale.self.employees,
            icon: "view_list",
            action: () => this.$router.push({ name: "List" })
          },
          {
            title: this.loalocale.self.compensatory,
            icon: "event_available",
            action: () => this.$router.push({ name: "CompensatoryList" })
          },
          {
            title: this.loalocale.self.report,
            header: true
          },
          {
            title: this.loalocale.self.annualReport,
            icon: "view_quilt",
            action: () => this.$router.push({ name: "AnnualReport" })
          },
          {
            title: this.loalocale.self.monthlyReport,
            icon: "view_quilt",
            action: () => this.$router.push({ name: "MonthlyReport" })
          },
          {
            title: this.loalocale.self.others,
            header: true
          },
          {
            title: this.loalocale.self.shiftCalendar,
            icon: "schedule",
            action: () => this.$router.push({ name: "ShiftCalendar" })
          }
        ]
      }
    ];
  },
  methods: {
    logout: (cookie, router) => {
      cookie.delete("loasystem.loginuser");
      router.push({ name: "Login" });
    },
    resetPWD(success, message) {
      this.$emit("notified", {
        text: utility.lookUpCustomMessage(message, this.loalocale.self.message),
        level: success ? "info" : "warning",
        visible: true,
        handler: ($router, $cookie) => {
          if (success) {
            this.logout($cookie, $router);
          }
        }
      });
    },
    resetEmail(success, message) {
      this.$emit("notified", {
        text: utility.lookUpCustomMessage(message, this.loalocale.self.message),
        level: success ? "info" : "warning",
        visible: true
      });
    },
    dbbackup(success, message) {},
    dbrestore(success, message) {
      this.$emit("notified", {
        text: utility.lookUpCustomMessage(message, this.loalocale.self.message),
        level: success ? "info" : "warning",
        visible: true,
        handler: ($router, $cookie) => {
          if (success) {
            this.logout($cookie, $router);
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.active {
  background: rgba(0, 0, 0, 0.04);
}
.nav-expander,
.nav-expander::before {
  border-radius: 0;
  width: 20px;
  background: #faf05e91;
}
</style>
