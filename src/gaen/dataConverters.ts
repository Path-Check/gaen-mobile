import dayjs from "dayjs"

import { ExposureInfo, Possible, ExposureDatum } from "../exposure"

type UUID = string
type Posix = number

export interface RawExposure {
  id: UUID
  date: Posix
  duration: number
  totalRiskScore: number
  transmissionRiskLevel: number
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
    transmissionRiskLevel: r.transmissionRiskLevel,
    totalRiskScore: r.totalRiskScore,
  }
}

const combinePossibles = (a: Possible, b: Possible): Possible => {
  return {
    ...a,
    duration: a.duration + b.duration,
    totalRiskScore: Math.max(a.totalRiskScore, b.totalRiskScore),
    transmissionRiskLevel: Math.max(
      a.transmissionRiskLevel,
      b.transmissionRiskLevel,
    ),
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
