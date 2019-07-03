import locale from "@/localization/index";
export default {
  compensatory: {
    keyword: "補休"
  },
  cookie: {
    expiredPeriod: {
      oneYear: "1Y",
      oneMonth: "1M",
      oneDay: "1D",
      oneWeek: 7,
      oneHour: "1h"
    }
  },
  shiftDaypart: {
    早: {
      color: "amber lighten-3"
    },
    中: {
      color: "blue-grey lighten-1"
    },
    日: {
      color: "teal lighten-3"
    }
  },
  deptOptions: [
    "行政部(A)",
    "管理部(A)",
    "客服部(C)",
    "資訊部(I)",
    "技術支援(S)",
    "業務部(B)"
  ],
  deptsThatSameDeptEmployeeHavingSameReadAccess: ["客服部(C)"],
  shiftDepts: ["客服部(C)"],
  levelOptions: ["admin", "manager", "normal"],
  customLeaveType: {
    index: 0,
    enabled: false,
    default: false,
    icon: "event",
    class: ["teal", "lighten-3", "white--text"],
    color: "#80CBC4",
    name: "",
    title: "",
    consumes: {
      days: 0,
      hours: 0
    },
    totals: {
      days: 1,
      hours: 0
    },
    deadline: new Date().toISOString().substr(0, 10),
    dialog: false,
    datepicker: false,
    countdown: true,
    halfHoursEnabled: true
  },
  leaveTypes: [
    {
      index: 0,
      enabled: true,
      icon: "hotel",
      class: ["amber", "lighten-3", "white--text"],
      color: "#FFE082",
      name: "sick",
      title: locale.shared.leaveTypes.sick,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 30,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: false,
      halfHoursEnabled: true,
      default: true
    },
    {
      index: 1,
      enabled: false,
      icon: "local_hospital",
      class: ["deep-orange", "lighten-3", "white--text"],
      color: "#FFAB91",
      name: "familyCare",
      title: `${locale.shared.leaveTypes.familyCare}(${
        locale.shared.leaveTypes.personal
      })`,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 7,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: false,
      halfHoursEnabled: false,
      default: true
    },
    {
      index: 2,
      enabled: true,
      icon: "announcement",
      class: ["deep-orange", "lighten-3", "white--text"],
      color: "#FFAB91",
      name: "personal",
      title: locale.shared.leaveTypes.personal,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 14,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: false,
      halfHoursEnabled: true,
      default: true
    },
    {
      index: 3,
      enabled: false,
      icon: "local_airport",
      class: ["light-blue", "lighten-2", "white--text"],
      color: "#4FC3F7",
      name: "annual",
      title: locale.shared.leaveTypes.annual,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 10,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false,
      default: true
    },
    {
      index: 4,
      enabled: false,
      icon: "favorite",
      class: ["pink", "lighten-3", "white--text"],
      color: "#F48FB1",
      name: "menstrual",
      title: locale.shared.leaveTypes.menstrual,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 1,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false,
      default: true
    },
    {
      index: 5,
      enabled: false,
      icon: "pregnant_woman",
      class: ["pink", "lighten-3", "white--text"],
      color: "#F48FB1",
      name: "preManternity",
      title: locale.shared.leaveTypes.preManternity,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 5,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: true,
      default: true
    },
    {
      index: 6,
      enabled: false,
      icon: "airline_seat_flat_angled",
      class: ["pink", "lighten-3", "white--text"],
      color: "#F48FB1",
      name: "manternityMiscarriage",
      title: locale.shared.leaveTypes.manternityMiscarriage,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 5,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false,
      default: true
    },
    {
      index: 7,
      enabled: false,
      icon: "people_outline",
      class: ["pink", "lighten-3", "white--text"],
      color: "#F48FB1",
      name: "accompanyingManternity",
      title: locale.shared.leaveTypes.accompanyingManternity,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 5,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false,
      default: true
    },
    {
      index: 8,
      enabled: false,
      icon: "wc",
      class: ["red", "lighten-2", "white--text"],
      color: "#E57373",
      name: "marriage",
      title: locale.shared.leaveTypes.marriage,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 8,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false,
      default: true
    },
    {
      index: 9,
      enabled: false,
      icon: "hourglass_empty",
      class: ["blue-grey", "lighten-3", "white--text"],
      color: "#B0BEC5",
      name: "funeral",
      title: locale.shared.leaveTypes.funeral,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 3,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false,
      default: true
    },
    {
      index: 10,
      enabled: false,
      icon: "directions_run",
      class: ["purple", "lighten-3", "white--text"],
      color: "#CE93D8",
      name: "businessTrip",
      title: locale.shared.leaveTypes.businessTrip,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 20,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: false,
      halfHoursEnabled: true,
      default: true
    },
    {
      index: 11,
      enabled: false,
      icon: "local_airport",
      class: ["light-blue", "lighten-4", "white--text"],
      color: "#B3E5FC",
      name: "annualPreRequest",
      title: locale.shared.leaveTypes.annualPreRequest,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 10,
        hours: 0
      },
      deadline: "",
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false,
      default: true
    }
  ]
};
