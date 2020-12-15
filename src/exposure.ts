import dayjs from "dayjs"

export type Posix = number
type UUID = string

export interface ExposureDatum {
  id: UUID
  date: Posix
}

export type ExposureInfo = ExposureDatum[]

type ExposureDateRangeStrings = {
  start: string
  end: string
}

const toExposureDateRangeStrings = (date: Posix): ExposureDateRangeStrings => {
  return {
    start: dayjs.utc(date).subtract(1, "day").format("dddd, MMM Do"),
    end: dayjs.utc(date).add(1, "day").format("dddd, MMM Do"),
  }
}

export const toDateRangeString = ({ date }: ExposureDatum): string => {
  const { start, end } = toExposureDateRangeStrings(date)

  return `${start} - ${end}`
}

export const toStartDateString = ({ date }: ExposureDatum): string => {
  return toExposureDateRangeStrings(date).start
}

export const toEndDateString = ({ date }: ExposureDatum): string => {
  return toExposureDateRangeStrings(date).end
}
