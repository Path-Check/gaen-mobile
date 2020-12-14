import dayjs, { Dayjs } from "dayjs"
import duration from "dayjs/plugin/duration"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import advancedFormat from "dayjs/plugin/advancedFormat"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(localizedFormat)
dayjs.extend(advancedFormat)

export type Posix = number

type DurationMinutes = number

export const durationToString = (duration: DurationMinutes): string => {
  return dayjs.duration({ minutes: duration }).humanize(false)
}

export const isToday = (date: Posix): boolean => {
  const now = Date.now()
  const beginningOfToday = beginningOfDay(now)
  const endOfToday = dayjs.utc(now).endOf("day").valueOf()
  return beginningOfToday <= date && endOfToday >= date
}

export const isSameDay = (dateA: Posix, dateB: Posix): boolean => {
  return dayjs(dateA).isSame(dateB, "day")
}

export const daysAgo = (days: number): Posix => {
  return dayjs.utc(Date.now()).subtract(days, "day").valueOf()
}

export const daysAgoFrom = (days: number, today: Posix): Posix => {
  return dayjs.utc(today).subtract(days, "day").valueOf()
}

export const beginningOfDay = (date: Posix): Posix => {
  return dayjs.utc(date).startOf("day").valueOf()
}

export const isInFuture = (date: Posix): boolean => {
  return date > Date.now()
}

export const posixToDayjs = (posixDate: Posix): Dayjs | null => {
  const dayJsDate = dayjs.utc(posixDate)
  return dayJsDate.isValid() ? dayJsDate : null
}

export const timeAgoInWords = (posix: Posix): string => {
  const day = posixToDayjs(posix)
  return day ? day.fromNow() : ""
}
