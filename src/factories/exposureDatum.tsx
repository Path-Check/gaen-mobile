import { Factory } from "fishery"

import { daysAgo, beginningOfDay } from "../utils/dateTimeUtils"

import { ExposureDatum } from "../exposureHistory"

export default Factory.define<ExposureDatum>(() => {
  const defaultDate = beginningOfDay(daysAgo(2))
  return {
    kind: "Possible",
    date: defaultDate,
    duration: 300000,
    totalRiskScore: 4,
    transmissionRiskLevel: 7,
  }
})
