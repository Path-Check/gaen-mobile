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

export type ExposureInfo = Record<Posix, ExposureDatum>
