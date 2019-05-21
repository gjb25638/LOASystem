const u = require("../../../src/shared/util")

describe("diffMonth", () => {
    it("", () => {
        const from = new Date("2018-01-02")
        const to = new Date("2018-01-01")
        expect(u.diffMonth(from, to)).toBe(0)
    })
})
describe("toDateInfo", () => {
    it("", () => {
        expect(u.toDateInfo()).toBeUndefined()
    })
})
describe("formatDate", () => {
    it("", () => {
        const date = new Date("2019-01-01")
        expect(u.formatDate(date)).toMatch("2019-01-01")
    })
    it("Passing Nothing", () => {
        expect(u.formatDate()).toMatch("")
    })
})
