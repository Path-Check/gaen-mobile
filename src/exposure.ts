import { DateTimeUtils } from "./utils"

export type Posix = number

export interface ExposureDatum {
  date: Posix
  duration: number
}

export type ExposureInfo = ExposureDatum[]

export type ExposureWindowBucket =
  | "TodayToThreeDaysAgo"
  | "FourToSixDaysAgo"
  | "SevenToFourteenDaysAgo"

export const exposureWindowBucket = (
  exposureDatum: ExposureDatum,
): ExposureWindowBucket => {
  const date = exposureDatum.date
  const threeDaysAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(3))
  const sevenDaysAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(7))

  if (date >= threeDaysAgo) {
    return "TodayToThreeDaysAgo"
  } else if (date > sevenDaysAgo) {
    return "FourToSixDaysAgo"
  } else {
    return "SevenToFourteenDaysAgo"
  }
}
