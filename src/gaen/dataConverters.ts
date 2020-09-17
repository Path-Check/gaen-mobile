import dayjs from "dayjs"

import { ExposureDatum } from "../exposure"

type UUID = string
type Posix = number

export interface RawExposure {
  id: UUID
  date: Posix
}

export const toExposureInfo = (
  rawExposures: RawExposure[],
): ExposureDatum[] => {
  const groupedExposures = rawExposures.map(toExposureDatum)
  return Object.values(groupedExposures).sort((a, b) => b.date - a.date)
}

const toExposureDatum = (r: RawExposure): ExposureDatum => {
  const beginningOfDay = (date: Posix) => dayjs(date).startOf("day")
  return {
    id: r.id,
    date: beginningOfDay(r.date).valueOf(),
  }
}
