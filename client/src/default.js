import localeConf from './locale.js'
export default {
  cookie: {
    expiredPeriod: {
      oneYear: '1Y',
      oneMonth: '1M',
      oneDay: '1D',
      oneWeek: 7,
      oneHour: '1h'
    }
  },
  deptOptions: ['行政部(A)', '管理部(A)', '客服部(C)', '資訊部(I)'],
  customDateType: {
    index: 0,
    enabled: false,
    isCustomizedType: true,
    icon: 'event',
    class: ['brown', 'darken-1', 'white--text'],
    name: '',
    title: '',
    detail: '',
    consumes: {
      days: 0,
      hours: 0
    },
    totals: {
      days: 0,
      hours: 0
    },
    deadline: '',
    dialog: false,
    datepicker: false,
    countdown: true,
    halfHoursEnabled: true
  },
  dateTypes: [
    {
      index: 0,
      enabled: false,
      icon: 'hotel',
      class: ['amber', 'white--text'],
      name: 'sick',
      title: localeConf.detail.dateTypes.sick,
      detail: localeConf.detail.dateTypeDetails.sick,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 30,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: false,
      halfHoursEnabled: true
    },
    {
      index: 1,
      enabled: false,
      icon: 'local_hospital',
      class: ['amber', 'white--text'],
      name: 'familyCare',
      title: localeConf.detail.dateTypes.familyCare,
      detail: localeConf.detail.dateTypeDetails.familyCare,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 7,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: false,
      halfHoursEnabled: false
    },
    {
      index: 2,
      enabled: false,
      icon: 'announcement',
      class: ['deep-orange', 'white--text'],
      name: 'personal',
      title: localeConf.detail.dateTypes.personal,
      detail: localeConf.detail.dateTypeDetails.personal,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 14,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: false,
      halfHoursEnabled: true
    },
    {
      index: 3,
      enabled: false,
      icon: 'local_airport',
      class: ['light-blue', 'white--text'],
      name: 'annual',
      title: localeConf.detail.dateTypes.annual,
      detail: localeConf.detail.dateTypeDetails.annual,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 10,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false
    },
    {
      index: 4,
      enabled: false,
      icon: 'favorite',
      class: ['pink', 'lighten-3', 'white--text'],
      name: 'menstrual',
      title: localeConf.detail.dateTypes.menstrual,
      detail: localeConf.detail.dateTypeDetails.menstrual,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 1,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false
    },
    {
      index: 5,
      enabled: false,
      icon: 'pregnant_woman',
      class: ['pink', 'lighten-3', 'white--text'],
      name: 'preManternity',
      title: localeConf.detail.dateTypes.preManternity,
      detail: localeConf.detail.dateTypeDetails.preManternity,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 5,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: true
    },
    {
      index: 6,
      enabled: false,
      icon: 'airline_seat_flat_angled',
      class: ['pink', 'lighten-3', 'white--text'],
      name: 'manternityMiscarriage',
      title: localeConf.detail.dateTypes.manternityMiscarriage,
      detail: localeConf.detail.dateTypeDetails.manternityMiscarriage,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 5,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false
    },
    {
      index: 7,
      enabled: false,
      icon: 'people_outline',
      class: ['pink', 'lighten-3', 'white--text'],
      name: 'accompanyingManternity',
      title: localeConf.detail.dateTypes.accompanyingManternity,
      detail: localeConf.detail.dateTypeDetails.accompanyingManternity,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 5,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false
    },
    {
      index: 8,
      enabled: false,
      icon: 'wc',
      class: ['red', 'accent-3', 'white--text'],
      name: 'marriage',
      title: localeConf.detail.dateTypes.marriage,
      detail: localeConf.detail.dateTypeDetails.marriage,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 8,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false
    },
    {
      index: 9,
      enabled: false,
      icon: 'hourglass_empty',
      class: ['blue-grey', 'white--text'],
      name: 'funeral',
      title: localeConf.detail.dateTypes.funeral,
      detail: localeConf.detail.dateTypeDetails.funeral,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 3,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: true,
      halfHoursEnabled: false
    },
    {
      index: 10,
      enabled: false,
      icon: 'directions_run',
      class: ['theme', 'white--text'],
      name: 'businessTrip',
      title: localeConf.detail.dateTypes.businessTrip,
      detail: localeConf.detail.dateTypeDetails.businessTrip,
      consumes: {
        days: 0,
        hours: 0
      },
      totals: {
        days: 20,
        hours: 0
      },
      deadline: '',
      dialog: false,
      datepicker: false,
      countdown: false,
      halfHoursEnabled: true
    }
  ]
}
