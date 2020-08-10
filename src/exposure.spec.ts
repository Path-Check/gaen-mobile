import { factories } from "./factories"
import { DateTimeUtils } from "./utils"

import { exposureWindowBucket } from "./exposure"

describe("exposureWindow", () => {
  describe("when the exposure date is one day ago", () => {
    it("returns 1 day ago to 3 days ago", () => {
      const today = Date.now()
      const threeDaysAgo = DateTimeUtils.daysAgo(3)
      const exposureToday = factories.exposureDatum.build({
        date: today,
      })
      const exposureThreeDaysAgo = factories.exposureDatum.build({
        date: threeDaysAgo,
      })

      const resultToday = exposureWindowBucket(exposureToday)
      const resultThreeDaysAgo = exposureWindowBucket(exposureThreeDaysAgo)

      expect(resultToday).toEqual("TodayToThreeDaysAgo")
      expect(resultThreeDaysAgo).toEqual("TodayToThreeDaysAgo")
    })
  })

  describe("when the exposure date is 4 days ago", () => {
    it("returns a bucket of 4 to 6 days ago", () => {
      const fiveDaysAgo = DateTimeUtils.daysAgo(5)
      const exposureFiveDaysAgo = factories.exposureDatum.build({
        date: fiveDaysAgo,
      })

      const resultFiveDaysAgo = exposureWindowBucket(exposureFiveDaysAgo)

      expect(resultFiveDaysAgo).toEqual("FourToSixDaysAgo")
    })
  })

  describe("when the exposure date is more than 6 days ago", () => {
    it("returns a bucket of 7 to 14 days ago", () => {
      const eightDaysAgo = DateTimeUtils.daysAgo(8)
      const exposureEightDaysAgo = factories.exposureDatum.build({
        date: eightDaysAgo,
      })

      const resultEightDaysAgo = exposureWindowBucket(exposureEightDaysAgo)

      expect(resultEightDaysAgo).toEqual("SevenToFourteenDaysAgo")
    })
  })
})
