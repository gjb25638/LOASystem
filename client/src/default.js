import localeConf from '@/localization/index'
export default {
    compensatory: {
        keyword: '補休'
    },
    cookie: {
        expiredPeriod: {
            oneYear: '1Y',
            oneMonth: '1M',
            oneDay: '1D',
            oneWeek: 7,
            oneHour: '1h'
        }
    },
    deptOptions: ['行政部(A)', '管理部(A)', '客服部(C)', '資訊部(I)', '技術支援(S)', '業務部(B)'],
    levelOptions: ['admin', 'manager', 'normal'],
    customLeaveType: {
        index: 0,
        enabled: false,
        default: false,
        icon: 'event',
        class: ['brown', 'darken-1', 'white--text'],
        name: '',
        title: '',
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
    leaveTypes: [
        {
            index: 0,
            enabled: false,
            icon: 'hotel',
            class: ['amber', 'white--text'],
            name: 'sick',
            title: localeConf.shared.dateTypes.sick,
            consumes: {
                days: 0,
                hours: 0,
            },
            totals: {
                days: 30,
                hours: 0
            },
            deadline: '',
            dialog: false,
            datepicker: false,
            countdown: false,
            halfHoursEnabled: true,
            default: true,
        },
        {
            index: 1,
            enabled: false,
            icon: 'local_hospital',
            class: ['deep-orange', 'white--text'],
            name: 'familyCare',
            title: `${localeConf.shared.dateTypes.familyCare}(${localeConf.shared.dateTypes.personal})`,
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
            halfHoursEnabled: false,
            default: true,
        },
        {
            index: 2,
            enabled: false,
            icon: 'announcement',
            class: ['deep-orange', 'white--text'],
            name: 'personal',
            title: localeConf.shared.dateTypes.personal,
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
            halfHoursEnabled: true,
            default: true,
        },
        {
            index: 3,
            enabled: false,
            icon: 'local_airport',
            class: ['light-blue', 'white--text'],
            name: 'annual',
            title: localeConf.shared.dateTypes.annual,
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
            halfHoursEnabled: false,
            default: true,
        },
        {
            index: 4,
            enabled: false,
            icon: 'favorite',
            class: ['pink', 'lighten-3', 'white--text'],
            name: 'menstrual',
            title: localeConf.shared.dateTypes.menstrual,
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
            halfHoursEnabled: false,
            default: true,
        },
        {
            index: 5,
            enabled: false,
            icon: 'pregnant_woman',
            class: ['pink', 'lighten-3', 'white--text'],
            name: 'preManternity',
            title: localeConf.shared.dateTypes.preManternity,
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
            halfHoursEnabled: true,
            default: true,
        },
        {
            index: 6,
            enabled: false,
            icon: 'airline_seat_flat_angled',
            class: ['pink', 'lighten-3', 'white--text'],
            name: 'manternityMiscarriage',
            title: localeConf.shared.dateTypes.manternityMiscarriage,
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
            halfHoursEnabled: false,
            default: true,
        },
        {
            index: 7,
            enabled: false,
            icon: 'people_outline',
            class: ['pink', 'lighten-3', 'white--text'],
            name: 'accompanyingManternity',
            title: localeConf.shared.dateTypes.accompanyingManternity,
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
            halfHoursEnabled: false,
            default: true,
        },
        {
            index: 8,
            enabled: false,
            icon: 'wc',
            class: ['red', 'accent-3', 'white--text'],
            name: 'marriage',
            title: localeConf.shared.dateTypes.marriage,
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
            halfHoursEnabled: false,
            default: true,
        },
        {
            index: 9,
            enabled: false,
            icon: 'hourglass_empty',
            class: ['blue-grey', 'white--text'],
            name: 'funeral',
            title: localeConf.shared.dateTypes.funeral,
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
            halfHoursEnabled: false,
            default: true,
        },
        {
            index: 10,
            enabled: false,
            icon: 'directions_run',
            class: ['theme', 'white--text'],
            name: 'businessTrip',
            title: localeConf.shared.dateTypes.businessTrip,
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
            halfHoursEnabled: true,
            default: true,
        },
        {
            index: 11,
            enabled: false,
            icon: 'local_airport',
            class: ['light-blue', 'lighten-4', 'white--text'],
            name: 'annualPreRequest',
            title: localeConf.shared.dateTypes.annualPreRequest,
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
            halfHoursEnabled: false,
            default: true,
        },
    ]
}