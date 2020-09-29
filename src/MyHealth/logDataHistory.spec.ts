import { CheckInStatus, DayLogData } from "./symptoms"
import { toLogDataHistory } from "../MyHealth/logDataHistory"
import { factories } from "../factories"

describe("toLogDataHistory", () => {
  describe("when there are no logs", () => {
    it('populates entries with "NotCheckedIn" status', () => {
      const logDataHistory = toLogDataHistory([], 30)
      logDataHistory.forEach((entry: DayLogData) => {
        expect(entry.checkIn.status).toEqual(CheckInStatus.NotCheckedIn)
      })
    })
    it("creates the requested number of entries", () => {
      const logDataHistory = toLogDataHistory([], 30)
      expect(logDataHistory.length).toEqual(30)
    })
  })

  describe("when there are logs", () => {
    describe("when there are checkins", () => {
      it("populates entries with the checkin status from each checkin", () => {
        const logData = factories.dayLogData.build()
        const logDataHistory = toLogDataHistory([logData], 30)
        expect(
          logDataHistory.filter(
            (entry: DayLogData) =>
              entry.checkIn.status === CheckInStatus.FeelingGood,
          ).length,
        ).toEqual(1)
        expect(
          logDataHistory.filter(
            (entry: DayLogData) =>
              entry.checkIn.status === CheckInStatus.NotCheckedIn,
          ).length,
        ).toEqual(29)
      })
    })
  })
})
