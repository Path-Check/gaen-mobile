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
      const rawExposures: RawExposure[] = [
        {
          id: "ABCD-EFGH",
          date: twoDaysAgo,
          weightedDurationSum: 2000,
        },
      ]
      const expected: ExposureDatum = {
        date: DateTimeUtils.beginningOfDay(twoDaysAgo),
        id: "ABCD-EFGH",
        duration: 2000,
      }

      const result = toExposureInfo(rawExposures)

      expect(result.length).toEqual(1)
      expect(result).toEqual([expected])
    })
  })
})
