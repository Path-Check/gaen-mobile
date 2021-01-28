import dayjs from "dayjs"

export type Posix = number
type UUID = string

export interface ExposureDatum {
  id: UUID
  date: Posix
  duration: number
}

export type ExposureInfo = ExposureDatum[]

type ExposureRange = [Posix, Posix]

export const toExposureRange = ({ date }: ExposureDatum): ExposureRange => {
  const start = dayjs.utc(date).subtract(1, "day").valueOf()
  const end = dayjs.utc(date).add(1, "day").valueOf()
  return [start, end]
}
