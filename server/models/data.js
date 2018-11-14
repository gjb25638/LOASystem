var depts = {
    A: '部門A',
    B: '部門B',
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
    employeeID: 'A01',
    dept: depts.A,
    level: levels.admin,
    name: 'Alice',
    username: 'Alice',
    arrivedDate: '2015-03-03',
    signers: [],
    activatedDateTypes: dateTypeGroup.generalFemale
}, {
    employeeID: 'A02',
    dept: depts.A,
    level: levels.manager,
    name: 'Bob',
    username: 'Bob',
    arrivedDate: '2016-01-17',
    signers: ['Alice'],
    activatedDateTypes: dateTypeGroup.generalMale
}, {
    employeeID: 'A03',
    dept: depts.A,
    level: levels.normal,
    name: 'Charlie',
    username: 'Charlie',
    arrivedDate: '2017-05-09',
    signers: ['Alice', 'Bob'],
    activatedDateTypes: dateTypeGroup.generalMale
}, {
    employeeID: 'B01',
    dept: depts.B,
    level: levels.normal,
    name: 'Dara',
    username: 'Dara',
    arrivedDate: '2016-02-24',
    signers: ['Alice'],
    activatedDateTypes: dateTypeGroup.generalFemale
}];


/**
 * Alice(A2)
 *          Bob(A1)
 *                    Charlie(A1)
 *          Dara(C)
 *                    Ella(C)
 *          Forsen(I)
 *                    Gary(I)
 */
