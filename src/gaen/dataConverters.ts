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
  return Object.values(groupedExposures).sort((a, b) => b.date - a.date)
}

const toExposureDatum = (r: RawExposure): ExposureDatum => {
  return {
    id: r.id,
    date: DateTimeUtils.beginningOfDay(r.date),
    duration: r.weightedDurationSum,
  }
}
