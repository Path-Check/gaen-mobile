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

type RiskLevels = {
  overall: number
  testPositivityRatio: number
  caseDensity: number
  contactTracerCapacityRatio: number
  infectionRate: number
  icuHeadroomRatio: number
}

export const emptyMetrics = {
  testPositivityRatio: 0,
  caseDensity: 0,
  contactTracerCapacityRatio: 0,
  infectionRate: 0,
  icuHeadroomRatio: 0,
}

export const emptyRiskLevels = {
  overall: 0,
  testPositivityRatio: 0,
  caseDensity: 0,
  contactTracerCapacityRatio: 0,
  infectionRate: 0,
  icuHeadroomRatio: 0,
}

export const empty: CovidData = {
  source: "",
  fips: "",
  country: "",
  state: "",
  population: 0,
  metrics: emptyMetrics,
  riskLevels: emptyRiskLevels,
  timeseries: [],
}

export const emptyDatum: CovidDatum = {
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

export const toLineChartCasesNew = (data: Timeseries): TrendData => {
  return data.map(toCasesNew).slice(0, 7)
}

export const toCasesNew = (datum: CovidDatum): number => {
  return datum.positiveCasesNew
}
