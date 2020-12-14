import dayjs from "dayjs"

export type Posix = number
type UUID = string

export interface ExposureDatum {
  id: UUID
  date: Posix
}

export type ExposureInfo = ExposureDatum[]

export const toDateRangeString = ({ date }: ExposureDatum): string => {
  const previousDay = dayjs.utc(date).subtract(1, "day").format("dddd, MMM Do")
  const nextDay = dayjs.utc(date).add(1, "day").format("dddd, MMM Do")
  return `${previousDay} - ${nextDay}`
}
