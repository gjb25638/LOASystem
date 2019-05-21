import locale from '@/localization/index'
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
        color: "#6D4C41",
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
            enabled: true,
            icon: 'hotel',
            class: ['amber', 'white--text'],
            color: "#FFC107",
            name: 'sick',
            title: locale.shared.leaveTypes.sick,
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
            color: "#FF5722",
            name: 'familyCare',
            title: `${locale.shared.leaveTypes.familyCare}(${locale.shared.leaveTypes.personal})`,
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
            enabled: true,
            icon: 'announcement',
            class: ['deep-orange', 'white--text'],
            color: "#FF5722",
            name: 'personal',
            title: locale.shared.leaveTypes.personal,
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
            color: "#03A9F4",
            name: 'annual',
            title: locale.shared.leaveTypes.annual,
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
            color: "#F48FB1",
            name: 'menstrual',
            title: locale.shared.leaveTypes.menstrual,
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
            color: "#F48FB1",
            name: 'preManternity',
            title: locale.shared.leaveTypes.preManternity,
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
            color: "#F48FB1",
            name: 'manternityMiscarriage',
            title: locale.shared.leaveTypes.manternityMiscarriage,
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
            color: "#F48FB1",
            name: 'accompanyingManternity',
            title: locale.shared.leaveTypes.accompanyingManternity,
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
            color: "#FF1744",
            name: 'marriage',
            title: locale.shared.leaveTypes.marriage,
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
            color: "#607D8B",
            name: 'funeral',
            title: locale.shared.leaveTypes.funeral,
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
            class: ['purple', 'accent-2', 'white--text'],
            color: "#E040FB",
            name: 'businessTrip',
            title: locale.shared.leaveTypes.businessTrip,
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
            color: "#B3E5FC",
            name: 'annualPreRequest',
            title: locale.shared.leaveTypes.annualPreRequest,
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