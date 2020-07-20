import dayjs, { Dayjs } from "dayjs"
import duration from "dayjs/plugin/duration"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(localizedFormat)

export type Posix = number

type DurationRoundedToFiveMinuteIncrement = number

export const durationToString = (
  duration: DurationRoundedToFiveMinuteIncrement,
): string => {
  /// Native layer returns length of exposure in
  /// 5 minute increments with a 30 minute maximum.
  /// 1 is the smallest possible number of 5 minute increments,
  /// so if we receive 1 from the native layer, we display "one minute"
  const durationMinutes = Math.max(duration, 1)
  return dayjs.duration({ minutes: durationMinutes }).humanize(false)
}

export const isToday = (date: Posix): boolean => {
  const now = Date.now()
  const beginningOfToday = beginningOfDay(now)
  const endOfToday = dayjs(now).endOf("day").valueOf()
  return beginningOfToday <= date && endOfToday >= date
}

export const daysAgo = (days: number): Posix => {
  return dayjs(Date.now()).subtract(days, "day").valueOf()
}

export const beginningOfDay = (date: Posix): Posix => {
  return dayjs(date).startOf("day").valueOf()
}

export const isInFuture = (date: Posix): boolean => {
  return date > Date.now()
}

export const posixToDayjs = (posixDate: Posix): Dayjs | null => {
  const dayJsDate = dayjs(posixDate)
  return dayJsDate.isValid() ? dayJsDate : null
}

export const timeAgoInWords = (posix: Posix): string => {
  const day = posixToDayjs(posix)
  return day ? day.fromNow() : ""
}
