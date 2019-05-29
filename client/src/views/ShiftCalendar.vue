<template>
  <page-container
    :title="loalocale.self.title"
    icon="schedule"
    @notified="(notification) => systemNotification = notification"
  >
    <v-card class="elevation-12">
      <calendar-controller
        :calendarDate="new Date(calendarDate)"
        @prev="$refs.calendar.prev()"
        @next="$refs.calendar.next()"
        @tolastest="(date) => calendarDate = formatDate(date)"
      >
        <v-btn-toggle v-model="selectedEmployee" v-if="!readonly">
          <v-tooltip v-for="employee in employees" :key="employee.username" bottom>
            <v-btn :value="employee" slot="activator">{{employee.username}}</v-btn>
            <employee-info :profile="employee" icon email></employee-info>
          </v-tooltip>
        </v-btn-toggle>
      </calendar-controller>
      <v-card-text>
        <v-sheet>
          <v-calendar
            class="calendar"
            ref="calendar"
            v-model="calendarDate"
            type="month"
            color="primary"
            @click:date="toggleHoliday"
          >
            <template v-slot:day="{ date }">
              <v-divider
                v-if="holidays.includes(date)"
                label
                style="border-top-width:4px;"
                color="red lighten-1"
              ></v-divider>
              <v-btn-toggle v-if="shiftGroups[date] && !readonly">
                <v-chip :color="daypartConf['早'].color" outline label @click="add(date, '早')">早</v-chip>
                <v-chip :color="daypartConf['中'].color" outline label @click="add(date, '中')">中</v-chip>
                <v-chip :color="daypartConf['日'].color" outline label @click="add(date, '日')">日</v-chip>
              </v-btn-toggle>
              <template v-for="(item, index) in shiftGroups[date]">
                <div :key="`${date}_${index}`">
                  <v-chip
                    label
                    style="width:95%;"
                    @click="remove(item.employee._id, item.shift._id)"
                    :color="item.color"
                    text-color="white"
                  >
                    <v-avatar tile>{{item.shift.daypart}}</v-avatar>
                    {{item.employee.username}}
                  </v-chip>
                </div>
              </template>
            </template>
          </v-calendar>
        </v-sheet>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-title primary-title>
        <h3 class="headline">時間段說明</h3>
      </v-card-title>
      <v-card-text>
        <shift-config
          :readonly="readonly"
          @notified="(notification) => systemNotification = notification"
        ></shift-config>
      </v-card-text>
    </v-card>
    <system-notification v-model="systemNotification" @close="systemNotification.visible = false">
      <div>{{systemNotification.text}}</div>
    </system-notification>
  </page-container>
