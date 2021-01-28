import { Factory } from "fishery"

import { DateTimeUtils } from "../utils"
import { RawExposure } from "../gaen/dataConverters"

export default Factory.define<RawExposure>(() => {
  const defaultDate = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(2))
  return {
    id: "raw-exposure",
    date: defaultDate,
    totalRiskScore: 4,
    weightedDurationSum: 2000,
  }
})
