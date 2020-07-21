import { Factory } from "fishery"

import { DateTimeUtils } from "../utils"

import { ExposureDatum } from "../exposure"

export default Factory.define<ExposureDatum>(() => {
  const defaultDate = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(2))
  return {
    kind: "Possible",
    date: defaultDate,
    duration: 300000,
    totalRiskScore: 4,
    transmissionRiskLevel: 7,
  }
})
