import { Factory } from "fishery"

import { DateTimeUtils } from "../utils"
import { CheckInStatus, DayLogData } from "../MyHealth/symptoms"

export default Factory.define<DayLogData>(() => {
  const defaultDate = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(2))
  return {
    date: defaultDate,
    checkIn: {
      date: defaultDate,
      status: CheckInStatus.FeelingGood,
    },
    logEntries: [],
  }
})
