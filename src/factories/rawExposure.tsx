import { Factory } from "fishery"

import { daysAgo, beginningOfDay } from "../utils/dateTimeUtils"
import { RawExposure } from "../gaen/exposureNotifications"

export default Factory.define<RawExposure>(() => {
  const defaultDate = beginningOfDay(daysAgo(2))
  return {
    id: "raw-exposure",
    date: defaultDate,
    duration: 300000,
    totalRiskScore: 4,
    transmissionRiskLevel: 7,
  }
})
