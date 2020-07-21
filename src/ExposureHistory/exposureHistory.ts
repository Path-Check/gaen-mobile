import dayjs from "dayjs"

import { ExposureDatum, ExposureInfo } from "../exposure"

export type Posix = number

export type ExposureHistory = ExposureDatum[]

export const toExposureHistory = (
  exposureInfo: ExposureInfo,
  dayCount: number,
  now = Date.now(),
): ExposureHistory => {
  const calendar = calendarDays(now, dayCount)
  return calendar.map((date: Posix) => {
    if (exposureInfo[date]) {
      return exposureInfo[date]
    } else {
      return {
        kind: "NoKnown",
        date,
      }
    }
  })
}

export const calendarDays = (today: Posix, totalDays: number): Posix[] => {
  const saturday = nextSaturday(today)

  const daysAgo = [...Array(totalDays)].map((_v, idx: number) => {
    return totalDays - 1 - idx
  })

  return daysAgo.map(
    (daysAgo: number): Posix => {
      return dayjs(saturday).subtract(daysAgo, "day").startOf("day").valueOf()
    },
  )
}

const nextSaturday = (date: Posix): Posix => {
  const saturdayDayOfWeek = 6
  const dayOfWeek = dayjs(date).day()
  const daysUntilNextSaturday = saturdayDayOfWeek - dayOfWeek
  return dayjs(date).add(daysUntilNextSaturday, "day").valueOf()
}
