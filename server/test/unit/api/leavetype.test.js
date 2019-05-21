const lt = require("../../../src/shared/leavetype")
const u = require("../../../src/shared/util")

describe("getAnnualLTTotalDaysBySeniority", () => {
    it('Seniority <= 13 Years', () => {
        expect(lt.getAnnualLTTotalDaysBySeniority(0)).toBe(10)
    })
    it('Seniority > 13 Years', () => {
        expect(lt.getAnnualLTTotalDaysBySeniority(14)).toBe(20)
    })
})
describe("refreshAnnualPreRequestRecords", () => {
    it("", () => {
        const records = [{
            leaveType: "annualPreRequest"
        }, {
            leaveType: "annual"
        }]
        const annualLT = {
            consumes: {
                days: 1
            }
        }
        const annualPreRequestLT = {
            consumes: {
                days: 1
            }
        }
        lt.refreshAnnualPreRequestRecords(records, annualLT, annualPreRequestLT)
        expect(records.map(r => r.leaveType)).toMatchObject(["annual", "annual"])
        expect(annualLT.consumes.days).toBe(1)
        expect(annualPreRequestLT.consumes.days).toBe(0)
    })
})
describe("getAnnualLTTotalDays", () => {
    it('Seniority >= Half Year', () => {
        const arrivedDate = new Date("2018-04-23")
        const specificToday = new Date("2019-05-09")
        expect(lt.getAnnualLTTotalDays(arrivedDate, specificToday)).toMatchObject({
            totalsDaysThisYear: 11,
            totalsDaysNextYear: 12
        })
    })
    it('Seniority < Half Year', () => {
        const arrivedDate = new Date("2019-04-23")
        const specificToday = new Date("2019-05-09")
        expect(lt.getAnnualLTTotalDays(arrivedDate, specificToday)).toMatchObject({
            totalsDaysThisYear: 0,
            totalsDaysNextYear: 10
        })
    })
})
describe("isAnnualLTRefreshable", () => {
    it('Refreshable', () => {
        const arrivedDate = new Date("2018-04-23")
        const deadline = new Date("2019-04-22")
        const specificToday = new Date("2019-04-22")
        expect(lt.isAnnualLTRefreshable(deadline, arrivedDate, specificToday)).toBeTruthy()
    })
    it('Unrefreshable', () => {
        const arrivedDate = new Date("2018-04-23")
        const deadline = new Date("2019-04-22")
        const specificToday = new Date("2019-04-21")
        expect(lt.isAnnualLTRefreshable(deadline, arrivedDate, specificToday)).toBeFalsy()
    })
})
describe("getAnnualLTDeadline", () => {
    it('Seniority >= Half Month && Deadline Should be This Year', () => {
        const arrivedDate = new Date("2018-04-23")
        const specificToday = new Date("2019-04-21")
        const deadline = new Date("2019-04-22")
        expect(u.formatDate(lt.getAnnualLTDeadline(arrivedDate, specificToday))).toMatch(u.formatDate(deadline))
    })
    it('Seniority >= Half Month && Deadline Should be Next Year', () => {
        const arrivedDate = new Date("2018-04-23")
        const specificToday = new Date("2019-04-22")
        const deadline = new Date("2020-04-22")
        expect(u.formatDate(lt.getAnnualLTDeadline(arrivedDate, specificToday))).toMatch(u.formatDate(deadline))
    })
    it('Seniority < Half Month', () => {
        const arrivedDate = new Date("2018-04-23")
        const specificToday = new Date("2018-10-22")
        expect(lt.getAnnualLTDeadline(arrivedDate, specificToday)).toBeUndefined()
    })
})
describe("isRefreshable", () => {
    it("Refreshable with Monthly Refreshed", () => {
        const deadline = new Date("2018-01-31")
        const specificToday = new Date("2018-02-01")
        expect(lt.isRefreshable(deadline, "month", specificToday)).toBeTruthy()
    })
    it("Unrefreshable with Monthly Refreshed", () => {
        const deadline = new Date("2018-01-31")
        const specificToday = new Date("2018-01-30")
        expect(lt.isRefreshable(deadline, "month", specificToday)).toBeFalsy()
    })
    it("Refreshable with Annual Refreshed", () => {
        const deadline = new Date("2018-12-31")
        const specificToday = new Date("2019-01-01")
        expect(lt.isRefreshable(deadline, "year", specificToday)).toBeTruthy()
    })
    it("Unrefreshable with Annual Refreshed", () => {
        const deadline = new Date("2018-12-31")
        const specificToday = new Date("2018-12-30")
        expect(lt.isRefreshable(deadline, "year", specificToday)).toBeFalsy()
    })
})
describe("getLTDeadLine", () => {
    it("Monthly Refreshed && This Month is December", () => {
        const specificToday = new Date("2018-12-01")
        expect(u.formatDate(lt.getLTDeadLine("month", specificToday))).toMatch(u.formatDate(new Date("2018-12-31")))
    })
    it("Monthly Refreshed && This Month isn't December", () => {
        const specificToday = new Date("2018-01-01")
        expect(u.formatDate(lt.getLTDeadLine("month", specificToday))).toMatch(u.formatDate(new Date("2018-01-31")))
    })
    it("Annual Refreshed", () => {
        const specificToday = new Date("2018-01-01")
        expect(u.formatDate(lt.getLTDeadLine("year", specificToday))).toMatch(u.formatDate(new Date("2018-12-31")))
    })
})
describe("refreshBasicLeaveTypes", () => {
    it("Nothing Happened", () => {
        const specificToday = new Date("2018-06-29")
        const monthlyDeadline = new Date("2018-06-30")
        const annualDeadline = new Date("2018-12-31")
        const leaveTypes = [{
            name: "sick",
            deadline: annualDeadline,
            days: 1
        }, {
            name: "familyCare",
            deadline: annualDeadline,
            days: 1
        }, {
            name: "personal",
            deadline: annualDeadline,
            days: 1
        }, {
            name: "menstrual",
            deadline: monthlyDeadline,
            days: 1
        }, {
            name: "businessTrip",
            deadline: monthlyDeadline,
            days: 1
        }]
        const refreshedLeaveTypes = lt.refreshBasicLeaveTypes(lt.leaveTypesGroups, leaveTypes, specificToday)
        expect(refreshedLeaveTypes).toMatchObject([])
        expect(leaveTypes.map(lt => lt.days)).toMatchObject(leaveTypes.map(lt => lt.days))
        expect(leaveTypes.map(lt => u.formatDate(lt.deadline))).toMatchObject([annualDeadline, annualDeadline, annualDeadline, monthlyDeadline, monthlyDeadline].map(date => u.formatDate(date)))
    })
    it("Monthly Refreshed", () => {
        const specificToday = new Date("2018-07-01")
        const monthlyDeadline = new Date("2018-06-30")
        const newMonthlyDeadline = new Date("2018-07-31")
        const annualDeadline = new Date("2018-12-31")
        const leaveTypes = [{
            name: "sick",
            deadline: annualDeadline,
            totals: {
                days: 1
            }
        }, {
            name: "familyCare",
            deadline: annualDeadline,
            totals: {
                days: 1
            }
        }, {
            name: "personal",
            deadline: annualDeadline,
            totals: {
                days: 1
            }
        }, {
            name: "menstrual",
            deadline: monthlyDeadline,
            totals: {
                days: 1
            }
        }, {
            name: "businessTrip",
            deadline: monthlyDeadline,
            totals: {
                days: 1
            }
        }]
        const refreshedLeaveTypes = lt.refreshBasicLeaveTypes(lt.leaveTypesGroups, leaveTypes, specificToday)
        expect(refreshedLeaveTypes.map(lt => lt.name)).toMatchObject(["menstrual", "businessTrip"])
        expect(leaveTypes.map(lt => lt.totals.days)).toMatchObject([1, 1, 1, 0, 0])
        expect(leaveTypes.map(lt => u.formatDate(lt.deadline))).toMatchObject([annualDeadline, annualDeadline, annualDeadline, newMonthlyDeadline, newMonthlyDeadline].map(date => u.formatDate(date)))
    })
    it("Annual Refreshed(=Monthly Refreshed as well)", () => {
        const specificToday = new Date("2019-01-01")
        const monthlyDeadline = new Date("2018-12-31")
        const newMonthlyDeadline = new Date("2019-01-31")
        const annualDeadline = new Date("2018-12-31")
        const newAnnualDeadline = new Date("2019-12-31")
        const leaveTypes = [{
            name: "sick",
            deadline: annualDeadline,
            totals: {
                days: 1
            }
        }, {
            name: "familyCare",
            deadline: annualDeadline,
            totals: {
                days: 1
            }
        }, {
            name: "personal",
            deadline: annualDeadline,
            totals: {
                days: 1
            }
        }, {
            name: "menstrual",
            deadline: monthlyDeadline,
            totals: {
                days: 1
            }
        }, {
            name: "businessTrip",
            deadline: monthlyDeadline,
            totals: {
                days: 1
            }
        }]
        const refreshedLeaveTypes = lt.refreshBasicLeaveTypes(lt.leaveTypesGroups, leaveTypes, specificToday)
        expect(refreshedLeaveTypes.map(lt => lt.name)).toMatchObject(leaveTypes.map(lt => lt.name))
        expect(leaveTypes.map(lt => lt.totals.days)).toMatchObject([0, 0, 0, 0, 0])
        expect(leaveTypes.map(lt => u.formatDate(lt.deadline))).toMatchObject([newAnnualDeadline, newAnnualDeadline, newAnnualDeadline, newMonthlyDeadline, newMonthlyDeadline].map(date => u.formatDate(date)))
    })
})
describe("refreshAnnualLT", () => {
    it("Annual Leave Type Refreshed", () => {
        const specificToday = new Date("2019-04-23")
        const arrivedDate = new Date("2018-04-23")
        const annualLT = {
            deadline: new Date("2019-04-22"),
            totals: {
                days: 10
            },
            consumes: {
                days: 2
            }
        }
        const annualPreRequestLT = {
            deadline: new Date("2020-04-22"),
            totals: {
                days: 11
            },
            consumes: {
                days: 1
            }
        }
        const records = [{
            leaveType: "annualPreRequest"
        }, {
            leaveType: "annual"
        }, {
            leaveType: "annual"
        }]
        lt.refreshAnnualLT(arrivedDate, annualLT, annualPreRequestLT, records, specificToday)
        expect(records.map(r => r.leaveType)).toMatchObject(["annual", "annual", "annual"])
        expect(annualLT.totals.days).toBe(11)
        expect(annualLT.consumes.days).toBe(1)
        expect(u.formatDate(annualLT.deadline)).toMatch(u.formatDate(new Date("2020-04-22")))
        expect(annualPreRequestLT.totals.days).toBe(12)
        expect(annualPreRequestLT.consumes.days).toBe(0)
        expect(u.formatDate(annualPreRequestLT.deadline)).toMatch(u.formatDate(new Date("2021-04-22")))
    })
})
describe("refresh", () => {
    it("", () => {
        const employee = {
            activatedLeaveTypes: [],
            records: []
        }
        expect(lt.refresh(employee)).toMatchObject(employee)
    })
})