</template>
<script>
import PageContainer from "@/components/PageContainer";
import SystemNotification from "@/components/SystemNotification";
import CalendarController from "@/components/CalendarController";
import EmployeeInfo from "@/components/EmployeeInfo";
import ShiftConfig from "@/components/ShiftConfig";
import EmployeeService from "@/services/EmployeeService";
import utility from "@/utility";
import defaultConf from "@/default";
export default {
  name: "ShiftCalendar",
  components: {
    "page-container": PageContainer,
    "system-notification": SystemNotification,
    "calendar-controller": CalendarController,
    "employee-info": EmployeeInfo,
    "shift-config": ShiftConfig
  },
  data() {
    return {
      calendarDate: utility.formatDate("now"),
      systemNotification: {
        level: "warning",
        text: "",
        visible: false,
        handler: () => {}
      },
      selectedEmployee: "",
      employees: [],
      daypartConf: defaultConf.shiftDaypart,
      holidays: []
    };
  },
  computed: {
    readonly() {
      return (
        (this.loginuser.level !== "manager" &&
          this.loginuser.level !== "admin") ||
        this.expired
      );
    },
    shiftGroups() {
      const lastDate = new Date(
        this.calendarDateYear,
        this.calendarDateMonth,
        0
      );
      const lastDateNumber = lastDate.getDate();
      const map = {};
      Array.apply(null, { length: lastDateNumber })
        .map(
          (value, index) =>
            new Date(
              this.calendarDateYear,
              this.calendarDateMonth - 1,
              index + 1
            )
        )
        .filter(date => {
          const weekday = date.getDay();
          return weekday !== 0 && weekday !== 6;
        })
        .forEach(date => {
          const dateStr = utility.formatDate(date);
          map[dateStr] = [];
        });
      this.employees.forEach(employee => {
        employee.shifts.forEach(shift => {
          const dateStr = utility.formatDate(shift.date);
          (map[dateStr] = map[dateStr] || []).push({
            shift,
            employee,
            color: defaultConf.shiftDaypart[shift.daypart].color
          });
        });
      });
      Object.keys(map).forEach(
        key =>
          (map[key] = map[key].sort((a, b) => {
            const aDaypart = a.shift.daypart;
            const bDaypart = b.shift.daypart;
            if (aDaypart === bDaypart) {
              return 0;
            } else if (
              (aDaypart === "早" && (bDaypart === "中" || bDaypart === "日")) ||
              (aDaypart === "中" && bDaypart === "日")
            ) {
              return -1;
            } else if (
              (aDaypart === "中" && bDaypart === "早") ||
              (aDaypart === "日" && (bDaypart === "早" || bDaypart === "中"))
            ) {
              return 1;
            }
          }))
      );
      return map;
    },
    expired() {
      const currentDateObj = new Date();
      const currentDateMonth = currentDateObj.getMonth() + 1;
      const currentDateYear = currentDateObj.getFullYear();
      return (
        this.calendarDateMonth < currentDateMonth ||
        this.calendarDateYear < currentDateYear
      );
    },
    calendarDateObj() {
      return new Date(this.calendarDate);
    },
    calendarDateYear() {
      return this.calendarDateObj.getFullYear();
    },
    calendarDateMonth() {
      return this.calendarDateObj.getMonth() + 1;
    }
  },
  async mounted() {
    this.getShiftConfig();
    this.getShifts();
  },
  methods: {
    async getShiftConfig() {
      const {
        data: { holidays }
      } = await EmployeeService.getShiftConfig({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        type: "holiday"
      });
      this.holidays = holidays;
    },
    async getShifts(initDefault = true) {
      const {
        data: { fullControl, employees }
      } = await EmployeeService.getShifts({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        year: this.calendarDateYear,
        month: this.calendarDateMonth
      });
      this.fullControl = fullControl;
      this.employees = employees;
      if (initDefault) {
        this.selectedEmployee = employees.length > 0 ? employees[0] : undefined;
      }
    },
    async add(date, daypart) {
      if (!this.readonly) {
        const {
          data: { success, message }
        } = await EmployeeService.updateShift({
          loginuser: this.loginuser.username,
          token: this.loginuser.token,
          id: this.selectedEmployee._id,
          shift: {
            date: date,
            daypart: daypart
          }
        });
        if (success) {
          this.getShifts(false);
        } else {
          this.systemNotification.level = "warning";
          this.systemNotification.text = utility.lookUpCustomMessage(message);
          this.systemNotification.visible = true;
        }
      }
    },
    async remove(employeeId, shiftId) {
      if (!this.readonly) {
        const {
          data: { success, message }
        } = await EmployeeService.updateShift({
          loginuser: this.loginuser.username,
          token: this.loginuser.token,
          id: employeeId,
          shiftId: shiftId
        });
        if (success) {
          this.getShifts(false);
        } else {
          this.systemNotification.level = "warning";
          this.systemNotification.text = utility.lookUpCustomMessage(message);
          this.systemNotification.visible = true;
        }
      }
    },
    async toggleHoliday(dateObj) {
      if (this.holidays.includes(dateObj.date)) {
        this.holidays = this.holidays.filter(date => dateObj.date !== date);
      } else {
        this.holidays.push(dateObj.date);
      }
      const {
        data: { success, message }
      } = await EmployeeService.updateShiftConfig({
        type: "holiday",
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        config: {
          holidays: this.holidays
        }
      });
      if (success) {
      } else {
        this.systemNotification.level = "warning";
        this.systemNotification.text = utility.lookUpCustomMessage(message);
        this.systemNotification.visible = true;
      }
    },
    formatDate: utility.formatDate
  },
  watch: {
    calendarDate() {
      this.getShifts();
    }
  }
};
</script>
<style>
</style>
