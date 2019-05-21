var depts = {
    A1: '行政部(A)',
    A2: '管理部(A)',
    C: '客服部(C)',
    I: '資訊部(I)',
    S: '技術支援(S)'
}

var levels = {
    admin: 'admin',
    manager: 'manager',
    normal: 'normal'
}

var leaveTypes = {
    sick: {
        halfHoursEnabled: true,
        enabled: true,
        name: 'sick',
        totals: {
            days: 30,
            halfHours: 0
        },
        consumes: {
            days: 0,
            halfHours: 0
        },
        deadline: null
    },
    familyCare: {
        halfHoursEnabled: false,
        enabled: true,
        name: 'familyCare',
        totals: {
            days: 7,
            halfHours: 0
        },
        consumes: {
            days: 0,
            halfHours: 0
        },
        deadline: null
    },
    personal: {
        halfHoursEnabled: true,
        enabled: true,
        name: 'personal',
        totals: {
            days: 14,
            halfHours: 0
        },
        consumes: {
            days: 0,
            halfHours: 0
        },
        deadline: null
    },
    annual: {
        halfHoursEnabled: false,
        enabled: true,
        name: 'annual',
        totals: {
            days: 0,
            halfHours: 0
        },
        consumes: {
            days: 0,
            halfHours: 0
        },
        deadline: null
    },
    menstrual: {
        halfHoursEnabled: true,
        enabled: true,
        name: 'menstrual',
        totals: {
            days: 1,
            halfHours: 0
        },
        consumes: {
            days: 0,
            halfHours: 0
        },
        deadline: null
    }
}

var leaveTypeGroup = {
    generalMale: [leaveTypes.sick, leaveTypes.personal, leaveTypes.annual],
    generalFemale: [leaveTypes.sick, leaveTypes.personal, leaveTypes.menstrual, leaveTypes.annual]
}

module.exports = [{
    employeeID: 'A0001',
    dept: depts.A1,
    level: levels.admin,
    name: 'BOSS',
    username: 'Boss',
    arrivedDate: '2016-01-01',
    signers: [],
    activatedLeaveTypes: leaveTypeGroup.generalMale,
    email: 'admin@email.com'
}, {
    employeeID: 'A0002',
    dept: depts.A1,
    level: levels.manager,
    name: 'MANAGER',
    username: 'Manager',
    arrivedDate: '2016-07-01',
    signers: ['Boss'],
    activatedLeaveTypes: leaveTypeGroup.generalFemale,
    email: 'manager@email.com'
}, {
    employeeID: 'A0003',
    dept: depts.A1,
    level: levels.normal,
    name: 'NORMAL',
    username: 'Normal',
    arrivedDate: '2017-01-01',
    signers: ['Boss', 'Manager'],
    activatedLeaveTypes: leaveTypeGroup.generalMale,
    email: 'normal@email.com'
}];