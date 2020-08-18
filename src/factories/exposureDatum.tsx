import { Factory } from "fishery"

import { DateTimeUtils } from "../utils"

import { ExposureDatum } from "../exposure"

export default Factory.define<ExposureDatum>(({ sequence }) => {
  const defaultDate = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(2))
  return {
    id: sequence.toString(),
    date: defaultDate,
    duration: 300000,
    totalRiskScore: 4,
  }
})
