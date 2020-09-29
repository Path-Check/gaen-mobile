import dayjs from "dayjs"

import { CheckInStatus, DayLogData } from "./symptoms"

export type Posix = number

export const toLogDataHistory = (
  dayLogData: DayLogData[],
  dayCount: number,
  now = Date.now(),
): DayLogData[] => {
  const calendar = calendarDays(now, dayCount)
  const dateLogDataMap: Record<Posix, DayLogData> = dayLogData.reduce(
    (dict, element) => {
      const startOfDay = dayjs(element.date).startOf("day").valueOf()
      dict[startOfDay] = element
      return dict
    },
    {},
  )
  return calendar.map((date: Posix) => {
    if (dateLogDataMap[date]) {
      return dateLogDataMap[date]
    } else {
      return {
        date,
        logEntries: [],
        checkIn: {
          status: CheckInStatus.NotCheckedIn,
          date,
        },
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
