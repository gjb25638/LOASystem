const r = require("../../../src/shared/report")
const u = require("../../../src/shared/util")

describe("filterBetweenDates", () => {
    const records = [{
        dates: ["2019-01-01", "2019-01-02", "2019-01-03"]
    }].map(record => ({ dates: record.dates.map(date => new Date(date)) }))
    it('Match 1 Date from 1 Record => 1 Record', () => {
        const start = new Date("2019-01-01")
        const end = new Date("2019-01-02")
        expect(r.filterBetweenDates(records, start, end)).toMatchObject(records)
    })
    it('Match All Dates from 1 Record => 1 Record', () => {
        const start = new Date("2019-01-01")
        const end = new Date("2019-01-04")
        expect(r.filterBetweenDates(records, start, end)).toMatchObject(records)
    })
    it('Match 0 Dates from 1 Record => 0 Record', () => {
        const start = new Date("2019-01-04")
        const end = new Date("2019-01-05")
        expect(r.filterBetweenDates(records, start, end)).toMatchObject([])
    })
})
describe("groupByLeaveType", () => {
    it('', () => {
        const records = [{ leaveType: "annual" }, { leaveType: "annual" }, { leaveType: "annual" }, { leaveType: "personal" }, { leaveType: "personal" }, { leaveType: "sick" }]
        expect(r.groupByLeaveType(records)).toMatchObject(
            [
                { key: "annual", list: [{ leaveType: "annual" }, { leaveType: "annual" }, { leaveType: "annual" }] },
                { key: "personal", list: [{ leaveType: "personal" }, { leaveType: "personal" }] },
                { key: "sick", list: [{ leaveType: "sick" }] }
            ])
    })
})
describe("removeUnMatchedDatesFromRecord", () => {
    const dates = ["2019-01-31", "2019-02-01"].map(date => new Date(date))
    it('Unmatched Month', () => {
        expect(r.filterMatchedDates(dates, { month: 1 })).toMatchObject(["2019-01-31"].map(date => new Date(date)))
    })
    it('Unmatched Day', () => {
        expect(r.filterMatchedDates(dates, { day: 1 })).toMatchObject(["2019-02-01"].map(date => new Date(date)))
    })
})
describe("groupBy", () => {
    it('Group by Month', () => {
        const records = [
            { _id: 0, dates: ["2019-01-01"].map(date => new Date(date)) },
            { _id: 1, dates: ["2019-01-01", "2019-01-02", "2019-02-02"].map(date => new Date(date)) },
            { _id: 2, dates: ["2019-02-01"].map(date => new Date(date)) }]
        expect(r.groupBy(records)).toMatchObject([
            [{ _id: 0, dates: ["2019-01-01"].map(date => new Date(date)) }, { _id: 1, dates: ["2019-01-01", "2019-01-02"].map(date => new Date(date)) }],
            [{ _id: 1, dates: ["2019-02-02"].map(date => new Date(date)) }, { _id: 2, dates: ["2019-02-01"].map(date => new Date(date)) }], [], [], [], [], [], [], [], [], [], []])
    })
    it('Group by Day', () => {
        const records = [
            { _id: 0, dates: ["2019-02-01"].map(date => new Date(date)) },
            { _id: 1, dates: ["2019-02-02", "2019-02-03", "2019-02-04"].map(date => new Date(date)) },
            { _id: 2, dates: ["2019-02-04"].map(date => new Date(date)) }]
        expect(r.groupBy(records, 2)).toMatchObject([
            [{ _id: 0, dates: ["2019-02-01"].map(date => new Date(date)) }],
            [{ _id: 1, dates: ["2019-02-02"].map(date => new Date(date)) }],
            [{ _id: 1, dates: ["2019-02-03"].map(date => new Date(date)) }],
            [{ _id: 1, dates: ["2019-02-04"].map(date => new Date(date)) }, { _id: 2, dates: ["2019-02-04"].map(date => new Date(date)) }], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []])
    })
})
describe("filterWithin", () => {
    const records = [
        { _id: 0, dates: ["2018-12-31"].map(date => new Date(date)) },
        { _id: 1, dates: ["2018-12-31", "2019-01-01"].map(date => new Date(date)) },
        { _id: 2, dates: ["2019-01-01"].map(date => new Date(date)) }]
    it('Filter in Same Year', () => {
        const year = 2019
        expect(r.filterWithin(records, year)).toMatchObject([
            { _id: 1, dates: ["2018-12-31", "2019-01-01"].map(date => new Date(date)) },
            { _id: 2, dates: ["2019-01-01"].map(date => new Date(date)) }])
    })
    it('Filter in Same Year & Month', () => {
        const year = 2018
        const month = 12
        expect(r.filterWithin(records, year, month)).toMatchObject([
            { _id: 0, dates: ["2018-12-31"].map(date => new Date(date)) },
            { _id: 1, dates: ["2018-12-31", "2019-01-01"].map(date => new Date(date)) }])
    })
})
describe("transformToAnnualInfo", () => {
    const annualLTRecords = [{
        dates: ["2018-04-22"],
        totals: {
            days: 1
        }
    },
    {
        dates: ["2018-04-23"],
        totals: {
            days: 1
        }
    },
    {
        dates: ["2019-04-23"],
        totals: {
            days: 1
        }
    },
    {
        dates: ["2020-04-23"],
        totals: {
            days: 1
        }
    },
    {
        dates: ["2020-04-24"],
        totals: {
            days: 1
        }
    }].map(x => Object.assign({}, x, { dates: x.dates.map(date => new Date(date)) }))
    const dateRanges = [
        { start: new Date("2018-04-23"), end: new Date("2019-04-23"), days: 10 },
        { start: new Date("2019-04-23"), end: new Date("2020-04-23"), days: 11 }]
    it('', () => {
        expect(r.transformToAnnualInfo(annualLTRecords, dateRanges)).toMatchObject([
            { deadline: "2018~2019", totalDays: 10, totals: { days: 1, hours: 0 } },
            { deadline: "2019~2020", totalDays: 11, totals: { days: 1, hours: 0 } }
        ])
    })
})
describe("getAnnualLTTotalDays", () => {
    it('', () => {
        const arrivedDate = new Date("2018-04-23")
        const year = 2019
        expect(r.getAnnualLTTotalDays(arrivedDate, year)).toMatchObject([
            { start: new Date(2018, 3, 23), end: new Date(2019, 3, 23), days: 10 },
            { start: new Date(2019, 3, 23), end: new Date(2020, 3, 23), days: 11 }
        ])
    })
})
describe("", () => {
    it('', () => {
        expect()
    })
})