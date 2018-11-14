var depts = {
    A1: '行政部(A)',
    A2: '管理部(A)',
    C: '客服部(C)',
    I: '資訊部(I)',
}

var levels = {
    admin: 'admin',
    manager: 'manager',
    normal: 'normal'
}

var dateTypes = {
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

var dateTypeGroup = {
    generalMale: [dateTypes.sick, dateTypes.personal, dateTypes.annual],
    generalFemale: [dateTypes.sick, dateTypes.personal, dateTypes.menstrual, dateTypes.annual]
}

module.exports = [{
    employeeID: 'A2001',
    dept: depts.A2,
    level: levels.manager,
    name: 'Alice',
    username: 'Alice',
    arrivedDate: '2015-03-03',
    signers: [],
    activatedDateTypes: dateTypeGroup.generalFemale
}, {
    employeeID: 'A1001',
    dept: depts.A1,
    level: levels.manager,
    name: 'Bob',
    username: 'Bob',
    arrivedDate: '2016-01-17',
    signers: ['Alice'],
    activatedDateTypes: dateTypeGroup.generalMale
}, {
    employeeID: 'A1002',
    dept: depts.A1,
    level: levels.normal,
    name: 'Charlie',
    username: 'Charlie',
    arrivedDate: '2017-05-09',
    signers: ['Alice', 'Bob'],
    activatedDateTypes: dateTypeGroup.generalMale
}, {
    employeeID: 'C0001',
    dept: depts.C,
    level: levels.manager,
    name: 'Dara',
    username: 'Dara',
    arrivedDate: '2016-02-24',
    signers: ['Alice'],
    activatedDateTypes: dateTypeGroup.generalFemale
}, {
    employeeID: 'C0002',
    dept: depts.C,
    level: levels.normal,
    name: 'Ella',
    username: 'Ella',
    arrivedDate: '2017-07-05',
    signers: ['Alice', 'Dara'],
    activatedDateTypes: dateTypeGroup.generalFemale
}, {
    employeeID: 'I0001',
    dept: depts.I,
    level: levels.manager,
    name: 'Frosen',
    username: 'Frosen',
    arrivedDate: '2016-06-09',
    signers: ['Alice'],
    activatedDateTypes: dateTypeGroup.generalMale
}, {
    employeeID: 'I0002',
    dept: depts.I,
    level: levels.normal,
    name: 'Gary',
    username: 'Gary',
    arrivedDate: '2017-08-15',
    signers: ['Alice', 'Forsen'],
    activatedDateTypes: dateTypeGroup.generalMale
}];


/**
 * Alice(A2)
 *          Bob(A1)
 *                    Charlie(A1)
 *          Dara(C)
 *                    Ella(C)
 *          Frosen(I)
 *                    Gary(I)
 */