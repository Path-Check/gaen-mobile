import dayjs from "dayjs"

import { DateTimeUtils } from "../utils"
import { ExposureDatum } from "../exposure"
import { toExposureInfo, RawExposure } from "./dataConverters"

describe("toExposureInfo", () => {
  describe("when there are no exposure notifications", () => {
    it("returns an empty ExposureInfo", () => {
      const rawExposures: RawExposure[] = []

      const result = toExposureInfo(rawExposures)

      expect(result).toEqual([])
    })
  })

  describe("when there was a possible exposure two days ago", () => {
    it("returns an ExposureInfo with a PossibleExposure at the correct date", () => {
      const today = Date.now()
      const twoDaysAgo = dayjs(today).subtract(2, "day").valueOf()
      const duration = 30 * 60 * 1000
      const rawExposures: RawExposure[] = [
        {
          id: "ABCD-EFGH",
          date: twoDaysAgo,
          duration,
        },
      ]
      const expected: ExposureDatum = {
        date: DateTimeUtils.beginningOfDay(twoDaysAgo),
        duration: duration,
        id: "ABCD-EFGH",
      }

      const result = toExposureInfo(rawExposures)

      expect(result.length).toEqual(1)
      expect(result).toEqual([expected])
    })
  })

  describe("when there are multiple raw exposures on the same day", () => {
    it("combines the raw exposure into a single possible exposure with the sum of duration and max of risk", () => {
      const today = Date.now()
      const beginningOfDay = DateTimeUtils.beginningOfDay(today)
      const duration1 = 30 * 60 * 1000
      const duration2 = 10 * 60 * 1000
      const duration3 = 25 * 60 * 1000
      const rawExposures: RawExposure[] = [
        {
          id: "raw-exposure-1",
          date: beginningOfDay + 1000,
          duration: duration1,
        },
        {
          id: "raw-exposure-2",
          date: beginningOfDay + 18000,
          duration: duration2,
        },
        {
          id: "raw-exposure-3",
          date: beginningOfDay + 36000,
          duration: duration3,
        },
      ]
      const expected: ExposureDatum = {
        date: DateTimeUtils.beginningOfDay(today),
        duration: duration1 + duration2 + duration3,
        id: "raw-exposure-1",
      }

      const result = toExposureInfo(rawExposures)

      expect(result).toEqual([expected])
    })
  })
})
