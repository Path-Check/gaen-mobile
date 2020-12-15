import { determineRemainingQuarantine } from "./ExposureSummary"

describe("determineRemainingQuarantine", () => {
  describe("when given an exposure date, todays date, and a length of quarantine", () => {
    it("returns the number of days remaining in the quarantine period with an extra day of padding", () => {
      const today = new Date("2020-12-15").valueOf()
      const quarantineLength = 14

      const date1 = new Date("2020-01-01").valueOf()
      const date2 = new Date("2020-11-30").valueOf()
      const date3 = new Date("2020-12-01").valueOf()
      const date4 = new Date("2020-12-04").valueOf()
      const date5 = new Date("2020-12-14").valueOf()
      const date6 = new Date("2020-12-15").valueOf()

      const result1 = determineRemainingQuarantine(
        quarantineLength,
        today,
        date1,
      )
      const result2 = determineRemainingQuarantine(
        quarantineLength,
        today,
        date2,
      )
      const result3 = determineRemainingQuarantine(
        quarantineLength,
        today,
        date3,
      )
      const result4 = determineRemainingQuarantine(
        quarantineLength,
        today,
        date4,
      )
      const result5 = determineRemainingQuarantine(
        quarantineLength,
        today,
        date5,
      )
      const result6 = determineRemainingQuarantine(
        quarantineLength,
        today,
        date6,
      )

      expect(result1).toEqual(0)
      expect(result2).toEqual(0)
      expect(result3).toEqual(1)
      expect(result4).toEqual(4)
      expect(result5).toEqual(14)
      expect(result6).toEqual(14)
    })
  })
})
