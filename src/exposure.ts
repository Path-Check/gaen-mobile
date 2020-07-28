import { DateTimeUtils } from "./utils"

export type Posix = number

export interface Possible {
  kind: "Possible"
  date: Posix
  duration: number
  totalRiskScore: number
  transmissionRiskLevel: number
}

export interface NoKnown {
  kind: "NoKnown"
  date: Posix
}

export interface NoData {
  kind: "NoData"
  date: Posix
}

export type ExposureDatum = Possible | NoKnown | NoData

export type ExposureInfo = ExposureDatum[]

export type ExposureWindowBucket =
  | "TodayToThreeDaysAgo"
  | "FourToSixDaysAgo"
  | "SevenToFourteenDaysAgo"

export const exposureWindowBucket = (
  exposureDatum: Possible,
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
