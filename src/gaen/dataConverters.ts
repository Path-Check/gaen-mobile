import { ExposureDatum } from "../exposure"
import { DateTimeUtils } from "../utils"

type UUID = string
type Posix = number

export interface RawExposure {
  id: UUID
  date: Posix
  weightedDurationSum: number
}

export const toExposureInfo = (
  rawExposures: RawExposure[],
): ExposureDatum[] => {
  const groupedExposures = rawExposures.map(toExposureDatum)
  const twoWeeksAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(14))
  const recentExposures = Object.values(groupedExposures)
    .filter((exposure) => exposure.date > twoWeeksAgo)
    .sort((a, b) => b.date - a.date)
  return recentExposures
}

const toExposureDatum = (r: RawExposure): ExposureDatum => {
  return {
    id: r.id,
    date: DateTimeUtils.beginningOfDay(r.date),
    duration: r.weightedDurationSum,
  }
}
