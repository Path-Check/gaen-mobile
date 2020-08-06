import dayjs from "dayjs"

import { Possible, ExposureDatum } from "../exposure"

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
  const groupedExposures = rawExposures.map(toPossible).reduce(groupByDate, {})
  return Object.values(groupedExposures).sort((a, b) => b.date - a.date)
}

const toPossible = (r: RawExposure): Possible => {
  const beginningOfDay = (date: Posix) => dayjs(date).startOf("day")
  return {
    kind: "Possible",
    date: beginningOfDay(r.date).valueOf(),
    duration: r.duration,
  }
}

const combinePossibles = (a: Possible, b: Possible): Possible => {
  return {
    ...a,
    duration: a.duration + b.duration,
  }
}

const groupByDate = (
  groupedExposures: Record<Posix, Possible>,
  exposure: Possible,
): Record<Posix, Possible> => {
  const date = exposure.date
  if (groupedExposures[date]) {
    groupedExposures[date] = combinePossibles(groupedExposures[date], exposure)
  } else {
    groupedExposures[date] = exposure
  }
  return groupedExposures
}
