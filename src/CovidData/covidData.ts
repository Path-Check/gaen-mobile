import { Colors } from "../styles"

export type CovidData = {
  source: string
  fips: string
  country: string
  state: string
  population: number
  metrics: Metrics
  riskLevels: RiskLevels
  timeseries: Timeseries
}

type Timeseries = CovidDatum[]

type Date = string

export type CovidDatum = {
  date: Date
  positiveCasesTotal: number
  positiveCasesNew: number
}

type Metrics = {
  testPositivityRatio: number
  caseDensity: number
  contactTracerCapacityRatio: number
  infectionRate: number
  icuHeadroomRatio: number
}

export type RiskLevels = {
  overall: number
  testPositivityRatio: number
  caseDensity: number
  contactTracerCapacityRatio: number
  infectionRate: number
  icuHeadroomRatio: number
}

export type RiskLevel =
  | "Low"
  | "Medium"
  | "High"
  | "Critical"
  | "Unknown"
  | "Extreme"

export const toRiskLevel = (rawRiskLevel: number): RiskLevel => {
  switch (rawRiskLevel) {
    case 0:
      return "Low"
    case 1:
      return "Medium"
    case 2:
      return "High"
    case 3:
      return "Critical"
    case 4:
      return "Unknown"
    case 5:
      return "Extreme"
    default:
      return "Unknown"
  }
}

export const toRiskLevelString = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case "Low":
      return "Low"
    case "Medium":
      return "Medium"
    case "High":
      return "High"
    case "Critical":
      return "Critical"
    case "Unknown":
      return "Unknown"
    case "Extreme":
      return "Extreme"
    default:
      return "Unknown"
  }
}

export const toRiskLevelColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case "Low":
      return Colors.riskLevel.low
    case "Medium":
      return Colors.riskLevel.medium
    case "High":
      return Colors.riskLevel.high
    case "Critical":
      return Colors.riskLevel.critical
    case "Unknown":
      return Colors.riskLevel.unknown
    case "Extreme":
      return Colors.riskLevel.extreme
    default:
      return Colors.riskLevel.unknown
  }
}

export const initialMetrics = {
  testPositivityRatio: 0,
  caseDensity: 0,
  contactTracerCapacityRatio: 0,
  infectionRate: 0,
  icuHeadroomRatio: 0,
}

export const initialRiskLevels = {
  overall: 0,
  testPositivityRatio: 0,
  caseDensity: 0,
  contactTracerCapacityRatio: 0,
  infectionRate: 0,
  icuHeadroomRatio: 0,
}

export const initial: CovidData = {
  source: "",
  fips: "",
  country: "",
  state: "",
  population: 0,
  metrics: initialMetrics,
  riskLevels: initialRiskLevels,
  timeseries: [],
}

export const initialDatum: CovidDatum = {
  date: "2020-01-01",
  positiveCasesTotal: 0,
  positiveCasesNew: 0,
}

export const toNewCasesPercentage = (data: Timeseries): number | null => {
  if (!(data.length > 1)) {
    return null
  }

  const positiveNew = data.map(toPositiveNew)
  const [today, ...previous] = positiveNew
  const sumPrevious = previous.reduce((a, b) => a + b, 0)
  const average = sumPrevious / (data.length - 1)

  return percentDifference(today, average)
}

const toPositiveNew = (datum: CovidDatum): number => {
  return datum.positiveCasesNew
}

const percentDifference = (a: number, b: number) => {
  const result = Math.round(((a - b) / b) * 100)
  return result
}

type TrendData = number[]

export const numberOfDaysInTrend = 100

export const toLineChartCasesNew = (data: Timeseries): TrendData => {
  return data.map(toCasesNew).slice(0, numberOfDaysInTrend).reverse()
}

export const toCasesNew = (datum: CovidDatum): number => {
  return datum.positiveCasesNew
}
