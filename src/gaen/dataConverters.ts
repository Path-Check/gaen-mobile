import dayjs from "dayjs"

import { ExposureDatum } from "../exposure"

type UUID = string
type Posix = number

export interface RawExposure {
  id: UUID
  date: Posix
  duration: number
}

export const toExposureInfo = (
  rawExposures: RawExposure[],
): ExposureDatum[] => {
  const groupedExposures = rawExposures
    .map(toExposureDatum)
    .reduce(groupByDate, {})
  return Object.values(groupedExposures).sort((a, b) => b.date - a.date)
}

const toExposureDatum = (r: RawExposure): ExposureDatum => {
  const beginningOfDay = (date: Posix) => dayjs(date).startOf("day")
  return {
    id: r.id,
    date: beginningOfDay(r.date).valueOf(),
    duration: r.duration,
  }
}

const combineDatum = (
  firstDatum: ExposureDatum,
  secondDatum: ExposureDatum,
): ExposureDatum => {
  return {
    ...firstDatum,
    duration: firstDatum.duration + secondDatum.duration,
  }
}

const groupByDate = (
  groupedExposures: Record<Posix, ExposureDatum>,
  exposure: ExposureDatum,
): Record<Posix, ExposureDatum> => {
  const date = exposure.date
  if (groupedExposures[date]) {
    groupedExposures[date] = combineDatum(groupedExposures[date], exposure)
  } else {
    groupedExposures[date] = exposure
  }
  return groupedExposures
}
