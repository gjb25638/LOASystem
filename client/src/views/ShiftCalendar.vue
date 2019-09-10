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
        <v-chip v-if="access.message" label outline>{{access.message}}</v-chip>
        <v-btn @click="download">
          <v-icon>get_app</v-icon>
          {{loalocale.self.download}}
        </v-btn>
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
          >
            <template v-slot:day="{ date }">
              <div style="font-size:10px">{{getHolidayTitle(date)}}</div>
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
                    <v-icon class="primary-shifter" v-if="showPrimary(shiftGroups[date], item)">star_border</v-icon>
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
        this.access.expired
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
    access() {
      const currentDateObj = new Date();
      const currentDate = currentDateObj.getDate();
      const currentDateMonth = currentDateObj.getMonth() + 1;
      const currentDateYear = currentDateObj.getFullYear();
      if (
        this.calendarDateMonth < currentDateMonth ||
        this.calendarDateYear < currentDateYear
      ) {
        return {
          expired: true,
          message: this.loalocale.self.expired
        };
      } else {
        const workdaysBeforeCurrentMonthEnds = 2;
        if (
          this.calendarDateMonth === currentDateMonth &&
          this.calendarDateYear === currentDateYear
        ) {
          const expiredDateCandidates = Array.apply(null, { length: 7 })
            .map(
              (value, index) =>
                new Date(currentDateYear, currentDateMonth, 0 - index)
            )
            .filter(date => date.getDay() !== 6 && date.getDay() !== 0);
          const expiredDate =
            expiredDateCandidates[workdaysBeforeCurrentMonthEnds - 1];
          return {
            expired: currentDate >= expiredDate.getDate(),
            message: `${this.loalocale.self.expiredAt}: ${utility.formatDate(
              expiredDate
            )}`
          };
        } else {
          return {
            expired: false,
            message: `${
              this.loalocale.self.expiredAt
            }: ${this.loalocale.self.workdaysBeforeCurrentMonthEnds.replace(
              "{0}",
              workdaysBeforeCurrentMonthEnds
            )}`
          };
        }
      }
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
    this.getHoliday();
    this.getShifts();
  },
  methods: {
    showPrimary(items, item) {
      const filteredItems = items.filter(
        x => x.shift.daypart === item.shift.daypart
      );
      return filteredItems.length > 1 && item.shift.primary;
    },
    download() {
      const url = EmployeeService.downloadURL.exportShift({
        year: this.calendarDateYear,
        month: this.calendarDateMonth,
        loginuser: this.loginuser.username,
        token: this.loginuser.token
      });
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style = "display:none";
      document.body.appendChild(iframe);
    },
    async getHoliday() {
      const { data: { holidays } } = await EmployeeService.getHoliday({
        loginuser: this.loginuser.username,
        token: this.loginuser.token,
        year: this.calendarDateYear,
        month: this.calendarDateMonth
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
      this.employees = this.filter(employees);
      if (initDefault) {
        this.selectedEmployee =
          this.employees.length > 0 ? this.employees[0] : undefined;
      }
    },
    filter(employees) {
      return employees.filter(e => defaultConf.shiftDepts.includes(e.dept));
    },
    async add(date, daypart) {
      if (!this.readonly) {
        const primary = !this.alreadyHaveShifter(date, daypart);
        const {
          data: { success, message }
        } = await EmployeeService.updateShift({
          loginuser: this.loginuser.username,
          token: this.loginuser.token,
          id: this.selectedEmployee._id,
          shift: {
            date,
            daypart,
            primary
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
    alreadyHaveShifter(date, daypart) {
      return Object.keys(this.shiftGroups).some(
        dateStr =>
          dateStr === date &&
          this.shiftGroups[dateStr] &&
          this.shiftGroups[dateStr].length > 0 &&
          this.shiftGroups[dateStr].some(item => item.shift.daypart === daypart)
      );
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
    getHolidayTitle(date) {
      if (this.holidays.length > 0) {
        const dateObj = new Date(date);
        const holiday = this.holidays.find(
          h => new Date(h.date).toDateString() === dateObj.toDateString()
        );
        return holiday ? holiday.title : "";
      } else {
        return "";
      }
    },
    formatDate: utility.formatDate
  },
  watch: {
    calendarDate() {
      this.getHoliday();
      this.getShifts();
    }
  }
};
</script>
<style>
.primary-shifter {
  position: absolute;
  right: 10px;
}
</style>
